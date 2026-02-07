# Script pour vérifier les URLs hardcodées dans le frontend

Write-Host "Verification des URLs hardcodees dans le frontend" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$foundIssues = $false

# Chercher les URLs hardcodées
Write-Host "Recherche de 'localhost:3000' hardcode..." -ForegroundColor Yellow

$files = Get-ChildItem -Path "taskflow-frontend\src" -Recurse -Include *.ts,*.tsx,*.js,*.jsx

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Chercher localhost:3000 sans import.meta.env
        if ($line -match "localhost:3000" -and $line -notmatch "import\.meta\.env") {
            $foundIssues = $true
            Write-Host "URL hardcodee trouvee dans: $($file.Name)" -ForegroundColor Red
            Write-Host "   Ligne $($i + 1): $($line.Trim())" -ForegroundColor Yellow
            Write-Host ""
        }
    }
}

if (-not $foundIssues) {
    Write-Host "Aucune URL hardcodee trouvee!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Le frontend est pret pour la production!" -ForegroundColor Green
} else {
    Write-Host "Des URLs hardcodees ont ete trouvees!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Remplacez-les par: import.meta.env.VITE_API_URL" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Verification des fichiers de configuration..." -ForegroundColor Yellow

# Vérifier .env.production
if (Test-Path "taskflow-frontend\.env.production") {
    Write-Host ".env.production existe" -ForegroundColor Green
    
    $envContent = Get-Content "taskflow-frontend\.env.production"
    $apiUrl = ($envContent | Select-String "VITE_API_URL=").ToString()
    
    if ($apiUrl) {
        Write-Host "   $apiUrl" -ForegroundColor White
    } else {
        Write-Host "VITE_API_URL non trouve dans .env.production" -ForegroundColor Yellow
    }
} else {
    Write-Host ".env.production n'existe pas!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verification terminee!" -ForegroundColor Green
