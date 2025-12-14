-- Migration: UpdateNutritionAndActivityModels
-- This script adds new columns to Activities and Nutritions tables

-- Add new columns to Activities table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND name = 'Distance')
BEGIN
    ALTER TABLE [dbo].[Activities] ADD [Distance] decimal(10,2) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND name = 'HeartRate')
BEGIN
    ALTER TABLE [dbo].[Activities] ADD [HeartRate] int NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND name = 'Notes')
BEGIN
    ALTER TABLE [dbo].[Activities] ADD [Notes] nvarchar(500) NULL;
END
GO

-- For Nutritions table: Remove Date column and add Time, Protein, Carbs, Fat
-- First, check if Date column exists and remove it
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Date')
BEGIN
    -- Drop the index on Date if it exists
    IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nutritions_Date' AND object_id = OBJECT_ID(N'[dbo].[Nutritions]'))
    BEGIN
        DROP INDEX [IX_Nutritions_Date] ON [dbo].[Nutritions];
    END
    
    ALTER TABLE [dbo].[Nutritions] DROP COLUMN [Date];
END
GO

-- Add Time column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Time')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Time] time NOT NULL DEFAULT CAST(GETDATE() AS time);
END
GO

-- Add Protein column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Protein')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Protein] decimal(10,2) NULL;
END
GO

-- Add Carbs column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Carbs')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Carbs] decimal(10,2) NULL;
END
GO

-- Add Fat column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Nutritions]') AND name = 'Fat')
BEGIN
    ALTER TABLE [dbo].[Nutritions] ADD [Fat] decimal(10,2) NULL;
END
GO

