pipeline {
    agent any

    tools {
        dockerTool "Dockertool"
    }

    stages {

        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build -t hola-mundo-node:latest .'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            steps {
                sh '''
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    docker run -d --name hola-mundo-node -p 3001:3000 hola-mundo-node:latest
                '''
            }
        }
    }
}
