-- Migration: Add InitialValue column to Goals table
-- This column stores the starting value when a goal is created
-- This is needed for accurate progress calculation, especially for decrease goals (e.g., weight loss)

-- Add InitialValue column to Goals table
IF NOT EXISTS (
    SELECT 1 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Goals' 
    AND COLUMN_NAME = 'InitialValue'
)
BEGIN
    ALTER TABLE Goals
    ADD InitialValue decimal(10,2) NULL;
    
    -- For existing goals, set InitialValue to CurrentValue if it's a decrease goal
    -- (where TargetValue < CurrentValue)
    UPDATE Goals
    SET InitialValue = CurrentValue
    WHERE InitialValue IS NULL 
    AND TargetValue < CurrentValue;
    
    -- For existing increase goals, set InitialValue to 0 or CurrentValue
    UPDATE Goals
    SET InitialValue = ISNULL(CurrentValue, 0)
    WHERE InitialValue IS NULL;
    
    PRINT 'InitialValue column added successfully to Goals table';
END
ELSE
BEGIN
    PRINT 'InitialValue column already exists in Goals table';
END
GO

