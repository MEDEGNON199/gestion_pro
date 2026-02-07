# Script pour déplacer @nestjs/cli vers dependencies
Write-Host "🔧 Déplacement de @nestjs/cli vers dependencies..." -ForegroundColor Cyan

# Aller dans taskflow-api
Set-Location taskflow-api

# Supprimer node_modules et package-lock.json
Write-Host "`n🗑️  Nettoyage..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}

# Réinstaller pour générer nouveau package-lock.json
Write-Host "`n📦 Réinstallation des dépendances..." -ForegroundColor Yellow
npm install

# Retour à la racine
Set-Location ..

# Git add
Write-Host "`n📝 Ajout des fichiers à git..." -ForegroundColor Yellow
git add taskflow-api/package.json
git add taskflow-api/package-lock.json

# Commit
Write-Host "`n💾 Commit..." -ForegroundColor Yellow
git commit -m "fix: move @nestjs/cli to dependencies for Render build"

# Push
Write-Host "`n🚀 Push vers GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ SUCCÈS! @nestjs/cli est maintenant dans dependencies" -ForegroundColor Green
Write-Host "`n📋 PROCHAINE ÉTAPE:" -ForegroundColor Cyan
Write-Host "Allez sur Render et redéployez le service" -ForegroundColor White
