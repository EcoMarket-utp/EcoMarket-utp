# Configuración AWS S3 para EcoMarket

## Pasos para configurar S3:

### 1. Crear bucket S3
```bash
# Comando para crear bucket (reemplaza 'ecomarket-images-2024' con un nombre único)
aws s3 mb s3://ecomarket-images-2024 --region us-east-1
```

### 2. Configurar política del bucket
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecomarket-images-2024/*"
    }
  ]
}
```

### 3. Configurar CORS
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 4. Variables de entorno necesarias:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_S3_BUCKET_NAME

### 5. Crear usuario IAM con permisos específicos para S3
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::ecomarket-images-2024/*"
      ]
    }
  ]
}
```