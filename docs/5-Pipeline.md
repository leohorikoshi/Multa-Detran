# Pipeline DevOps

## 1. Visão Geral

### 1.1 Objetivos
- Automatizar build e deploy
- Garantir qualidade do código
- Manter segurança
- Facilitar rollbacks

### 1.2 Tecnologias
- GitHub Actions
- AWS CodePipeline
- Docker
- Terraform

## 2. Estrutura do Pipeline

### 2.1 Desenvolvimento
\`\`\`mermaid
graph LR
  A[Commit] --> B[Lint]
  B --> C[Build]
  C --> D[Test]
  D --> E[Deploy Dev]
\`\`\`

### 2.2 Staging
\`\`\`mermaid
graph LR
  A[PR] --> B[Review]
  B --> C[Build]
  C --> D[Test]
  D --> E[Security Scan]
  E --> F[Deploy Staging]
\`\`\`

### 2.3 Produção
\`\`\`mermaid
graph LR
  A[Release] --> B[Build]
  B --> C[Test]
  C --> D[Security]
  D --> E[Deploy Prod]
\`\`\`

## 3. Workflows

### 3.1 CI Workflow
\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security scan
        uses: snyk/actions/node@master
\`\`\`

### 3.2 CD Workflow
\`\`\`yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v1
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
\`\`\`

## 4. Ambientes

### 4.1 Desenvolvimento
\`\`\`terraform
# dev/main.tf
resource "aws_instance" "dev" {
  ami           = "ami-123456"
  instance_type = "t3.micro"
  
  tags = {
    Name = "dev-server"
    Environment = "development"
  }
}
\`\`\`

### 4.2 Staging
\`\`\`terraform
# staging/main.tf
resource "aws_instance" "staging" {
  ami           = "ami-123456"
  instance_type = "t3.small"
  
  tags = {
    Name = "staging-server"
    Environment = "staging"
  }
}
\`\`\`

### 4.3 Produção
\`\`\`terraform
# prod/main.tf
resource "aws_instance" "prod" {
  ami           = "ami-123456"
  instance_type = "t3.medium"
  
  tags = {
    Name = "prod-server"
    Environment = "production"
  }
}
\`\`\`

## 5. Docker

### 5.1 Desenvolvimento
\`\`\`dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]
\`\`\`

### 5.2 Produção
\`\`\`dockerfile
# Dockerfile.prod
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]
\`\`\`

## 6. Monitoramento

### 6.1 Métricas
- New Relic
- CloudWatch
- Grafana

### 6.2 Logs
- ELK Stack
- CloudWatch Logs
- Papertrail

### 6.3 Alertas
\`\`\`yaml
# alertmanager.yml
routes:
  - match:
      severity: critical
    receiver: 'slack-critical'
  - match:
      severity: warning
    receiver: 'slack-warnings'
\`\`\`

## 7. Security

### 7.1 Scans
- SonarQube
- Snyk
- OWASP ZAP

### 7.2 Secrets
- AWS Secrets Manager
- HashiCorp Vault
- GitHub Secrets

## 8. Backups

### 8.1 Banco de Dados
\`\`\`bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d)
mongodump --uri="$MONGODB_URI" --out="/backups/$DATE"
aws s3 cp /backups/$DATE s3://my-backup-bucket/
\`\`\`

### 8.2 Storage
\`\`\`terraform
resource "aws_s3_bucket" "backup" {
  bucket = "my-backup-bucket"
  versioning {
    enabled = true
  }
}
\`\`\`

## 9. Disaster Recovery

### 9.1 RTO/RPO
- RTO: 1 hora
- RPO: 24 horas

### 9.2 Procedimentos
1. Restore do último backup
2. Verify data integrity
3. Update DNS
4. Test critical paths

## 10. Atualizações

### v1.0.0 (08/11/2025)
- Setup inicial do pipeline
- Configuração dos ambientes
- Implementação do CI/CD