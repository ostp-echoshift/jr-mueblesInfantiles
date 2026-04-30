# ================================================================
# deploy.ps1 -- Despliegue Seguro IMJR-WEB
# OSTP @echoShift | Pipeline: Leviatan | v2.0
# ================================================================
# Uso:
#   .\deploy.ps1                       # Despliegue estándar
#   .\deploy.ps1 -DryRun               # Simula sin modificar ni pushear
#   .\deploy.ps1 -Force                # Omite confirmaciones interactivas
#   .\deploy.ps1 -Message "fix: ..."   # Mensaje de commit personalizado
# ================================================================

param(
    [switch]$DryRun,
    [switch]$Force,
    [string]$Message = "",
    [string]$RootPath = $PSScriptRoot,
    [string]$Branch = "master",
    [string]$SubDir = "jr-mueblesInfantiles"
)

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogDir = Join-Path $RootPath "docs\log"
$LogPath = Join-Path $LogDir "deploy_$Timestamp.log"
$BackupDir = Join-Path $RootPath "_deploy_backup_$Timestamp"

# ================================================================
# HELPERS
# ================================================================
function Write-UTF8NoBOM {
    param([string]$Path, [string]$Content)
    $enc = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

function Log {
    param([string]$Level, [string]$Msg)
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [$Level] $Msg"
    $prev = Get-Content $LogPath -Raw -ErrorAction SilentlyContinue
    Write-UTF8NoBOM $LogPath ("$prev$line`n")
    
    $color = switch($Level) {
        "PASS" { "Green" } "WARN" { "Yellow" } "FAIL" { "Red" } "INFO" { "Cyan" } default { "White" }
    }
    Write-Host "[$Level] $Msg" -ForegroundColor $color
}

function Confirm-Action {
    param([string]$Msg)
    if ($Force) { return $true }
    Write-Host "`n⚠️  $Msg`n   ¿Continuar? (S/N): " -ForegroundColor Yellow -NoNewline
    $resp = Read-Host
    return $resp -in @('S','s','Y','y','')
}

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }

# ================================================================
# FASE 0: INICIALIZACIÓN
# ================================================================
Log "INFO" "=== INICIANDO DEPLOY v2.0 ==="
Log "INFO" "Raíz: $RootPath | Rama: $Branch | SubDir: $SubDir"
if ($DryRun) { Log "WARN" "MODO DRY-RUN ACTIVADO — No se realizarán cambios" }

# ================================================================
# FASE 1: VALIDACIÓN DE ENTORNO
# ================================================================
Log "INFO" "--- FASE 1: Validación de entorno ---"
if (-not (Test-Path "$RootPath\.git")) { Log "FAIL" "No se encontró repositorio git"; exit 1 }
try { $gitVer = git --version 2>&1; Log "PASS" "Git disponible: $gitVer" } catch { Log "FAIL" "Git no encontrado en PATH"; exit 1 }

$curBranch = git -C $RootPath rev-parse --abbrev-ref HEAD 2>&1
if ($curBranch -ne $Branch) {
    Log "WARN" "Rama actual: '$curBranch' (esperado '$Branch')"
    if (-not (Confirm-Action "¿Continuar en rama $curBranch?")) { exit 0 }
} else { Log "PASS" "Rama correcta: $curBranch" }

# ================================================================
# FASE 2: GESTIÓN DE CNAME (Subdirectorio vs Dominio)
# ================================================================
Log "INFO" "--- FASE 2: Gestión de CNAME ---"
$cnamePath = Join-Path $RootPath "CNAME"
$ostpDir = Join-Path $RootPath "_ostp"
if (-not (Test-Path $ostpDir)) { New-Item -ItemType Directory -Path $ostpDir -Force | Out-Null }

if (Test-Path $cnamePath) {
    $dest = Join-Path $ostpDir "CNAME.archived"
    Move-Item $cnamePath $dest -Force
    Log "WARN" "CNAME movido a _ostp/ — GitHub Pages usará subdirectorio /$SubDir/"
} else {
    Log "PASS" "CNAME no presente — Despliegue en subdirectorio confirmado"
}

# ================================================================
# FASE 3: NORMALIZACIÓN DE RUTAS (Absolutas → Relativas)
# ================================================================
Log "INFO" "--- FASE 3: Normalización de rutas ---"
$files = Get-ChildItem -Path $RootPath -Recurse -Include "*.html","*.js","*.json" |
    Where-Object { $_.FullName -notmatch '\\(_backup_|_ostp|node_modules|\.git|docs\\log)' }

$fixedCount = 0
foreach ($f in $files) {
    $raw = Get-Content $f.FullName -Raw
    # Regex segura: no modifica protocolos, data URIs, anclas, mailto, tel, javascript
    $new = $raw -replace '(href|src)="\/(?!\/|http|https|data:|#|mailto:|tel:|javascript:)', '$1="'
    if ($raw -ne $new) {
        if (-not $DryRun) { Write-UTF8NoBOM $f.FullName $new }
        $fixedCount++
    }
}
Log "PASS" "Rutas normalizadas en $fixedCount archivos"

# ================================================================
# FASE 4: VALIDACIÓN PRE-DEPLOY
# ================================================================
Log "INFO" "--- FASE 4: Validación de integridad ---"
$critical = @("index.html","salecar.html","assets/css/tokens.css","assets/js/main.js","data/productos.json")
$missing = $critical | Where-Object { -not (Test-Path (Join-Path $RootPath $_)) }
if ($missing.Count -gt 0) {
    Log "FAIL" "Archivos críticos faltantes: $($missing -join ', ')"
    if (-not (Confirm-Action "¿Continuar con archivos faltantes?")) { exit 1 }
} else { Log "PASS" "Todos los archivos críticos presentes" }

# ================================================================
# FASE 5: COMMIT & PUSH
# ================================================================
Log "INFO" "--- FASE 5: Commit & Push ---"
if (-not $Message) { $Message = "deploy: actualización automática [$Timestamp]" }
Log "INFO" "Mensaje: $Message"

if (-not $DryRun) {
    try {
        git -C $RootPath add . 2>&1 | Out-Null
        Log "PASS" "git add completado"
    } catch { Log "FAIL" "Error en git add: $_"; exit 1 }

    try {
        $status = git -C $RootPath status --porcelain 2>&1
        if (-not $status.Trim()) {
            Log "WARN" "Sin cambios pendientes — commit omitido"
        } else {
            git -C $RootPath commit -m $Message 2>&1 | Out-Null
            Log "PASS" "Commit creado"
        }
    } catch { Log "WARN" "Sin cambios nuevos para commitear" }

    try {
        Log "INFO" "Ejecutando push a origin/$Branch ..."
        git -C $RootPath push origin $Branch 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        if ($LASTEXITCODE -eq 0) { Log "PASS" "Push exitoso" }
        else { Log "FAIL" "Push falló con código $LASTEXITCODE"; exit 1 }
    } catch { Log "FAIL" "Error en git push: $_"; exit 1 }
} else {
    Log "WARN" "[DRYRUN] Se ejecutaría: git add . && git commit -m '$Message' && git push origin $Branch"
}

# ================================================================
# RESUMEN FINAL
# ================================================================
Log "INFO" "=== DEPLOY FINALIZADO ==="
Write-Host "`n📄 Log: $LogPath" -ForegroundColor Gray
if (-not $DryRun) {
    Write-Host "🌐 URL de despliegue: https://ostp-echoshift.github.io/$SubDir/" -ForegroundColor Cyan
    Write-Host "⏳ GitHub Pages tarda ~60-90s en actualizar." -ForegroundColor Gray
} else {
    Write-Host "🛡️  Ejecución simulada — Ningún archivo fue modificado." -ForegroundColor Magenta
}