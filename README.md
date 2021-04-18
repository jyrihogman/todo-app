# Welcome to Todo app!

## Requirements

- Python
- Docker
- AWS CLI (account configured)
- AWS CDK
- NPM

## Setting up dev env

- Run setup_dev_env.sh
- Set FLASK_ENV to "development" (PowerShell $env:FLASK_ENV="development")
- Set FLASK_APP to "api.py"
- flask run in src/api
- npm start in src/ui

Run tests on backend (/src/api) -> python -m pytest .\test\api_test.py

## Future development

- Metadata table
- Dynamically get cloudfront distribution url to api stack
- UI tests
