# Script pour vérifier les URLs hardcodées dans le frontend

Write-Host "🔍 Vérification des URLs hardcodées dans le frontend" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$foundIssues = $false

# Chercher les URLs hardcodées (sans import.meta.env)
Write-Host "Recherche de 'http://localhost:3000' hardcodé..." -ForegroundColor Yellow

$files = Get-ChildItem -Path "taskflow-frontend\src" -Recurse -Include *.ts,*.tsx,*.js,*.jsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Chercher les URLs hardcodées (pas dans import.meta.env)
    if ($content -match "(?<!import\.meta\.env\.VITE_API_URL \|\| )'http://localhost:3000'" -or 
        $content -match '(?<!import\.meta\.env\.VITE_API_URL \|\| )"http://localhost:3000"') {
        
        $foundIssues = $true
        Write-Host "❌ URL hardcodée trouvée dans: $($file.FullName)" -ForegroundColor Red
        
        # Afficher les lignes concernées
        $lines = Get-Content $file.FullName
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "http://localhost:3000" -and 
                $lines[$i] -notmatch "import\.meta\.env\.VITE_API_URL") {
                Write-Host "   Ligne $($i + 1): $($lines[$i].Trim())" -ForegroundColor Yellow
            }
        }
        Write-Host ""
    }
}

if (-not $foundIssues) {
    Write-Host "✅ Aucune URL hardcodée trouvée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Toutes les URLs utilisent correctement:" -ForegroundColor Cyan
    Write-Host "   import.meta.env.VITE_API_URL || 'http://localhost:3000'" -ForegroundColor White
    Write-Host ""
    Write-Host "Le frontend est prêt pour la production! 🎉" -ForegroundColor Green
} else {
    Write-Host "⚠️  Des URLs hardcodées ont été trouvées!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Remplacez-les par:" -ForegroundColor Yellow
    Write-Host "   import.meta.env.VITE_API_URL || 'http://localhost:3000'" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "📋 Vérification des fichiers de configuration..." -ForegroundColor Yellow

# Vérifier .env.production
if (Test-Path "taskflow-frontend\.env.production") {
    Write-Host "✅ .env.production existe" -ForegroundColor Green
    
    $envContent = Get-Content "taskflow-frontend\.env.production"
    $apiUrl = ($envContent | Select-String "VITE_API_URL=").ToString()
    
    if ($apiUrl) {
        Write-Host "   $apiUrl" -ForegroundColor White
    } else {
        Write-Host "⚠️  VITE_API_URL non trouvé dans .env.production" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env.production n'existe pas!" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Vérification terminée!" -ForegroundColor Green
