FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SnakeGameBackend2/SnakeGameBackend2.csproj", "SnakeGameBackend2/"]
RUN dotnet restore "SnakeGameBackend2/SnakeGameBackend2.csproj"
COPY . .
WORKDIR "/src/SnakeGameBackend2"
RUN dotnet build "SnakeGameBackend2.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SnakeGameBackend2.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SnakeGameBackend2.dll"]