using System.Security.Claims;
using HealthFitness.DTOs;
using HealthFitness.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.Controllers;

[Authorize]
public class NutritionController : Controller
{
    private readonly INutritionService _nutritionService;

    public NutritionController(INutritionService nutritionService)
    {
        _nutritionService = nutritionService;
    }

    public async Task<IActionResult> Index()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return RedirectToAction("Login", "Account");
        }

        var nutritions = await _nutritionService.GetUserNutritionsAsync(userId);
        return View(nutritions);
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(NutritionDto dto)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            var success = await _nutritionService.CreateNutritionAsync(dto, userId);
            if (success)
            {
                TempData["SuccessMessage"] = "Meal logged successfully.";
                return RedirectToAction("Index");
            }

            ModelState.AddModelError(string.Empty, "Failed to log meal.");
        }

        return View(dto);
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return RedirectToAction("Login", "Account");
        }

        var nutrition = await _nutritionService.GetNutritionByIdAsync(id, userId);
        if (nutrition == null)
        {
            return NotFound();
        }

        return View(nutrition);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(NutritionDto dto)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            var success = await _nutritionService.UpdateNutritionAsync(dto, userId);
            if (success)
            {
                TempData["SuccessMessage"] = "Meal updated successfully.";
                return RedirectToAction("Index");
            }

            ModelState.AddModelError(string.Empty, "Failed to update meal.");
        }

        return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return RedirectToAction("Login", "Account");
        }

        var success = await _nutritionService.DeleteNutritionAsync(id, userId);
        if (success)
        {
            TempData["SuccessMessage"] = "Meal deleted successfully.";
        }
        else
        {
            TempData["ErrorMessage"] = "Failed to delete meal.";
        }

        return RedirectToAction("Index");
    }
}

