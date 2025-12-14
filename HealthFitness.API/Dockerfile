# Backend API Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["HealthFitness.API.csproj", "./"]
RUN dotnet restore "HealthFitness.API.csproj"
COPY . .
RUN dotnet build "HealthFitness.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HealthFitness.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthFitness.API.dll"]
