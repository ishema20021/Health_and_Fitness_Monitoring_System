# Script to add InitialValue column to Goals table
$connectionString = "Server=(localdb)\mssqllocaldb;Database=HealthFitnessDb;Trusted_Connection=True;"

Write-Host "Checking if InitialValue column exists..."

$checkQuery = @"
SELECT COUNT(*) as ColumnCount
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Goals' AND COLUMN_NAME = 'InitialValue'
"@

try {
    $result = Invoke-Sqlcmd -ServerInstance "(localdb)\mssqllocaldb" -Database "HealthFitnessDb" -Query $checkQuery -ErrorAction Stop
    
    if ($result.ColumnCount -eq 0) {
        Write-Host "InitialValue column not found. Adding column..."
        
        $addColumnQuery = @"
ALTER TABLE Goals ADD InitialValue decimal(10,2) NULL;
UPDATE Goals SET InitialValue = CurrentValue WHERE InitialValue IS NULL;
"@
        
        Invoke-Sqlcmd -ServerInstance "(localdb)\mssqllocaldb" -Database "HealthFitnessDb" -Query $addColumnQuery -ErrorAction Stop
        
        Write-Host "SUCCESS: InitialValue column added to Goals table!" -ForegroundColor Green
    } else {
        Write-Host "InitialValue column already exists. No action needed." -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Failed to add InitialValue column" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

