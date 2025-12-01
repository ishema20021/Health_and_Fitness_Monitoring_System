-- Migration: Add missing columns to Nutritions table
-- Run this script if you get errors about missing Time, Protein, Carbs, or Fat columns

-- Remove Date column if it exists (replaced by Time)
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Date')
BEGIN
    -- Drop the index on Date if it exists
    IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nutritions_Date' AND object_id = OBJECT_ID(N'[dbo].[Nutritions]'))
    BEGIN
        DROP INDEX [IX_Nutritions_Date] ON [dbo].[Nutritions];
    END
    
    ALTER TABLE [dbo].[Nutritions] DROP COLUMN [Date];
    PRINT 'Date column removed successfully.';
END
ELSE
BEGIN
    PRINT 'Date column does not exist.';
END
GO

-- Add Time column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Time')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Time] time NOT NULL DEFAULT CAST(GETDATE() AS time);
    PRINT 'Time column added successfully.';
END
ELSE
BEGIN
    PRINT 'Time column already exists.';
END
GO

-- Add Protein column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Protein')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Protein] decimal(10,2) NULL;
    PRINT 'Protein column added successfully.';
END
ELSE
BEGIN
    PRINT 'Protein column already exists.';
END
GO

-- Add Carbs column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Carbs')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Carbs] decimal(10,2) NULL;
    PRINT 'Carbs column added successfully.';
END
ELSE
BEGIN
    PRINT 'Carbs column already exists.';
END
GO

-- Add Fat column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Fat')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Fat] decimal(10,2) NULL;
    PRINT 'Fat column added successfully.';
END
ELSE
BEGIN
    PRINT 'Fat column already exists.';
END
GO

PRINT 'Migration completed successfully!';
GO

