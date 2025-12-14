using HealthFitness.API.Data;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class AIRecommendationService : IAIRecommendationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AIRecommendationService> _logger;

    public AIRecommendationService(ApplicationDbContext context, ILogger<AIRecommendationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<string>> GetMealRecommendationsAsync(string userId, string mealType)
    {
        // Get user's recent nutrition data to understand preferences
        var recentMeals = await _context.Nutritions
            .Where(n => n.UserId == userId && n.MealType == mealType)
            .OrderByDescending(n => n.Date)
            .Take(10)
            .ToListAsync();

        // Calculate average calories for this meal type
        var avgCalories = recentMeals.Any() ? recentMeals.Average(m => m.Calories) : 500;

        // Get user's goals to tailor recommendations
        var activeGoals = await _context.Goals
            .Where(g => g.UserId == userId && g.Status == "In Progress")
            .ToListAsync();

        var isWeightLoss = activeGoals.Any(g => g.GoalType.Contains("Weight Loss") || g.GoalType.Contains("Fat Loss"));
        var isMuscleGain = activeGoals.Any(g => g.GoalType.Contains("Muscle") || g.GoalType.Contains("Strength"));

        var recommendations = new List<string>();

        switch (mealType.ToLower())
        {
            case "breakfast":
                if (isWeightLoss)
                {
                    recommendations.AddRange(new[]
                    {
                        "Greek yogurt with berries and almonds (250 cal)",
                        "Oatmeal with banana and chia seeds (300 cal)",
                        "Egg white omelet with vegetables (200 cal)",
                        "Smoothie bowl with spinach and protein powder (280 cal)",
                        "Whole grain toast with avocado (320 cal)"
                    });
                }
                else if (isMuscleGain)
                {
                    recommendations.AddRange(new[]
                    {
                        "Scrambled eggs with whole grain toast (450 cal)",
                        "Protein pancakes with peanut butter (520 cal)",
                        "Breakfast burrito with eggs and beans (580 cal)",
                        "Oatmeal with protein powder and nuts (480 cal)",
                        "Greek yogurt parfait with granola (420 cal)"
                    });
                }
                else
                {
                    recommendations.AddRange(new[]
                    {
                        "Whole grain cereal with milk (350 cal)",
                        "Fruit smoothie with yogurt (320 cal)",
                        "Toast with peanut butter and banana (380 cal)",
                        "Veggie omelet with toast (400 cal)",
                        "Overnight oats with berries (340 cal)"
                    });
                }
                break;

            case "lunch":
                if (isWeightLoss)
                {
                    recommendations.AddRange(new[]
                    {
                        "Grilled chicken salad with vinaigrette (350 cal)",
                        "Quinoa bowl with roasted vegetables (380 cal)",
                        "Turkey wrap with whole grain tortilla (320 cal)",
                        "Lentil soup with side salad (300 cal)",
                        "Tuna salad on mixed greens (340 cal)"
                    });
                }
                else if (isMuscleGain)
                {
                    recommendations.AddRange(new[]
                    {
                        "Grilled chicken breast with brown rice and broccoli (620 cal)",
                        "Salmon with sweet potato and asparagus (680 cal)",
                        "Beef stir-fry with quinoa (720 cal)",
                        "Turkey burger with whole grain bun and salad (650 cal)",
                        "Pasta with lean ground beef and vegetables (700 cal)"
                    });
                }
                else
                {
                    recommendations.AddRange(new[]
                    {
                        "Chicken Caesar salad (450 cal)",
                        "Veggie burger with sweet potato fries (520 cal)",
                        "Grilled fish with rice and vegetables (480 cal)",
                        "Mediterranean bowl with hummus (500 cal)",
                        "Chicken sandwich with side salad (470 cal)"
                    });
                }
                break;

            case "dinner":
                if (isWeightLoss)
                {
                    recommendations.AddRange(new[]
                    {
                        "Baked salmon with steamed vegetables (400 cal)",
                        "Grilled chicken with cauliflower rice (380 cal)",
                        "Vegetable stir-fry with tofu (350 cal)",
                        "Zucchini noodles with turkey meatballs (420 cal)",
                        "Shrimp and vegetable skewers (360 cal)"
                    });
                }
                else if (isMuscleGain)
                {
                    recommendations.AddRange(new[]
                    {
                        "Steak with baked potato and green beans (750 cal)",
                        "Chicken breast with pasta and marinara (680 cal)",
                        "Salmon with quinoa and roasted vegetables (720 cal)",
                        "Turkey meatloaf with mashed potatoes (700 cal)",
                        "Beef and vegetable stew with bread (740 cal)"
                    });
                }
                else
                {
                    recommendations.AddRange(new[]
                    {
                        "Grilled chicken with roasted vegetables (520 cal)",
                        "Baked fish with rice pilaf (480 cal)",
                        "Vegetarian pasta primavera (550 cal)",
                        "Turkey chili with cornbread (580 cal)",
                        "Chicken fajitas with peppers and onions (540 cal)"
                    });
                }
                break;

            case "snack":
                recommendations.AddRange(new[]
                {
                    "Apple with almond butter (180 cal)",
                    "Protein bar (200 cal)",
                    "Greek yogurt (120 cal)",
                    "Mixed nuts (160 cal)",
                    "Hummus with carrot sticks (140 cal)",
                    "Cottage cheese with berries (150 cal)"
                });
                break;
        }

        return recommendations.Take(5).ToList();
    }

    public async Task<List<string>> GetWorkoutRecommendationsAsync(string userId)
    {
        // Analyze user's recent activities
        var recentActivities = await _context.Activities
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Date)
            .Take(20)
            .ToListAsync();

        var activityTypes = recentActivities.Select(a => a.ActivityType.ToLower()).Distinct().ToList();
        var avgDuration = recentActivities.Any() ? recentActivities.Average(a => a.Duration) : 30;

        // Get user's goals
        var activeGoals = await _context.Goals
            .Where(g => g.UserId == userId && g.Status == "In Progress")
            .ToListAsync();

        var recommendations = new List<string>();

        // Cardio recommendations
        if (!activityTypes.Contains("running") || activityTypes.Count < 3)
        {
            recommendations.Add($"Running - Start with {Math.Max(20, avgDuration - 10)} minutes, 3x per week");
        }

        if (!activityTypes.Contains("cycling"))
        {
            recommendations.Add($"Cycling - {Math.Max(30, avgDuration)} minutes for low-impact cardio");
        }

        // Strength training
        if (!activityTypes.Any(a => a.Contains("weight") || a.Contains("strength")))
        {
            recommendations.Add("Strength Training - Full body workout, 45 minutes, 2-3x per week");
            recommendations.Add("Bodyweight Exercises - Push-ups, squats, planks, 30 minutes");
        }

        // Flexibility and recovery
        if (!activityTypes.Contains("yoga") && !activityTypes.Contains("stretching"))
        {
            recommendations.Add("Yoga - 30 minutes for flexibility and recovery");
            recommendations.Add("Stretching - 15 minutes daily for injury prevention");
        }

        // High-intensity options
        if (avgDuration > 30 && !activityTypes.Contains("hiit"))
        {
            recommendations.Add("HIIT Workout - 25 minutes of high-intensity intervals");
        }

        // Sport-specific
        recommendations.Add("Swimming - Full body workout, 45 minutes");
        recommendations.Add("Boxing - Great for cardio and strength, 40 minutes");

        // Goal-specific recommendations
        if (activeGoals.Any(g => g.GoalType.Contains("Weight Loss")))
        {
            recommendations.Insert(0, "Interval Training - Burn more calories with 30 min HIIT sessions");
        }

        if (activeGoals.Any(g => g.GoalType.Contains("Muscle")))
        {
            recommendations.Insert(0, "Progressive Overload - Increase weights by 5% weekly in strength training");
        }

        return recommendations.Take(6).ToList();
    }

    public async Task<Dictionary<string, List<string>>> GetWeeklyPlanAsync(string userId)
    {
        var weeklyPlan = new Dictionary<string, List<string>>();
        var daysOfWeek = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };

        // Get user's goals to tailor the plan
        var activeGoals = await _context.Goals
            .Where(g => g.UserId == userId && g.Status == "In Progress")
            .ToListAsync();

        var isWeightLoss = activeGoals.Any(g => g.GoalType.Contains("Weight Loss"));
        var isMuscleGain = activeGoals.Any(g => g.GoalType.Contains("Muscle"));

        foreach (var day in daysOfWeek)
        {
            var dayPlan = new List<string>();

            switch (day)
            {
                case "Monday":
                    dayPlan.Add("Morning: 30 min cardio (running or cycling)");
                    dayPlan.Add("Breakfast: Protein-rich meal");
                    dayPlan.Add("Lunch: Balanced meal with lean protein");
                    dayPlan.Add("Evening: Upper body strength training (45 min)");
                    dayPlan.Add("Water goal: 2.5 liters");
                    break;

                case "Tuesday":
                    dayPlan.Add("Morning: Yoga or stretching (20 min)");
                    dayPlan.Add("Breakfast: Oatmeal with fruits");
                    dayPlan.Add("Lunch: Salad with grilled chicken");
                    dayPlan.Add("Evening: Lower body workout (45 min)");
                    dayPlan.Add("Water goal: 2.5 liters");
                    break;

                case "Wednesday":
                    dayPlan.Add("Morning: HIIT workout (25 min)");
                    dayPlan.Add("Breakfast: Eggs and whole grain toast");
                    dayPlan.Add("Lunch: Quinoa bowl with vegetables");
                    dayPlan.Add("Evening: Light walk (30 min)");
                    dayPlan.Add("Water goal: 2.5 liters");
                    break;

                case "Thursday":
                    dayPlan.Add("Morning: Swimming or cycling (40 min)");
                    dayPlan.Add("Breakfast: Smoothie bowl");
                    dayPlan.Add("Lunch: Fish with brown rice");
                    dayPlan.Add("Evening: Core workout (30 min)");
                    dayPlan.Add("Water goal: 2.5 liters");
                    break;

                case "Friday":
                    dayPlan.Add("Morning: Full body strength training (50 min)");
                    dayPlan.Add("Breakfast: Greek yogurt parfait");
                    dayPlan.Add("Lunch: Chicken wrap with vegetables");
                    dayPlan.Add("Evening: Rest or light stretching");
                    dayPlan.Add("Water goal: 2.5 liters");
                    break;

                case "Saturday":
                    dayPlan.Add("Morning: Outdoor activity (hiking, sports) - 60 min");
                    dayPlan.Add("Breakfast: Hearty breakfast");
                    dayPlan.Add("Lunch: Balanced meal");
                    dayPlan.Add("Evening: Yoga or meditation (30 min)");
                    dayPlan.Add("Water goal: 3 liters");
                    break;

                case "Sunday":
                    dayPlan.Add("Morning: Light cardio or rest");
                    dayPlan.Add("Breakfast: Nutritious brunch");
                    dayPlan.Add("Lunch: Meal prep for the week");
                    dayPlan.Add("Evening: Stretching and recovery (20 min)");
                    dayPlan.Add("Water goal: 2 liters");
                    dayPlan.Add("Plan next week's goals");
                    break;
            }

            weeklyPlan[day] = dayPlan;
        }

        return weeklyPlan;
    }

    public async Task<List<string>> GetGoalSuggestionsAsync(string userId)
    {
        var suggestions = new List<string>();

        // Analyze user's current activities and progress
        var recentActivities = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= DateTime.Today.AddDays(-30))
            .ToListAsync();

        var existingGoals = await _context.Goals
            .Where(g => g.UserId == userId && g.Status == "In Progress")
            .Select(g => g.GoalType)
            .ToListAsync();

        // Suggest based on activity patterns
        if (recentActivities.Any(a => a.ActivityType.ToLower().Contains("run")))
        {
            var totalDistance = recentActivities
                .Where(a => a.ActivityType.ToLower().Contains("run") && a.Distance.HasValue)
                .Sum(a => a.Distance.Value);
            
            if (!existingGoals.Any(g => g.Contains("Running")))
            {
                suggestions.Add($"Run 50km this month (Current: {totalDistance:F1}km)");
                suggestions.Add("Complete a 5K run in under 30 minutes");
            }
        }

        if (recentActivities.Any())
        {
            var avgCalories = recentActivities.Average(a => a.CaloriesBurned);
            suggestions.Add($"Burn 3000 calories per week through exercise");
        }

        // General fitness suggestions
        if (!existingGoals.Any(g => g.Contains("Weight")))
        {
            suggestions.Add("Lose 5kg in 2 months");
            suggestions.Add("Gain 3kg of muscle in 3 months");
        }

        if (!existingGoals.Any(g => g.Contains("Water")))
        {
            suggestions.Add("Drink 2.5 liters of water daily for 30 days");
        }

        if (!existingGoals.Any(g => g.Contains("Sleep")))
        {
            suggestions.Add("Get 8 hours of sleep for 21 consecutive days");
        }

        suggestions.Add("Complete 100 workouts this year");
        suggestions.Add("Try 5 new types of exercises this month");
        suggestions.Add("Achieve 10,000 steps daily for 30 days");
        suggestions.Add("Reduce body fat percentage by 2%");

        return suggestions.Take(6).ToList();
    }

    public async Task<string> GetPersonalizedTipAsync(string userId)
    {
        var tips = new List<string>();

        // Analyze recent activity
        var recentActivities = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= DateTime.Today.AddDays(-7))
            .ToListAsync();

        var recentNutrition = await _context.Nutritions
            .Where(n => n.UserId == userId && n.Date >= DateTime.Today.AddDays(-7))
            .ToListAsync();

        var recentWater = await _context.WaterIntakes
            .Where(w => w.UserId == userId && w.Date >= DateTime.Today.AddDays(-7))
            .ToListAsync();

        var recentSleep = await _context.SleepLogs
            .Where(s => s.UserId == userId && s.StartTime >= DateTime.Today.AddDays(-7))
            .ToListAsync();

        // Activity-based tips
        if (recentActivities.Count < 3)
        {
            tips.Add("💪 Try to exercise at least 3-4 times per week for optimal health benefits.");
        }
        else if (recentActivities.Count > 6)
        {
            tips.Add("🌟 Great job staying active! Remember to include rest days for recovery.");
        }

        // Nutrition tips
        if (recentNutrition.Any())
        {
            var avgCalories = recentNutrition.Average(n => n.Calories);
            if (avgCalories > 2500)
            {
                tips.Add("🥗 Consider portion control - your average daily calories are quite high.");
            }
        }

        // Water intake tips
        if (recentWater.Any())
        {
            var avgWater = recentWater.Average(w => w.AmountInMl);
            if (avgWater < 2000)
            {
                tips.Add("💧 Aim to drink at least 2-2.5 liters of water daily for better hydration.");
            }
        }

        // Sleep tips
        if (recentSleep.Any())
        {
            var avgSleep = recentSleep.Average(s => (s.EndTime - s.StartTime).TotalHours);
            if (avgSleep < 7)
            {
                tips.Add("😴 Try to get 7-9 hours of sleep each night for better recovery and performance.");
            }
        }

        // General motivational tips
        tips.Add("🎯 Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.");
        tips.Add("🔥 Consistency is key! Small daily improvements lead to big results over time.");
        tips.Add("🏃 Mix cardio and strength training for a well-rounded fitness routine.");
        tips.Add("🍎 Nutrition is 70% of your fitness journey - fuel your body right!");
        tips.Add("📊 Track your progress regularly to stay motivated and adjust your plan.");

        // Return a random tip
        var random = new Random();
        return tips[random.Next(tips.Count)];
    }
}


