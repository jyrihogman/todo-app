import os
import subprocess


cwd = os.getcwd()


def install_ui_deps():
    p = subprocess.run(["npm", "install"], cwd=f"{cwd}/src/ui", shell=True)


def start_backend():
    subprocess.Popen(["setup_backend.sh"], cwd=f"{cwd}/scripts", shell=True)


install_ui_deps()
start_backend()