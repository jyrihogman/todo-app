import os
import subprocess

cwd = os.getcwd()


def start_ui():
    subprocess.Popen(["npm", "start"], cwd=f"{cwd}/src/ui", shell=True)


def start_backend():
    os.environ["FLASK_APP"] = "api/api.py"
    os.environ["FLASK_ENV"] = "development"
    subprocess.run(["flask", "run"], cwd=f"{cwd}/src/api", shell=True)


start_ui()
start_backend()