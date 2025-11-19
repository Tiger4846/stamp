import { PrismaClient, UserRole, SponsorLevel } from '../app/generated/prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Load data from JSON files
const loadJsonData = (filename: string) => {
    const filePath = path.join(__dirname, '..', 'data', filename)
    const rawData = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(rawData)
}

const usersData = loadJsonData('users.json')
const sponsorsData = loadJsonData('sponsors.json')

async function seedUsers() {
    console.log('[USERS] Seeding users...')
    
    const createdUsers = []
    
    for (const userData of usersData.users) {
        try {
            // Use the id from JSON as the user id to match adminId in sponsors
            const user = await prisma.user.create({
                data: {
                    id: userData.id,
                    name: userData.name,
                    phone: userData.phone,
                    role: userData.role as UserRole,
                    qrCode: userData.qrCode,
                    isClaimed: userData.isClaimed,
                },
            })
            createdUsers.push(user)
            console.log(`[SUCCESS] Created user: ${user.name} (${user.phone}) - Role: ${user.role}`)
        } catch (error) {
            console.log(`[ERROR] Failed to create user ${userData.name}:`, error)
        }
    }

    console.log(`[SUCCESS] ${createdUsers.length} users seeded successfully!`)
    return createdUsers
}

async function seedSponsors() {
    console.log('[SPONSORS] Seeding sponsors...')
    
    const createdSponsors = []
    
    for (const sponsorData of sponsorsData.sponsors) {
        try {
            const sponsor = await prisma.sponsor.create({
                data: {
                    id: sponsorData.id,
                    name: sponsorData.name,
                    phone: sponsorData.phone,
                    level: sponsorData.level as SponsorLevel,
                    adminId: sponsorData.adminId,
                    logoUrl: sponsorData.logoUrl,
                },
            })
            createdSponsors.push(sponsor)
            console.log(`[SUCCESS] Created sponsor: ${sponsor.name} (${sponsor.level}) - Admin: ${sponsor.adminId}`)
        } catch (error) {
            console.log(`[ERROR] Failed to create sponsor ${sponsorData.name}:`, error)
        }
    }

    console.log(`[SUCCESS] ${createdSponsors.length} sponsors seeded successfully!`)
    return createdSponsors
}

async function seedSampleStampTransactions() {
    console.log('[STAMP_TRANSACTIONS] Seeding sample stamp transactions...')
    
    // Get some users and sponsors for sample transactions
    const users = await prisma.user.findMany({ where: { role: 'user' }, take: 5 })
    const sponsors = await prisma.sponsor.findMany({ take: 3 })
    
    if (users.length === 0 || sponsors.length === 0) {
        console.log('[INFO] No users or sponsors found for sample transactions')
        return []
    }

    const sampleTransactions = []
    
    // Create some sample stamp transactions
    for (let i = 0; i < 10; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomSponsor = sponsors[Math.floor(Math.random() * sponsors.length)]
        const amount = Math.floor(Math.random() * 3) + 1 // 1-3 stamps
        
        try {
            const transaction = await prisma.stampTransaction.create({
                data: {
                    userId: randomUser.id,
                    sponsorId: randomSponsor.id,
                    amount: amount,
                },
            })
            sampleTransactions.push(transaction)
            
            // Update or create UserStamp record
            await prisma.userStamp.upsert({
                where: {
                    userId_sponsorId: {
                        userId: randomUser.id,
                        sponsorId: randomSponsor.id,
                    },
                },
                update: {
                    total: {
                        increment: amount,
                    },
                },
                create: {
                    userId: randomUser.id,
                    sponsorId: randomSponsor.id,
                    total: amount,
                },
            })
            
            console.log(`[SUCCESS] Created stamp transaction: User ${randomUser.name} got ${amount} stamps from ${randomSponsor.name}`)
        } catch (error) {
            console.log(`[ERROR] Failed to create stamp transaction:`, error)
        }
    }

    console.log(`[SUCCESS] ${sampleTransactions.length} stamp transactions seeded successfully!`)
    return sampleTransactions
}

async function main() {
    console.log('[INIT] Starting database seeding...')
    console.log('This will seed the stamp collection system with users and sponsors data.')

    try {
        // Clear existing data (optional - remove if you want to keep existing data)
        console.log('[CLEANUP] Cleaning up existing data...')
        await prisma.stampTransaction.deleteMany()
        await prisma.userStamp.deleteMany()
        await prisma.sponsor.deleteMany()
        await prisma.user.deleteMany()
        
        // Seed users first (since sponsors reference users via adminId)
        const users = await seedUsers()
        
        // Seed sponsors
        const sponsors = await seedSponsors()
        
        // Seed some sample stamp transactions
        const transactions = await seedSampleStampTransactions()

        console.log('\n[COMPLETE] Database seeding completed successfully!')
        console.log(`Summary:`)
        console.log(`- Users: ${users.length}`)
        console.log(`- Sponsors: ${sponsors.length}`)
        console.log(`- Sample Stamp Transactions: ${transactions.length}`)
        console.log(`\nRelationship mapping:`)
        console.log(`- Each sponsor.adminId maps to a user.id`)
        console.log(`- Admin users can manage their respective sponsor organizations`)
        
    } catch (error) {
        console.error('[ERROR] Seeding failed:', error)
        throw error
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('[COMPLETE] Database connection closed.')
    })
    .catch(async (e) => {
        console.error('[FATAL] Seeding process failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })