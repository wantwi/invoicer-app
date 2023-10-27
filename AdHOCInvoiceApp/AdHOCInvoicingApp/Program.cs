using AdHOCInvoicingApp.Helpers;
using AdHOCInvoicingApp.Service;
using Duende.Bff.Yarp;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using AdHOCInvoicingApp.Helpers;
using AdHOCInvoicingApp.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions();



var identityData = new IdentitySettings();
var apiSettingsData = new APISettings();

builder.Configuration.Bind("IdentitySettings", identityData);
builder.Configuration.Bind("APISettings", apiSettingsData);

builder.Services.AddSingleton(identityData);
builder.Services.AddSingleton(apiSettingsData);
builder.Services.AddSingleton(builder.Configuration);

builder.Services.AddHttpClient();
builder.Services.AddScoped<HTTPClientInterface, HTTPREQUEST>();
builder.Services.AddControllers();
builder.Services.AddBff()
    .AddRemoteApis();
//.AddServerSideSessions();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "cookie";
    options.DefaultChallengeScheme = "oidc";
    options.DefaultSignOutScheme = "oidc";
}).AddCookie("cookie", options =>
{
    options.Cookie.Name = identityData.CookieName;
    options.Cookie.SameSite = identityData.SameSiteMode ? SameSiteMode.Strict : SameSiteMode.None;
}).AddOpenIdConnect("oidc", options =>
{
    options.Authority = identityData.Authority;
    options.ClientId = identityData.ClientId;
    options.ClientSecret = identityData.ClientSecret;
    options.ResponseType = identityData.ResponseType;
    options.ResponseMode = identityData.ResponseMode;

    options.GetClaimsFromUserInfoEndpoint = true;
    options.MapInboundClaims = false;
    options.SaveTokens = true;


    options.Scope.Clear();
    foreach (var item in identityData.Scope)
    {
        options.Scope.Add(item);
    }


    options.TokenValidationParameters = new()
    {
        NameClaimType = "name",
        RoleClaimType = "role"
    };


});


builder.Services.AddOpenIdConnectAccessTokenManagement();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseBff();
app.UseAuthorization();
app.MapBffManagementEndpoints();

app.MapControllers()
    .RequireAuthorization()
    .AsBffApiEndpoint();

// app.MapRemoteBffApiEndpoint("/todos", "https://localhost:5020/todos")
//     .RequireAccessToken(Duende.Bff.TokenType.User);

app.MapFallbackToFile("index.html"); ;

app.Run();
