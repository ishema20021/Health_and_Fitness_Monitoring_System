-- Verify that the new columns exist
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('Activities', 'Nutritions')
    AND COLUMN_NAME IN ('Distance', 'HeartRate', 'Notes', 'Time', 'Protein', 'Carbs', 'Fat')
ORDER BY TABLE_NAME, COLUMN_NAME;

