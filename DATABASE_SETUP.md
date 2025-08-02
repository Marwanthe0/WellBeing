# MySQL Database Setup Guide

This application has been migrated from localStorage to MySQL database for persistent data storage.

## Prerequisites

1. **MySQL Server**: Install MySQL server on your system
   - **Ubuntu/Debian**: `sudo apt install mysql-server`
   - **macOS**: `brew install mysql`
   - **Windows**: Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)

2. **Node.js Dependencies**: The required packages are already included in package.json

## Database Setup

### 1. Start MySQL Service

```bash
# Ubuntu/Debian
sudo systemctl start mysql

# macOS (if installed via Homebrew)
brew services start mysql

# Windows
# Start MySQL from Services panel or MySQL Workbench
```

### 2. Create Database and User

Log into MySQL as root:

```bash
mysql -u root -p
```

Create the database and user:

```sql
-- Create database
CREATE DATABASE wellbeing;

-- Create user (optional, you can use root)
CREATE USER 'wellbeing_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON wellbeing.* TO 'wellbeing_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Configure Environment Variables

Copy and update the `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your database credentials:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root  # or wellbeing_user if you created a specific user
DB_PASSWORD=your_mysql_password
DB_NAME=wellbeing

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Generate Database Schema

```bash
npm run db:generate
```

### 6. Push Schema to Database

```bash
npm run db:push
```

## Database Schema

The application includes the following tables:

- **users**: User accounts with authentication
- **journals**: Journal entries linked to users
- **therapists**: Available therapists
- **appointments**: Scheduled appointments
- **suggestions**: Mood-based wellness tips
- **mood_entries**: User mood tracking data
- **daily_quotes**: Daily inspirational quotes (replaces localStorage)

## Migration from localStorage

The main localStorage usage that has been migrated:

1. **Daily Quotes**: Previously stored in `localStorage` with key `daily_quote_{date}`
   - Now stored in `daily_quotes` table
   - API endpoint: `/api/quotes?date={date}`
   - Automatic fallback if database is unavailable

## Development Commands

```bash
# Start development server
npm run dev

# Generate new migrations after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio for database management
npm run db:studio
```

## Production Deployment

For production deployment:

1. Set up a MySQL server (AWS RDS, Google Cloud SQL, etc.)
2. Update environment variables with production database credentials
3. Run migrations: `npm run db:push`
4. Ensure proper network security (firewall rules, VPC settings)

## Troubleshooting

### Connection Issues

1. **Check MySQL service status**:
   ```bash
   sudo systemctl status mysql  # Linux
   brew services list | grep mysql  # macOS
   ```

2. **Verify database credentials**:
   ```bash
   mysql -u YOUR_USER -p -h YOUR_HOST YOUR_DATABASE
   ```

3. **Check environment variables**:
   ```bash
   cat .env.local
   ```

### Migration Issues

1. **Reset database** (development only):
   ```sql
   DROP DATABASE wellbeing;
   CREATE DATABASE wellbeing;
   ```

2. **Clear migration files** (if needed):
   ```bash
   rm -rf lib/db/migrations/*
   npm run db:generate
   npm run db:push
   ```

## Features Added

1. **Persistent Daily Quotes**: Daily quotes are now stored in MySQL and persist across sessions
2. **Database-backed Authentication**: User sessions managed through database
3. **Scalable Data Storage**: All user data now persists in relational database
4. **Data Integrity**: Foreign key constraints ensure data consistency
5. **Better Performance**: Database queries replace localStorage operations

## API Endpoints

- `GET /api/quotes?date={date}`: Fetch daily quote for specific date
  - Returns existing quote if found, generates new one if not
  - Stores generated quotes for consistency

## Security Notes

- All database credentials should be kept secure
- Use environment variables, never commit credentials to version control
- Consider using connection pooling for production environments
- Implement proper backup strategies for production data