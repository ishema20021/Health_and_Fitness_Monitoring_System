using HealthFitness.API.Data;
using HealthFitness.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;

namespace HealthFitness.API.Services;

public class DataImportService : IDataImportService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DataImportService> _logger;

    public DataImportService(ApplicationDbContext context, ILogger<DataImportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<DataImport> ImportFromCsvAsync(string userId, IFormFile file, string dataType)
    {
        var import = new DataImport
        {
            UserId = userId,
            Source = "CSV",
            DataType = dataType,
            FileName = file.FileName,
            Status = "Processing",
            ImportedAt = DateTime.UtcNow
        };

        _context.DataImports.Add(import);
        await _context.SaveChangesAsync();

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var header = await reader.ReadLineAsync();
            
            if (header == null)
            {
                throw new Exception("CSV file is empty");
            }

            var recordsImported = 0;
            var recordsFailed = 0;
            var errors = new List<string>();

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line)) continue;

                try
                {
                    switch (dataType.ToLower())
                    {
                        case "activities":
                            await ImportActivityFromCsv(userId, line);
                            break;
                        case "nutrition":
                            await ImportNutritionFromCsv(userId, line);
                            break;
                        case "sleep":
                            await ImportSleepFromCsv(userId, line);
                            break;
                        case "water":
                            await ImportWaterFromCsv(userId, line);
                            break;
                        default:
                            throw new Exception($"Unsupported data type: {dataType}");
                    }
                    recordsImported++;
                }
                catch (Exception ex)
                {
                    recordsFailed++;
                    errors.Add($"Line error: {ex.Message}");
                    _logger.LogWarning($"Failed to import line: {line}. Error: {ex.Message}");
                }
            }

            import.RecordsImported = recordsImported;
            import.RecordsFailed = recordsFailed;
            import.Status = recordsFailed > 0 ? "Completed with errors" : "Completed";
            import.ErrorLog = errors.Any() ? string.Join("\n", errors) : null;

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            import.Status = "Failed";
            import.ErrorLog = ex.Message;
            await _context.SaveChangesAsync();
            _logger.LogError(ex, $"Import failed for user {userId}");
        }

        return import;
    }

    public async Task<DataImport> ImportFromJsonAsync(string userId, IFormFile file, string dataType)
    {
        var import = new DataImport
        {
            UserId = userId,
            Source = "JSON",
            DataType = dataType,
            FileName = file.FileName,
            Status = "Processing",
            ImportedAt = DateTime.UtcNow
        };

        _context.DataImports.Add(import);
        await _context.SaveChangesAsync();

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var jsonContent = await reader.ReadToEndAsync();
            
            var recordsImported = 0;
            var recordsFailed = 0;
            var errors = new List<string>();

            switch (dataType.ToLower())
            {
                case "activities":
                    var activities = JsonSerializer.Deserialize<List<JsonActivity>>(jsonContent);
                    if (activities != null)
                    {
                        foreach (var item in activities)
                        {
                            try
                            {
                                await ImportActivityFromJson(userId, item);
                                recordsImported++;
                            }
                            catch (Exception ex)
                            {
                                recordsFailed++;
                                errors.Add($"Activity import error: {ex.Message}");
                            }
                        }
                    }
                    break;

                case "nutrition":
                    var nutritions = JsonSerializer.Deserialize<List<JsonNutrition>>(jsonContent);
                    if (nutritions != null)
                    {
                        foreach (var item in nutritions)
                        {
                            try
                            {
                                await ImportNutritionFromJson(userId, item);
                                recordsImported++;
                            }
                            catch (Exception ex)
                            {
                                recordsFailed++;
                                errors.Add($"Nutrition import error: {ex.Message}");
                            }
                        }
                    }
                    break;

                default:
                    throw new Exception($"Unsupported data type: {dataType}");
            }

            import.RecordsImported = recordsImported;
            import.RecordsFailed = recordsFailed;
            import.Status = recordsFailed > 0 ? "Completed with errors" : "Completed";
            import.ErrorLog = errors.Any() ? string.Join("\n", errors) : null;

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            import.Status = "Failed";
            import.ErrorLog = ex.Message;
            await _context.SaveChangesAsync();
            _logger.LogError(ex, $"JSON import failed for user {userId}");
        }

        return import;
    }

    private async Task ImportActivityFromCsv(string userId, string line)
    {
        var parts = line.Split(',');
        if (parts.Length < 4) throw new Exception("Invalid CSV format");

        var activity = new Activity
        {
            UserId = userId,
            ActivityType = parts[0].Trim(),
            Duration = int.Parse(parts[1].Trim()),
            CaloriesBurned = decimal.Parse(parts[2].Trim()),
            Date = DateTime.Parse(parts[3].Trim()),
            Distance = parts.Length > 4 && !string.IsNullOrWhiteSpace(parts[4]) ? decimal.Parse(parts[4].Trim()) : null,
            HeartRate = parts.Length > 5 && !string.IsNullOrWhiteSpace(parts[5]) ? int.Parse(parts[5].Trim()) : null
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();
    }

    private async Task ImportNutritionFromCsv(string userId, string line)
    {
        var parts = line.Split(',');
        if (parts.Length < 4) throw new Exception("Invalid CSV format");

        var nutrition = new Nutrition
        {
            UserId = userId,
            FoodName = parts[0].Trim(),
            Calories = decimal.Parse(parts[1].Trim()),
            MealType = parts[2].Trim(),
            Date = DateTime.Parse(parts[3].Trim()),
            Protein = parts.Length > 4 && !string.IsNullOrWhiteSpace(parts[4]) ? decimal.Parse(parts[4].Trim()) : null,
            Carbs = parts.Length > 5 && !string.IsNullOrWhiteSpace(parts[5]) ? decimal.Parse(parts[5].Trim()) : null,
            Fat = parts.Length > 6 && !string.IsNullOrWhiteSpace(parts[6]) ? decimal.Parse(parts[6].Trim()) : null
        };

        _context.Nutritions.Add(nutrition);
        await _context.SaveChangesAsync();
    }

    private async Task ImportSleepFromCsv(string userId, string line)
    {
        var parts = line.Split(',');
        if (parts.Length < 2) throw new Exception("Invalid CSV format");

        var sleepLog = new SleepLog
        {
            UserId = userId,
            StartTime = DateTime.Parse(parts[0].Trim()),
            EndTime = DateTime.Parse(parts[1].Trim()),
            QualityRating = parts.Length > 2 && !string.IsNullOrWhiteSpace(parts[2]) ? int.Parse(parts[2].Trim()) : 3
        };

        _context.SleepLogs.Add(sleepLog);
        await _context.SaveChangesAsync();
    }

    private async Task ImportWaterFromCsv(string userId, string line)
    {
        var parts = line.Split(',');
        if (parts.Length < 2) throw new Exception("Invalid CSV format");

        var waterIntake = new WaterIntake
        {
            UserId = userId,
            AmountInMl = int.Parse(parts[0].Trim()),
            Date = DateTime.Parse(parts[1].Trim())
        };

        _context.WaterIntakes.Add(waterIntake);
        await _context.SaveChangesAsync();
    }

    private async Task ImportActivityFromJson(string userId, JsonActivity item)
    {
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = item.ActivityType ?? "Unknown",
            Duration = item.Duration,
            CaloriesBurned = item.CaloriesBurned,
            Date = item.Date,
            Distance = item.Distance,
            HeartRate = item.HeartRate
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();
    }

    private async Task ImportNutritionFromJson(string userId, JsonNutrition item)
    {
        var nutrition = new Nutrition
        {
            UserId = userId,
            FoodName = item.FoodName ?? "Unknown",
            Calories = item.Calories,
            MealType = item.MealType ?? "Snack",
            Date = item.Date,
            Protein = item.Protein,
            Carbs = item.Carbs,
            Fat = item.Fat
        };

        _context.Nutritions.Add(nutrition);
        await _context.SaveChangesAsync();
    }

    public async Task<List<DataImport>> GetUserImportsAsync(string userId)
    {
        return await _context.DataImports
            .Where(di => di.UserId == userId)
            .OrderByDescending(di => di.ImportedAt)
            .ToListAsync();
    }

    public async Task<DataImport?> GetImportByIdAsync(int importId)
    {
        return await _context.DataImports.FindAsync(importId);
    }

    // Helper classes for JSON deserialization
    private class JsonActivity
    {
        public string? ActivityType { get; set; }
        public int Duration { get; set; }
        public decimal CaloriesBurned { get; set; }
        public DateTime Date { get; set; }
        public decimal? Distance { get; set; }
        public int? HeartRate { get; set; }
    }

    private class JsonNutrition
    {
        public string? FoodName { get; set; }
        public decimal Calories { get; set; }
        public string? MealType { get; set; }
        public DateTime Date { get; set; }
        public decimal? Protein { get; set; }
        public decimal? Carbs { get; set; }
        public decimal? Fat { get; set; }
    }
}


