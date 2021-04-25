# Welcome to Todo app!

## Requirements

- Python
- Docker
- AWS CLI (account configured)
- AWS CDK
- NPM

## Dev env

- Run "docker-compose up -d"
- Run setup_dev_env.py
- Run start_dev_env.py

Run tests on backend (/src/api) -> python -m pytest .\test\api_test.py

## Deployment

- Run cdk bootstrap
- Run cdk deploy \*

## Future development

- Metadata table
- VPC for lambda and DB, public APIGW
- UI tests
