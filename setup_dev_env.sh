echo "Setting up dev-env"
(cd src/ui/;npm install;)
(cd src/api/;python -m venv venv;.\venv\Scripts\activate;pip install -r requirements.txt)
