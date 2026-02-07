# Script pour pousser le fix du build
Write-Host "🔧 Push du fix pour le build Render..." -ForegroundColor Cyan

# Git add
Write-Host "`n📝 Ajout des fichiers..." -ForegroundColor Yellow
git add taskflow-api/package.json

# Commit
Write-Host "`n💾 Commit..." -ForegroundColor Yellow
git commit -m "fix: use npx nest build for Render deployment"

# Push
Write-Host "`n🚀 Push vers GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Changements poussés!" -ForegroundColor Green
Write-Host "`n📋 PROCHAINE ÉTAPE:" -ForegroundColor Cyan
Write-Host "Allez sur Render et cliquez sur Manual Deploy puis Deploy latest commit" -ForegroundColor White
