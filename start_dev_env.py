import os
import subprocess

cwd = os.getcwd()


def start_ui():
    subprocess.Popen(["npm", "start"], cwd=f"{cwd}/src/ui", shell=True)


def start_backend():
    subprocess.run(["run_backend.sh"], cwd=f"{cwd}/scripts", shell=True)


start_ui()
start_backend()