pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20' // Nombre del NodeJS configurado en Jenkins (Manage Jenkins > Tools)
    }

    environment {
        CI = 'true'
        PNPM_HOME = "${WORKSPACE}/.pnpm-store"
    }

    stages {
        stage('📦 Install pnpm') {
            steps {
                sh 'npm install -g pnpm'
                sh 'pnpm --version'
            }
        }

        stage('📥 Install Dependencies') {
            steps {
                // Le decimos a pnpm que permita explícitamente la compilación de sharp
                //sh 'echo "only-built-dependencies[]=sharp" > .npmrc'
                
                // Ahora sí, instalamos limpiamente
                sh 'pnpm install --frozen-lockfile'
            }
        }

        stage('🔍 Lint') {
            steps {
                sh 'pnpm lint'
            }
        }

        stage('🏗️ Build') {
            steps {
                sh 'pnpm build'
            }
        }

        stage('📁 Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'out/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completado exitosamente'
        }
        failure {
            echo '❌ Pipeline falló — revisa los logs de cada stage'
        }
        always {
            echo '📋 Pipeline finalizado'
            cleanWs() // Limpia el workspace después de cada ejecución
        }
    }
}
