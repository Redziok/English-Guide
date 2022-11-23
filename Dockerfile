# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:6.0-focal
WORKDIR /app
COPY ./bin/Release/net6.0/publish/ /app

ENTRYPOINT ["dotnet", "mingielewicz-inzynierka.dll"]