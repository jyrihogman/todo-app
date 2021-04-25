# echo "Setting up dev-env"
# echo "Installing deployment dependencies..."
# npm install

# echo "Installing UI dependencies..."
# (cd src/ui/;npm install;)

echo "Installing Backend dependencies..."
cd src/api/
python -m venv venv
source .\\venv\\Scripts\\activate && pip install -r requirements.txt
py setup_db.py
