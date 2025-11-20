# Data Structure Documentation

This directory contains JSON files used for seeding the database with initial data. Each file follows a specific structure that matches the Prisma schema.

## File Overview

| File | Purpose | Dependencies |
|------|---------|-------------|
| `users.json` | User accounts (regular users and admins) | None |
| `sponsors.json` | Sponsor organizations | Requires `users.json` (admin assignments) |
| `stamps.json` | User stamp totals per sponsor | Requires `users.json` and `sponsors.json` |
| `transactions.json` | Individual stamp transactions | Requires `users.json` and `sponsors.json` |

## Data Structure Schemas

### 1. Users (`users.json`)

```typescript
interface UserData {
  name: string;           // Full name of the user
  phone: string;          // Unique phone number (primary identifier)
  role: 'user' | 'admin'; // User role in the system
  qrCode: string;         // Unique QR code identifier
  isClaimed: boolean;     // Whether account has been activated
}
```

**Important Notes:**
- `phone` must be unique across all users
- `qrCode` must be unique across all users
- Admin users (`role: 'admin'`) are required for sponsor management
- `isClaimed` defaults to `false` for regular users, `true` for admins

### 2. Sponsors (`sponsors.json`)

```typescript
interface SponsorData {
  id?: string;            // Optional UUID (auto-generated if not provided)
  name: string;           // Company/organization name
  phone?: string;         // Contact phone number (optional)
  level: 'gold' | 'silver'; // Sponsorship tier
  adminPhone: string;     // Phone of admin user (must exist in users.json)
  logoUrl?: string | null; // URL to logo image (optional)
}
```

**Important Notes:**
- `adminPhone` must match a user with `role: 'admin'` in users.json
- `level` must be either `'gold'` or `'silver'`
- `id` is optional - UUID will be generated if not provided
- `logoUrl` can be `null` or omitted for sponsors without logos

### 3. User Stamps (`stamps.json`)

```typescript
interface StampData {
  userPhone: string;      // Phone of user (must exist in users.json)
  sponsorId: string;      // ID of sponsor (must exist in sponsors.json)
  total: number;          // Total stamps collected from this sponsor
}
```

**Important Notes:**
- `userPhone` must match an existing user's phone number
- `sponsorId` must match an existing sponsor's ID
- `total` represents the current balance of stamps
- Each user-sponsor combination should appear only once

### 4. Transactions (`transactions.json`)

```typescript
interface TransactionData {
  userPhone: string;      // Phone of user (must exist in users.json)
  sponsorId: string;      // ID of sponsor (must exist in sponsors.json)
  amount: number;         // Number of stamps in this transaction
}
```

**Important Notes:**
- `userPhone` must match an existing user's phone number
- `sponsorId` must match an existing sponsor's ID
- `amount` defaults to 1 if not specified
- Multiple transactions can exist between the same user-sponsor pair
- Transactions represent individual stamp-giving events

## Data Relationships

```
User (phone) ←→ Sponsor (adminPhone)    [Admin manages sponsor]
User (phone) ←→ UserStamp (userPhone)   [User has stamp totals]
User (phone) ←→ Transaction (userPhone) [User has transactions]
Sponsor (id) ←→ UserStamp (sponsorId)   [Sponsor gives stamps]
Sponsor (id) ←→ Transaction (sponsorId) [Sponsor in transactions]
```

## Adding New Data

### Adding Users
1. Ensure `phone` and `qrCode` are unique
2. Set appropriate `role` ('user' or 'admin')
3. Set `isClaimed` based on user status

### Adding Sponsors
1. Choose appropriate `level` ('gold' or 'silver')
2. Ensure `adminPhone` matches an admin user
3. Provide optional logo URL or set to `null`

### Adding Stamps
1. Ensure both `userPhone` and `sponsorId` exist
2. Set `total` to current stamp balance
3. Avoid duplicate user-sponsor combinations

### Adding Transactions
1. Ensure both `userPhone` and `sponsorId` exist
2. Set `amount` to number of stamps given
3. Multiple transactions per user-sponsor pair are allowed

## Validation

The seeding system validates:
- ✅ All referenced users exist
- ✅ All referenced sponsors exist  
- ✅ Admin users exist for sponsor assignments
- ✅ Data types match expected schema
- ✅ Required fields are present
- ✅ Enum values are valid

## Example Usage

```bash
# Seed all data
npm run db:seed

# Seed specific data types
npm run db:seed:users
npm run db:seed:sponsors
npm run db:seed:stamps
npm run db:seed:transactions

# Combine multiple types
npm run db:seed -- --users --sponsors
```

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "User with phone X not found" | Reference to non-existent user | Add user to `users.json` or update phone reference |
| "Sponsor with ID X not found" | Reference to non-existent sponsor | Add sponsor to `sponsors.json` or update ID reference |
| "No admin users found" | No users with `role: 'admin'` | Add at least one admin user to `users.json` |
| "Invalid sponsor level" | Level not 'gold' or 'silver' | Update sponsor level to valid value |

## Best Practices

1. **Start with Users**: Always seed users first as they're referenced by other data
2. **Admin Users**: Ensure at least one admin user exists before adding sponsors
3. **Consistent IDs**: Use meaningful, consistent IDs for sponsors (e.g., 'gold-sponsor-1')
4. **Phone Format**: Use consistent phone number format across all data
5. **Data Integrity**: Verify all references exist before seeding
6. **Incremental Updates**: Use upsert operations for safe re-seeding