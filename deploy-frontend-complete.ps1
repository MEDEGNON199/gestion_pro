# Script complet de déploiement frontend
# Teste l'API, rebuild, et propose le déploiement

param(
    [switch]$SkipTests,
    [switch]$AutoDeploy,
    [string]$Platform = "vercel"  # vercel, netlify, ou manual
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   TaskFlow - Déploiement Frontend Complet     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Étape 1: Test de l'API
if (-Not $SkipTests) {
    Write-Host "📡 ÉTAPE 1/3 : Test de l'API Backend" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    
    $envFile = "taskflow-frontend\.env.production"
    if (-Not (Test-Path $envFile)) {
        Write-Host "❌ Fichier .env.production introuvable!" -ForegroundColor Red
        exit 1
    }
    
    $apiUrl = (Get-Content $envFile | Select-String "VITE_API_URL=").ToString().Split("=")[1]
    Write-Host "   API URL: $apiUrl" -ForegroundColor White
    
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/" -Method GET -TimeoutSec 10 -ErrorAction Stop
        Write-Host "   ✅ API accessible" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ API non accessible!" -ForegroundColor Red
        Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Voulez-vous continuer quand même? (o/n)" -ForegroundColor Yellow
        $continue = Read-Host
        if ($continue -ne 'o') {
            exit 1
        }
    }
    Write-Host ""
} else {
    Write-Host "⏭️  Tests de l'API ignorés (--SkipTests)" -ForegroundColor Yellow
    Write-Host ""
}

# Étape 2: Build du frontend
Write-Host "🔨 ÉTAPE 2/3 : Build du Frontend" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Set-Location taskflow-frontend

# Nettoyer
if (Test-Path "dist") {
    Write-Host "   🧹 Nettoyage du dossier dist..." -ForegroundColor White
    Remove-Item -Recurse -Force dist
}

# Installer
Write-Host "   📦 Installation des dépendances..." -ForegroundColor White
npm install --silent

# Builder
Write-Host "   🔨 Build en cours..." -ForegroundColor White
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors du build!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Vérifier
Write-Host "   🔍 Vérification du build..." -ForegroundColor White
$jsFiles = Get-ChildItem -Path "dist\assets\*.js" -File
$foundLocalhost = $false

foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "localhost:3000") {
        $foundLocalhost = $true
        Write-Host "   ⚠️  ATTENTION: 'localhost:3000' trouvé dans le build!" -ForegroundColor Red
    }
}

if (-Not $foundLocalhost) {
    Write-Host "   ✅ Build vérifié - Aucune référence à localhost" -ForegroundColor Green
}

$distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   📊 Taille du build: $([math]::Round($distSize, 2)) MB" -ForegroundColor White

Write-Host ""
Write-Host "✅ Build terminé avec succès!" -ForegroundColor Green
Write-Host ""

Set-Location ..

# Étape 3: Déploiement
Write-Host "🚀 ÉTAPE 3/3 : Déploiement" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

if ($AutoDeploy) {
    Write-Host "   Déploiement automatique sur $Platform..." -ForegroundColor White
    
    Set-Location taskflow-frontend
    
    switch ($Platform.ToLower()) {
        "vercel" {
            Write-Host "   📤 Déploiement sur Vercel..." -ForegroundColor Cyan
            vercel --prod
        }
        "netlify" {
            Write-Host "   📤 Déploiement sur Netlify..." -ForegroundColor Cyan
            netlify deploy --prod --dir=dist
        }
        "manual" {
            Write-Host "   📁 Le dossier dist est prêt pour un déploiement manuel" -ForegroundColor Cyan
            Write-Host "   Chemin: $(Get-Location)\dist" -ForegroundColor White
        }
        default {
            Write-Host "   ⚠️  Plateforme inconnue: $Platform" -ForegroundColor Yellow
        }
    }
    
    Set-Location ..
} else {
    Write-Host "   Le build est prêt dans: taskflow-frontend\dist\" -ForegroundColor White
    Write-Host ""
    Write-Host "   Commandes de déploiement disponibles:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Vercel:" -ForegroundColor Yellow
    Write-Host "   cd taskflow-frontend && vercel --prod" -ForegroundColor White
    Write-Host ""
    Write-Host "   Netlify:" -ForegroundColor Yellow
    Write-Host "   cd taskflow-frontend && netlify deploy --prod --dir=dist" -ForegroundColor White
    Write-Host ""
    Write-Host "   Ou uploadez manuellement le contenu de taskflow-frontend\dist\" -ForegroundColor White
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║            ✅ Processus terminé !              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Checklist post-déploiement:" -ForegroundColor Cyan
Write-Host "   [ ] Ouvrir votre site en production" -ForegroundColor White
Write-Host "   [ ] Ouvrir la console (F12)" -ForegroundColor White
Write-Host "   [ ] Vérifier que les requêtes vont vers l'API de production" -ForegroundColor White
Write-Host "   [ ] Tester la connexion et les fonctionnalités" -ForegroundColor White
Write-Host ""
