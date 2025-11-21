# Script para migrar esquema a AWS RDS
# ====================================

Write-Host "🚀 Iniciando migración a AWS RDS..." -ForegroundColor Yellow

$BACKEND_PATH = "apps\backend"

# Verificar que estamos en el directorio correcto
if (-not (Test-Path $BACKEND_PATH)) {
    Write-Host "❌ Error: No se encontró el directorio $BACKEND_PATH" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde la raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Verificar que existe el archivo .env de Prisma
$PRISMA_ENV = "$BACKEND_PATH\prisma\.env"
if (-not (Test-Path $PRISMA_ENV)) {
    Write-Host "❌ Error: No se encontró $PRISMA_ENV" -ForegroundColor Red
    Write-Host "Crea el archivo y configura DATABASE_URL con tus credenciales de AWS RDS" -ForegroundColor Yellow
    exit 1
}

# Leer la configuración
Write-Host "📋 Verificando configuración..." -ForegroundColor Cyan
$envContent = Get-Content $PRISMA_ENV -Raw
if ($envContent -match 'DATABASE_URL="([^"]+)"') {
    $databaseUrl = $matches[1]
    if ($databaseUrl -match '\[.*\]') {
        Write-Host "❌ Error: DATABASE_URL contiene placeholders sin reemplazar" -ForegroundColor Red
        Write-Host "Edita $PRISMA_ENV y reemplaza [USERNAME], [PASSWORD], [DATABASE_NAME] con valores reales" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ DATABASE_URL configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error: DATABASE_URL no encontrado en $PRISMA_ENV" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔄 Cambiando al directorio del backend..." -ForegroundColor Cyan
Set-Location $BACKEND_PATH

Write-Host "📦 Instalando dependencias (si es necesario)..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    pnpm install
}

Write-Host "`n🎯 Generando cliente de Prisma..." -ForegroundColor Cyan
pnpm db:generate

Write-Host "`n🗄️ Ejecutando migraciones en AWS RDS..." -ForegroundColor Cyan
Write-Host "Esto aplicará todas las migraciones en tu base de datos de AWS" -ForegroundColor Yellow

# Ejecutar migraciones
$result = pnpm db:migrate:prod
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Migración completada exitosamente!" -ForegroundColor Green
    Write-Host "🎉 Las tablas han sido creadas en AWS RDS" -ForegroundColor Green
    
    Write-Host "`n📊 Verificando tablas creadas..." -ForegroundColor Cyan
    pnpm db:studio
} else {
    Write-Host "`n❌ Error durante la migración" -ForegroundColor Red
    Write-Host "Verifica tus credenciales y conexión a AWS RDS" -ForegroundColor Yellow
}

Write-Host "`n🏠 Regresando al directorio raíz..." -ForegroundColor Cyan
Set-Location "..\..\"