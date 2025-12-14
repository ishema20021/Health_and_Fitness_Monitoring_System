# HealthFitness - Docker Quick Start
# Run this script after installing Docker Desktop

Write-Host "🐳 HealthFitness Docker Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host "2. Install Docker Desktop for Windows" -ForegroundColor Cyan
    Write-Host "3. Restart your computer" -ForegroundColor Cyan
    Write-Host "4. Start Docker Desktop" -ForegroundColor Cyan
    Write-Host "5. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

# Check if Docker is running
try {
    docker ps | Out-Null
}
catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "✅ Docker is installed and running!" -ForegroundColor Green
Write-Host ""

# Ask user what to do
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "1. Start all services (recommended)" -ForegroundColor White
Write-Host "2. Start in background mode" -ForegroundColor White
Write-Host "3. Stop all services" -ForegroundColor White
Write-Host "4. View logs" -ForegroundColor White
Write-Host "5. Rebuild and start" -ForegroundColor White
Write-Host "6. Clean up (remove containers and volumes)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting all services..." -ForegroundColor Green
        Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
        Write-Host ""
        docker-compose up --build
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting all services in background..." -ForegroundColor Green
        docker-compose up -d --build
        Write-Host ""
        Write-Host "✅ Services started!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access URLs:" -ForegroundColor Cyan
        Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
        Write-Host "  Backend:   https://localhost:5001" -ForegroundColor White
        Write-Host "  Swagger:   https://localhost:5001/swagger" -ForegroundColor White
        Write-Host ""
        Write-Host "View logs with: docker-compose logs -f" -ForegroundColor Yellow
    }
    "3" {
        Write-Host ""
        Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "📋 Showing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    "5" {
        Write-Host ""
        Write-Host "🔄 Rebuilding and starting..." -ForegroundColor Green
        docker-compose down
        docker-compose up --build
    }
    "6" {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will delete all containers, networks, and database!" -ForegroundColor Red
        $confirm = Read-Host "Are you sure? (yes/no)"
        if ($confirm -eq "yes") {
            Write-Host ""
            Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
            docker-compose down -v
            Write-Host "✅ Cleanup complete!" -ForegroundColor Green
        }
        else {
            Write-Host "Cancelled." -ForegroundColor Yellow
        }
    }
    default {
        Write-Host ""
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Press Enter to exit"
