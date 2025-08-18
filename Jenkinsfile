pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.azurecr.io' // TODO: Replace with your registry
        AWS_DEFAULT_REGION = 'us-east-1'
        ECS_CLUSTER = 'portfolio-cluster'
        ECS_SERVICE = 'portfolio-service'
        ECS_TASK_DEFINITION = 'portfolio-task-definition'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --coverage --watchAll=false'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Docker Build') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        script {
                            docker.build("${DOCKER_REGISTRY}/portfolio-frontend:${BUILD_NUMBER}")
                            docker.build("${DOCKER_REGISTRY}/portfolio-frontend:latest")
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            script {
                                docker.build("${DOCKER_REGISTRY}/portfolio-backend:${BUILD_NUMBER}")
                                docker.build("${DOCKER_REGISTRY}/portfolio-backend:latest")
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        sh "docker push ${DOCKER_REGISTRY}/portfolio-frontend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_REGISTRY}/portfolio-frontend:latest"
                        sh "docker push ${DOCKER_REGISTRY}/portfolio-backend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_REGISTRY}/portfolio-backend:latest"
                    }
                }
            }
        }
        
        stage('Update ECS Task Definition') {
            steps {
                script {
                    // Update task definition with new image tags
                    sh """
                        aws ecs register-task-definition \
                            --family ${ECS_TASK_DEFINITION} \
                            --cli-input-json file://task-definition.json \
                            --region ${AWS_DEFAULT_REGION}
                    """
                }
            }
        }
        
        stage('Deploy to ECS') {
            steps {
                script {
                    sh """
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER} \
                            --service ${ECS_SERVICE} \
                            --task-definition ${ECS_TASK_DEFINITION} \
                            --force-new-deployment \
                            --region ${AWS_DEFAULT_REGION}
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Wait for deployment to complete
                    sh """
                        aws ecs wait services-stable \
                            --cluster ${ECS_CLUSTER} \
                            --services ${ECS_SERVICE} \
                            --region ${AWS_DEFAULT_REGION}
                    """
                    
                    // Perform health check
                    sh """
                        curl -f http://your-load-balancer-url/health || exit 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Clean up Docker images
            sh 'docker system prune -f'
            
            // Archive test results
            archiveArtifacts artifacts: '**/coverage/**/*', allowEmptyArchive: true
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'frontend/coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Frontend Coverage Report'
            ])
        }
        
        success {
            echo 'Pipeline completed successfully!'
            // Send notification to Slack/Email
        }
        
        failure {
            echo 'Pipeline failed!'
            // Send notification to Slack/Email
        }
    }
}

