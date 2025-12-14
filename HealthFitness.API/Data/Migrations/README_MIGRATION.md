# Database Migration Instructions

## Fix Missing Activity Columns Error

If you're getting an error about missing columns (`Distance`, `HeartRate`, `Notes`) in the Activities table, follow these steps:

### Option 1: Run SQL Script Directly

1. Open **SQL Server Management Studio (SSMS)** or your preferred SQL client
2. Connect to your database server (usually `(localdb)\mssqllocaldb`)
3. Open the file: `HealthFitness/Data/Migrations/AddActivityColumns.sql`
4. Execute the script against your `HealthFitnessDb` database

### Option 2: Using Command Line (sqlcmd)

```powershell
sqlcmd -S "(localdb)\mssqllocaldb" -d HealthFitnessDb -i "HealthFitness\Data\Migrations\AddActivityColumns.sql"
```

### Option 3: Using Entity Framework Migrations

If you prefer using EF Core migrations:

```powershell
dotnet ef migrations add AddActivityColumns
dotnet ef database update
```

### Verify the Migration

After running the script, verify the columns exist:

```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Activities'
AND COLUMN_NAME IN ('Distance', 'HeartRate', 'Notes')
```

You should see all three columns listed.

## What the Migration Does

The migration adds three nullable columns to the `Activities` table:
- **Distance** (decimal(10,2)) - Optional distance in kilometers
- **HeartRate** (int) - Optional heart rate in beats per minute
- **Notes** (nvarchar(500)) - Optional notes about the activity

All columns are nullable, so existing data will not be affected.

