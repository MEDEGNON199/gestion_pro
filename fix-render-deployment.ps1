# Script pour corriger le déploiement Render
Write-Host "🔧 Correction du déploiement Render..." -ForegroundColor Cyan

# Étape 1: Ajouter package-lock.json
Write-Host "`n📦 Ajout de package-lock.json..." -ForegroundColor Yellow
git add taskflow-api/.gitignore
git add taskflow-api/package-lock.json

# Étape 2: Commit
Write-Host "`n💾 Commit des changements..." -ForegroundColor Yellow
git commit -m "fix: add package-lock.json for Render deployment"

# Étape 3: Push
Write-Host "`n🚀 Push vers GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Fichiers poussés avec succès!" -ForegroundColor Green
Write-Host "`n📋 PROCHAINES ÉTAPES SUR RENDER:" -ForegroundColor Cyan
Write-Host "1. Allez sur votre service 'taskflow-api' sur Render" -ForegroundColor White
Write-Host "2. Cliquez sur 'Settings' dans le menu de gauche" -ForegroundColor White
Write-Host "3. Dans 'Build & Deploy', changez:" -ForegroundColor White
Write-Host "   - Language: Node (PAS Docker!)" -ForegroundColor Yellow
Write-Host "   - Build Command: cd taskflow-api && npm ci && npm run build" -ForegroundColor Yellow
Write-Host "   - Start Command: cd taskflow-api && npm run start:prod" -ForegroundColor Yellow
Write-Host "4. Cliquez sur 'Save Changes'" -ForegroundColor White
Write-Host "5. Cliquez sur 'Manual Deploy' > 'Deploy latest commit'" -ForegroundColor White
