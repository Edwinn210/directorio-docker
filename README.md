# Sistema de Directorio de Personas

Proyecto académico de integración continua desarrollado con Node.js,
Express, MySQL y Docker.

## Arquitectura

El proyecto contiene dos servicios:

- app: aplicación REST desarrollada con Node.js.
- mysql: base de datos MySQL 8.4.

Ambos servicios se comunican mediante una red privada de Docker Compose.
La aplicación utiliza el nombre del servicio `mysql` como dirección
del servidor de base de datos.

## Requisitos

- Docker Desktop
- Docker Compose

## Configuración

1. Clonar el repositorio.
2. Crear el archivo de variables de entorno:

   cp .env.example .env

3. Configurar las contraseñas en el archivo `.env`.

## Ejecución

Construir las imágenes:

docker compose build

Levantar los servicios:

docker compose up -d

Consultar los contenedores:

docker compose ps

Consultar los registros:

docker compose logs

## Pruebas

Verificar la aplicación:

curl http://localhost:3000/health

Registrar una persona:

curl -X POST http://localhost:3000/personas \
-H "Content-Type: application/json" \
-d '{"nombre":"Andrea Martinez","ciudad":"Saravena","telefono":"3001234568"}'

Consultar una persona:

curl http://localhost:3000/personas/3001234568

## Servicios

- Aplicación: http://localhost:3000
- MySQL: localhost:3307

## Integración continua

GitHub Actions construye la imagen de la aplicación y valida
la configuración de Docker Compose en cada push y pull request
dirigido a la rama main.

## Seguridad

Las credenciales se almacenan en `.env`, archivo excluido
del repositorio mediante `.gitignore`.

Se proporciona `.env.example` como plantilla de configuración.

## Autoría

Proyecto académico - Énfasis Profesional I
Integración Continua
Politécnico Grancolombiano
