# Script de test de l'API backend
# Vérifie que l'API est accessible avant de déployer le frontend

Write-Host "🔍 Test de l'API Backend TaskFlow" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Lire l'URL de l'API depuis .env.production
$envFile = "taskflow-frontend\.env.production"
if (Test-Path $envFile) {
    $apiUrl = (Get-Content $envFile | Select-String "VITE_API_URL=").ToString().Split("=")[1]
    Write-Host "📋 URL de l'API: $apiUrl" -ForegroundColor Yellow
} else {
    Write-Host "❌ Fichier .env.production introuvable!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔌 Test de connexion..." -ForegroundColor Yellow

# Test 1: Health check
Write-Host ""
Write-Host "1️⃣  Test du endpoint /health..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Health check OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Endpoint /health non disponible (peut être normal)" -ForegroundColor Yellow
}

# Test 2: Root endpoint
Write-Host ""
Write-Host "2️⃣  Test du endpoint racine /..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ API accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   📄 Réponse: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor White
} catch {
    Write-Host "   ❌ API non accessible!" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Vérifications à faire:" -ForegroundColor Yellow
    Write-Host "   1. Votre backend Render est-il démarré?" -ForegroundColor White
    Write-Host "   2. L'URL est-elle correcte?" -ForegroundColor White
    Write-Host "   3. Vérifiez les logs sur Render.com" -ForegroundColor White
    exit 1
}

# Test 3: Auth endpoint
Write-Host ""
Write-Host "3️⃣  Test du endpoint /auth/login..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/auth/login" -Method POST -TimeoutSec 10 -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 400 -or $_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✅ Endpoint auth accessible (erreur attendue sans credentials)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Endpoint auth: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

# Test 4: Dashboard stats endpoint
Write-Host ""
Write-Host "4️⃣  Test du endpoint /dashboard/stats..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/dashboard/stats" -Method GET -TimeoutSec 10 -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✅ Endpoint dashboard accessible (401 = auth requise)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Endpoint dashboard: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Tests terminés!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Résumé:" -ForegroundColor Cyan
Write-Host "   • API URL: $apiUrl" -ForegroundColor White
Write-Host "   • L'API semble accessible" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Vous pouvez maintenant rebuilder et déployer le frontend:" -ForegroundColor Yellow
Write-Host "   .\rebuild-and-deploy-frontend.ps1" -ForegroundColor White
Write-Host ""
