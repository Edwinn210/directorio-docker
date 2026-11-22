pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    // Credenciales guardadas en Jenkins (nunca en el código).
                    // Se inyectan como variables de entorno dentro de este bloque.
                    withCredentials([
                        string(credentialsId: 'mysql-root-password', variable: 'MYSQL_ROOT_PASSWORD'),
                        string(credentialsId: 'mysql-app-password',   variable: 'DB_PASSWORD')
                    ]) {
                        sh '''
                            cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=directorio
MYSQL_USER=appuser
MYSQL_PASSWORD=${DB_PASSWORD}
DB_HOST=mysql
DB_USER=appuser
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=directorio
PORT=3000
EOF
                        '''
                    }
                }

                // Construye la imagen del servicio "app" (Node.js)
                sh 'docker compose build'

                // Descarga la imagen del segundo servicio "mysql" (MySQL 8.4)
                sh 'docker compose pull mysql'
            }
        }

        stage('Test') {
            steps {
                sh '''
                    # Levanta los dos contenedores y espera a que estén listos
                    docker compose up -d --wait

                    # Verifica el endpoint de salud (desde el propio contenedor app)
                    docker compose exec -T app node -e 'fetch("http://localhost:3000/health").then(r => { console.log("health:", r.status); if (r.status !== 200) process.exit(1) })'

                    # Registra una persona (prueba de escritura en MySQL)
                    docker compose exec -T app node -e 'fetch("http://localhost:3000/personas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: "Prueba CI Jenkins", ciudad: "Saravena", telefono: "3000000099" }) }).then(r => { console.log("POST:", r.status); if (r.status !== 201) process.exit(1) })'

                    # Consulta la persona registrada (prueba de lectura desde MySQL)
                    docker compose exec -T app node -e 'fetch("http://localhost:3000/personas/3000000099").then(r => { console.log("GET:", r.status); if (r.status !== 200) process.exit(1); return r.json() }).then(d => console.log(JSON.stringify(d)))'
                '''
            }
        }
    }

    post {
        always {
            // Limpieza: detiene los contenedores y elimina el .env generado
            sh 'docker compose down -v || true'
            sh 'rm -f .env'
        }
        success {
            echo 'Build exitoso: imagenes construidas y pruebas superadas.'
        }
        failure {
            echo 'El build fallo: revisar la salida de consola.'
        }
    }
}
