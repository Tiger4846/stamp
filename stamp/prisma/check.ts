import { PrismaClient } from '../app/generated/prisma/client'

const prisma = new PrismaClient()

async function checkData() {
    console.log('[INFO] Checking current database records...\n')
    
    try {
        const userCount = await prisma.user.count()
        const sponsorCount = await prisma.sponsor.count()
        const stampCount = await prisma.userStamp.count()
        const transactionCount = await prisma.stampTransaction.count()

        console.log('Current Database Records:')
        console.log(`   Users: ${userCount}`)
        console.log(`   Sponsors: ${sponsorCount}`)
        console.log(`   User Stamps: ${stampCount}`)
        console.log(`   Transactions: ${transactionCount}`)
        console.log(`   Total Records: ${userCount + sponsorCount + stampCount + transactionCount}`)

        if (userCount + sponsorCount + stampCount + transactionCount === 0) {
            console.log('\nDatabase is completely empty!')
            console.log('\nIf you\'re seeing sponsor records somewhere, check:')
            console.log('   • Prisma Studio at http://localhost:5555 (if running)')
            console.log('   • The JSON data files in data/ directory')
            console.log('   • Another database client or connection')
            console.log('   • Cached browser data if viewing through a web app')
        } else {
            console.log('\nDetailed Records:')
            
            if (userCount > 0) {
                const allUsers = await prisma.user.findMany({ select: { id: true, name: true, phone: true, role: true } })
                console.log('   Users:')
                allUsers.forEach((user, index) => {
                    console.log(`      ${index + 1}. ${user.name} (${user.phone}) - ${user.role}`)
                })
            }
            
            if (sponsorCount > 0) {
                const allSponsors = await prisma.sponsor.findMany({ 
                    select: { 
                        id: true, 
                        name: true, 
                        level: true, 
                        admin: { select: { name: true, phone: true } } 
                    } 
                })
                console.log('   🏢 Sponsors:')
                allSponsors.forEach((sponsor, index) => {
                    console.log(`      ${index + 1}. ${sponsor.name} (${sponsor.level}) - Admin: ${sponsor.admin.name}`)
                })
            }

            if (stampCount > 0) {
                const allStamps = await prisma.userStamp.findMany({ 
                    select: { 
                        total: true,
                        user: { select: { name: true, phone: true } },
                        sponsor: { select: { name: true } }
                    } 
                })
                console.log('   User Stamps:')
                allStamps.forEach((stamp, index) => {
                    console.log(`      ${index + 1}. ${stamp.user.name} has ${stamp.total} stamps from ${stamp.sponsor.name}`)
                })
            }

            if (transactionCount > 0) {
                const allTransactions = await prisma.stampTransaction.findMany({ 
                    select: { 
                        amount: true,
                        createdAt: true,
                        user: { select: { name: true } },
                        sponsor: { select: { name: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                })
                console.log('   Recent Transactions (last 10):')
                allTransactions.forEach((tx, index) => {
                    console.log(`      ${index + 1}. ${tx.user.name} received ${tx.amount} stamps from ${tx.sponsor.name} on ${tx.createdAt.toISOString()}`)
                })
            }
        }

    } catch (error) {
        console.error('[ERROR] Failed to check data:', error)
        process.exit(1)
    }
}

checkData()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })