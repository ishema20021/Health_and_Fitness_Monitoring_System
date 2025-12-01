using System.Security.Claims;
using HealthFitness.DTOs;
using HealthFitness.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.Controllers;

[Authorize]
public class GoalController : Controller
{
    private readonly IGoalService _goalService;

    public GoalController(IGoalService goalService)
    {
        _goalService = goalService;
    }

    public async Task<IActionResult> Index()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return RedirectToAction("Login", "Account");
        }

        var goals = await _goalService.GetUserGoalsAsync(userId);
        return View(goals);
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(GoalDto dto)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            var success = await _goalService.CreateGoalAsync(dto, userId);
            if (success)
            {
                TempData["SuccessMessage"] = "Goal created successfully.";
                return RedirectToAction("Index");
            }

            ModelState.AddModelError(string.Empty, "Failed to create goal.");
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

        var goal = await _goalService.GetGoalByIdAsync(id, userId);
        if (goal == null)
        {
            return NotFound();
        }

        return View(goal);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(GoalDto dto)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            var success = await _goalService.UpdateGoalAsync(dto, userId);
            if (success)
            {
                TempData["SuccessMessage"] = "Goal updated successfully.";
                return RedirectToAction("Index");
            }

            ModelState.AddModelError(string.Empty, "Failed to update goal.");
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

        var success = await _goalService.DeleteGoalAsync(id, userId);
        if (success)
        {
            TempData["SuccessMessage"] = "Goal deleted successfully.";
        }
        else
        {
            TempData["ErrorMessage"] = "Failed to delete goal.";
        }

        return RedirectToAction("Index");
    }

    [HttpGet]
    public async Task<IActionResult> UpdateProgress(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return RedirectToAction("Login", "Account");
        }

        var goal = await _goalService.GetGoalByIdAsync(id, userId);
        if (goal == null)
        {
            return NotFound();
        }

        return View(goal);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateProgress(int id, decimal currentValue)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return RedirectToAction("Login", "Account");
        }

        var success = await _goalService.UpdateGoalProgressAsync(id, currentValue, userId);
        if (success)
        {
            TempData["SuccessMessage"] = "Goal progress updated successfully.";
        }
        else
        {
            TempData["ErrorMessage"] = "Failed to update goal progress.";
        }

        return RedirectToAction("Index");
    }
}

