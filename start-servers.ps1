# HealthFitness - Start Both Servers
# This script starts the backend API and frontend React app in separate windows

Write-Host "🚀 Starting HealthFitness Application..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Install the LTS version (recommended)" -ForegroundColor Cyan
    Write-Host "3. Restart PowerShell after installation" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Node.js, run this script again." -ForegroundColor Yellow
    Write-Host ""
    
    # Ask if user wants to start backend only
    $response = Read-Host "Do you want to start the backend API only? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host ""
        Write-Host "Starting Backend API..." -ForegroundColor Green
        Set-Location "HealthFitness.API"
        dotnet run
    }
    exit
}

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend API in new window
Write-Host "Starting Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\HealthFitness.API'; Write-Host '🔧 Backend API Server' -ForegroundColor Green; Write-Host ''; dotnet run"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "Starting Frontend React App..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\healthfitness-client'; Write-Host '⚛️ Frontend React App' -ForegroundColor Blue; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: https://localhost:5001" -ForegroundColor Yellow
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
