import { PrismaClient } from '../app/generated/prisma/client'

const prisma = new PrismaClient()

async function clearData() {
    console.log('[INIT] Starting database cleanup...')
    
    const args = process.argv.slice(2)
    
    // Show help if requested
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Usage: npm run db:clear [options]

Options:
  --all            Clear all data (default)
  --transactions   Clear only stamp transactions
  --stamps         Clear only user stamps
  --sponsors       Clear only sponsors (will also clear dependent data)
  --users          Clear only users (will also clear ALL dependent data)
  --help, -h       Show this help message

Examples:
  npm run db:clear                     # Clear all data
  npm run db:clear -- --transactions   # Clear only transactions
  npm run db:clear -- --stamps         # Clear only user stamps
  npm run db:clear -- --sponsors       # Clear sponsors and dependent data
  npm run db:clear -- --users          # Clear everything (users + all dependent data)

Warning: Some operations will cascade and clear dependent data automatically.
`)
        return
    }

    const clearAll = args.length === 0 || args.includes('--all')
    const clearTransactions = args.includes('--transactions') || clearAll
    const clearStamps = args.includes('--stamps') || clearAll
    const clearSponsors = args.includes('--sponsors') || clearAll
    const clearUsers = args.includes('--users') || clearAll

    try {
        // Clear in proper order to handle foreign key constraints
        if (clearTransactions) {
            console.log('[TRANSACTIONS] Clearing stamp transactions...')
            const transactionCount = await prisma.stampTransaction.deleteMany()
            console.log(`[SUCCESS] ${transactionCount.count} transactions cleared`)
        }

        if (clearStamps) {
            console.log('[STAMPS] Clearing user stamps...')
            const stampCount = await prisma.userStamp.deleteMany()
            console.log(`[SUCCESS] ${stampCount.count} user stamps cleared`)
        }

        if (clearSponsors) {
            console.log('[SPONSORS] Clearing sponsors...')
            // This will also clear related stamps and transactions due to foreign keys
            const sponsorCount = await prisma.sponsor.deleteMany()
            console.log(`[SUCCESS] ${sponsorCount.count} sponsors cleared`)
        }

        if (clearUsers) {
            console.log('[USERS] Clearing users...')
            // This will clear everything due to foreign key relationships
            const userCount = await prisma.user.deleteMany()
            console.log(`[SUCCESS] ${userCount.count} users cleared`)
        }

        console.log('\n[COMPLETE] Database cleanup completed!')
        
    } catch (error) {
        console.error('[ERROR] Failed to clear data:', error)
        process.exit(1)
    }
}

clearData()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })