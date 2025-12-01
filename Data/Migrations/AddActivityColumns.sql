-- Migration: Add missing columns to Activities table
-- Run this script if you get errors about missing Distance, HeartRate, or Notes columns

-- Add Distance column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND name = 'Distance')
BEGIN
    ALTER TABLE [dbo].[Activities] ADD [Distance] decimal(10,2) NULL;
    PRINT 'Distance column added successfully.';
END
ELSE
BEGIN
    PRINT 'Distance column already exists.';
END
GO

-- Add HeartRate column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND name = 'HeartRate')
BEGIN
    ALTER TABLE [dbo].[Activities] ADD [HeartRate] int NULL;
    PRINT 'HeartRate column added successfully.';
END
ELSE
BEGIN
    PRINT 'HeartRate column already exists.';
END
GO

-- Add Notes column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND name = 'Notes')
BEGIN
    ALTER TABLE [dbo].[Activities] ADD [Notes] nvarchar(500) NULL;
    PRINT 'Notes column added successfully.';
END
ELSE
BEGIN
    PRINT 'Notes column already exists.';
END
GO

PRINT 'Migration completed successfully!';
GO

