# Script de rebuild et déploiement du frontend TaskFlow
# Ce script rebuild le frontend avec les bonnes variables d'environnement

Write-Host "🚀 Rebuild et déploiement du frontend TaskFlow" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier les URLs hardcodées
Write-Host "🔍 Vérification des URLs hardcodées..." -ForegroundColor Yellow
& .\check-hardcoded-urls.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Des URLs hardcodées ont été trouvées. Corrigez-les avant de continuer." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Vérifier que le fichier .env.production existe
if (-Not (Test-Path "taskflow-frontend\.env.production")) {
    Write-Host "❌ Erreur: Le fichier .env.production n'existe pas!" -ForegroundColor Red
    Write-Host "📝 Création du fichier .env.production..." -ForegroundColor Yellow
    Copy-Item "taskflow-frontend\.env.production.example" "taskflow-frontend\.env.production"
    Write-Host "✅ Fichier créé. Vérifiez les valeurs avant de continuer." -ForegroundColor Green
    exit 1
}

# Afficher les variables d'environnement
Write-Host "📋 Variables d'environnement de production:" -ForegroundColor Yellow
Get-Content "taskflow-frontend\.env.production"
Write-Host ""

# Demander confirmation
$confirmation = Read-Host "Continuer avec ces variables? (o/n)"
if ($confirmation -ne 'o') {
    Write-Host "❌ Annulé par l'utilisateur" -ForegroundColor Red
    exit 0
}

# Aller dans le dossier frontend
Set-Location taskflow-frontend

Write-Host ""
Write-Host "🧹 Nettoyage du dossier dist..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "✅ Dossier dist supprimé" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔨 Build du frontend en mode production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build réussi!" -ForegroundColor Green
    Write-Host ""
    
    # Vérifier que localhost:3000 n'est plus dans le build
    Write-Host "🔍 Vérification du build..." -ForegroundColor Yellow
    $jsFiles = Get-ChildItem -Path "dist\assets\*.js" -File
    $foundLocalhost = $false
    
    foreach ($file in $jsFiles) {
        $content = Get-Content $file.FullName -Raw
        if ($content -match "localhost:3000") {
            $foundLocalhost = $true
            Write-Host "⚠️  ATTENTION: 'localhost:3000' trouvé dans $($file.Name)" -ForegroundColor Red
        }
    }
    
    if (-Not $foundLocalhost) {
        Write-Host "✅ Aucune référence à localhost:3000 trouvée dans le build" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "📊 Taille du dossier dist:" -ForegroundColor Cyan
    $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "$([math]::Round($distSize, 2)) MB" -ForegroundColor White
    
    Write-Host ""
    Write-Host "✅ Le frontend est prêt à être déployé!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📤 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "1. Uploadez le contenu du dossier 'dist' sur votre hébergement" -ForegroundColor White
    Write-Host "2. Ou utilisez votre plateforme de déploiement (Vercel, Netlify, etc.)" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du build!" -ForegroundColor Red
    Write-Host "Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
    exit 1
}

Set-Location ..
