This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Database Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your database credentials.

3. Start the PostgreSQL database:
```bash
npm run db:up
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Generate Prisma client:
```bash
npm run db:generate
```

6. Seed the database with initial data:
```bash
npm run db:seed
```

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Seeding

The project includes a flexible seeding system that allows you to populate your database with test data.

### Available Seed Commands

```bash
# Seed everything (default)
npm run db:seed

# Seed specific data types
npm run db:seed:users        # Seed only users
npm run db:seed:sponsors     # Seed only sponsors  
npm run db:seed:stamps       # Seed only user stamps
npm run db:seed:transactions # Seed only stamp transactions

# Get help
npm run db:seed:help
```

### Advanced Seeding Options

You can combine multiple data types:
```bash
npm run db:seed -- --users --sponsors    # Seed users and sponsors only
npm run db:seed -- --stamps --transactions  # Seed stamps and transactions only
```

Use environment variables to skip certain data:
```bash
SEED_TRANSACTIONS=false npm run db:seed  # Skip transactions
SEED_STAMPS=false npm run db:seed        # Skip stamps
```

### Data Structure

The seed data is stored in JSON files under the `data/` directory:

- `data/users.json` - User accounts (including admin users)
- `data/sponsors.json` - Sponsor organizations with admin assignments
- `data/stamps.json` - User stamp totals per sponsor
- `data/transactions.json` - Individual stamp transactions

**Important:** The seeding system automatically handles relationships:
- Sponsors are assigned to admin users based on phone numbers
- Stamps and transactions reference users by phone numbers
- All relationships are properly validated before creation

## Database Management

```bash
# Database Lifecycle
npm run db:up      # Start PostgreSQL container
npm run db:down    # Stop PostgreSQL container
npm run db:migrate # Apply pending migrations
npm run db:generate # Regenerate Prisma client
npm run db:studio  # Open Prisma Studio (database GUI)
npm run db:reset   # Reset database (⚠️ destroys all data and re-seeds)

# Data Clearing (Selective)
npm run db:clear                     # Clear all data
npm run db:clear:transactions        # Clear only transactions  
npm run db:clear:stamps             # Clear only user stamps
npm run db:clear:sponsors           # Clear sponsors (+ dependent data)
npm run db:clear:users              # Clear users (+ ALL dependent data)
npm run db:clear:help               # Show clearing options

# Data Seeding
npm run db:seed                     # Seed all data
npm run db:seed:users              # Seed only users
npm run db:seed:sponsors           # Seed only sponsors
npm run db:seed:stamps             # Seed only stamps
npm run db:seed:transactions       # Seed only transactions
npm run db:seed:help               # Show seeding options
```

### Data Clearing vs Reset

| Command | Effect | Use Case |
|---------|--------|----------|
| `db:reset` | Drops database, recreates schema, runs all migrations, auto-seeds | Complete fresh start |
| `db:clear` | Selectively removes data, keeps schema intact | Clean data without losing structure |
| `db:clear:*` | Removes specific data types only | Targeted cleanup |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
