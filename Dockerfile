FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
COPY ./bin/Release/net6.0/publish/ /app

ENTRYPOINT ["dotnet", "mingielewicz-inzynierka.dll"]