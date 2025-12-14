using HealthFitness.API.Models;
using Microsoft.AspNetCore.Http;

namespace HealthFitness.API.Services;

public interface IDataImportService
{
    Task<DataImport> ImportFromCsvAsync(string userId, IFormFile file, string dataType);
    Task<DataImport> ImportFromJsonAsync(string userId, IFormFile file, string dataType);
    Task<List<DataImport>> GetUserImportsAsync(string userId);
    Task<DataImport?> GetImportByIdAsync(int importId);
}


