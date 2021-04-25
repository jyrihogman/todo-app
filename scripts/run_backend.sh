export FLASK_APP="api/api.py"
export FLASK_ENV="development"

cd src/api
source .\\venv\\Scripts\\activate && flask run