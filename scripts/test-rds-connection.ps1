# Script PowerShell para validar conexión con AWS RDS
Write-Host "🔍 Validando conexión con AWS RDS..." -ForegroundColor Yellow

# Datos de conexión (reemplaza con tus datos reales)
$DB_HOST = "database-1.c702yeeu6qxd.us-east-2.rds.amazonaws.com"
$DB_PORT = 5432
$DB_USER = "[TU_USERNAME]"  # Reemplaza con tu usuario
$DB_NAME = "[TU_DATABASE]"  # Reemplaza con tu base de datos

Write-Host "🌐 Probando conectividad de red..." -ForegroundColor Cyan

# Probar conectividad básica con Test-NetConnection
try {
    $result = Test-NetConnection -ComputerName $DB_HOST -Port $DB_PORT -InformationLevel Quiet
    if ($result) {
        Write-Host "✅ Puerto $DB_PORT está abierto y accesible" -ForegroundColor Green
    } else {
        Write-Host "❌ No se puede conectar al puerto $DB_PORT" -ForegroundColor Red
        Write-Host "Verifica el Security Group y la configuración de red" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error al probar la conectividad: $_" -ForegroundColor Red
}

Write-Host "`n🗄️ Información de conexión:" -ForegroundColor Cyan
Write-Host "Host: $DB_HOST" -ForegroundColor White
Write-Host "Puerto: $DB_PORT" -ForegroundColor White
Write-Host "Usuario: $DB_USER" -ForegroundColor White
Write-Host "Base de datos: $DB_NAME" -ForegroundColor White

Write-Host "`n📋 Pasos siguientes:" -ForegroundColor Yellow
Write-Host "1. Asegúrate de tener las credenciales correctas (usuario/contraseña)"
Write-Host "2. Verifica que el Security Group 'EcoMarket' permita conexiones desde tu IP pública"
Write-Host "3. Actualiza el archivo .env con las credenciales reales"
Write-Host "4. Instala PostgreSQL client para probar conexión directa:"
Write-Host "   - Descarga desde: https://www.postgresql.org/download/windows/"
Write-Host "   - O instala con: winget install PostgreSQL.PostgreSQL"
Write-Host "5. Ejecuta las migraciones de Prisma una vez confirmada la conexión"

Write-Host "`n🔧 Para probar con psql (una vez instalado):" -ForegroundColor Cyan
$connectionString = "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
Write-Host $connectionString -ForegroundColor White

Write-Host "`n🌐 Tu IP pública actual (para agregar al Security Group):" -ForegroundColor Cyan
try {
    $publicIP = (Invoke-RestMethod -Uri "https://api.ipify.org").Trim()
    Write-Host "$publicIP/32" -ForegroundColor Green
} catch {
    Write-Host "No se pudo obtener la IP pública. Puedes buscarla en: https://whatismyipaddress.com" -ForegroundColor Yellow
}