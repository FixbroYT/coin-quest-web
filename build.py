
import os
import shutil
import subprocess
from pathlib import Path

def build_frontend():
    print("Установка npm зависимостей...")
    subprocess.run(["npm", "install"], check=True)
    
    print("Сборка фронтенда...")
    subprocess.run(["npm", "run", "build"], check=True)
    
    # Проверяем, что папка dist существует
    if os.path.exists("dist"):
        print("Сборка фронтенда успешно завершена!")
    else:
        print("Ошибка: папка dist не была создана.")
        return False
    
    return True

if __name__ == "__main__":
    if build_frontend():
        print("Фронтенд успешно собран. Теперь запустите сервер с помощью 'python main.py'")
