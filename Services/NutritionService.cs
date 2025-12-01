using HealthFitness.Data;
using HealthFitness.DTOs;
using HealthFitness.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.Services;

public class NutritionService : INutritionService
{
    private readonly ApplicationDbContext _context;

    public NutritionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<NutritionDto>> GetUserNutritionsAsync(string userId)
    {
        return await _context.Nutritions
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.Time)
            .ThenByDescending(n => n.Id)
            .Select(n => new NutritionDto
            {
                Id = n.Id,
                FoodName = n.FoodName,
                Calories = n.Calories,
                MealType = n.MealType,
                Time = n.Time,
                Protein = n.Protein,
                Carbs = n.Carbs,
                Fat = n.Fat,
                Date = DateTime.Today // For grouping purposes
            })
            .ToListAsync();
    }

    public async Task<NutritionDto?> GetNutritionByIdAsync(int id, string userId)
    {
        var nutrition = await _context.Nutritions
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (nutrition == null) return null;

        return new NutritionDto
        {
            Id = nutrition.Id,
            FoodName = nutrition.FoodName,
            Calories = nutrition.Calories,
            MealType = nutrition.MealType,
            Time = nutrition.Time,
            Protein = nutrition.Protein,
            Carbs = nutrition.Carbs,
            Fat = nutrition.Fat,
            Date = DateTime.Today
        };
    }

    public async Task<bool> CreateNutritionAsync(NutritionDto dto, string userId)
    {
        var nutrition = new Nutrition
        {
            UserId = userId,
            FoodName = dto.FoodName,
            Calories = dto.Calories,
            MealType = dto.MealType,
            Time = dto.Time,
            Protein = dto.Protein,
            Carbs = dto.Carbs,
            Fat = dto.Fat
        };

        _context.Nutritions.Add(nutrition);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateNutritionAsync(NutritionDto dto, string userId)
    {
        var nutrition = await _context.Nutritions
            .FirstOrDefaultAsync(n => n.Id == dto.Id && n.UserId == userId);

        if (nutrition == null) return false;

        nutrition.FoodName = dto.FoodName;
        nutrition.Calories = dto.Calories;
        nutrition.MealType = dto.MealType;
        nutrition.Time = dto.Time;
        nutrition.Protein = dto.Protein;
        nutrition.Carbs = dto.Carbs;
        nutrition.Fat = dto.Fat;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteNutritionAsync(int id, string userId)
    {
        var nutrition = await _context.Nutritions
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (nutrition == null) return false;

        _context.Nutritions.Remove(nutrition);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<decimal> GetDailyCaloriesAsync(string userId, DateTime date)
    {
        // Since we're using Time now, we'll calculate daily calories based on all entries
        // You might want to adjust this logic based on your requirements
        return await _context.Nutritions
            .Where(n => n.UserId == userId)
            .SumAsync(n => n.Calories);
    }
}

