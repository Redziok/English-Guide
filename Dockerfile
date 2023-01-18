#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

WORKDIR /src
COPY ["mingielewicz-inzynierka.csproj", "."]
RUN dotnet restore "./mingielewicz-inzynierka.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "mingielewicz-inzynierka.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "mingielewicz-inzynierka.csproj" -c Release -o /app/publish

FROM node:16 AS build-web
COPY ./ClientApp/package.json /ClientApp/package.json
COPY ./ClientApp/package-lock.json /ClientApp/package-lock.json
WORKDIR /ClientApp
RUN npm ci
COPY ./ClientApp/ /ClientApp
RUN npm run build

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build-web /ClientApp/build ./ClientApp/build
ENTRYPOINT ["dotnet", "mingielewicz-inzynierka.dll"]