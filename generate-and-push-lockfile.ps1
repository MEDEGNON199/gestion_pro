# Script pour générer et pousser package-lock.json
Write-Host "🔧 Génération de package-lock.json pour Render..." -ForegroundColor Cyan

# Étape 1: Aller dans le dossier backend
Write-Host "`n📦 Génération de package-lock.json..." -ForegroundColor Yellow
Set-Location taskflow-api

# Supprimer node_modules pour repartir à zéro
if (Test-Path "node_modules") {
    Write-Host "🗑️  Suppression de node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}

# Générer package-lock.json avec npm install
Write-Host "📥 Installation des dépendances et génération du lockfile..." -ForegroundColor Yellow
npm install

# Retour au dossier racine
Set-Location ..

# Étape 2: Vérifier que package-lock.json existe
if (Test-Path "taskflow-api/package-lock.json") {
    Write-Host "`n✅ package-lock.json généré avec succès!" -ForegroundColor Green
    
    # Étape 3: Git add
    Write-Host "`n📝 Ajout des fichiers à git..." -ForegroundColor Yellow
    git add taskflow-api/.gitignore
    git add taskflow-api/package-lock.json
    
    # Étape 4: Commit
    Write-Host "`n💾 Commit des changements..." -ForegroundColor Yellow
    git commit -m "fix: add package-lock.json for Render deployment"
    
    # Étape 5: Push
    Write-Host "`n🚀 Push vers GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "`n✅ SUCCÈS! package-lock.json est maintenant sur GitHub!" -ForegroundColor Green
    Write-Host "`n📋 PROCHAINE ÉTAPE:" -ForegroundColor Cyan
    Write-Host "Allez sur Render et cliquez sur 'Manual Deploy' > 'Deploy latest commit'" -ForegroundColor White
} else {
    Write-Host "`n❌ ERREUR: package-lock.json n'a pas été généré!" -ForegroundColor Red
    Write-Host "Vérifiez que npm install a fonctionné correctement." -ForegroundColor Yellow
}
