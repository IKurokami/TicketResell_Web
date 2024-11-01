FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "TicketResell.Api/TicketResell.Api.csproj"
RUN dotnet restore "TicketResell.Repositories/TicketResell.Repositories.csproj"
RUN dotnet restore "TicketResell.Services/TicketResell.Services.csproj"

RUN dotnet build "TicketResell.Api/TicketResell.Api.csproj" -c Release -o /app/publish



FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "TicketResell.Api.dll" ]