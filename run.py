
import subprocess
import os
from pathlib import Path

def main():
    print("Запуск приложения Coin Quest...")
    
    # Проверяем наличие собранного фронтенда
    if not os.path.exists("dist"):
        print("Фронтенд не обнаружен. Запускаем сборку...")
        try:
            subprocess.run(["python", "build.py"], check=True)
        except subprocess.CalledProcessError:
            print("Ошибка при сборке фронтенда.")
            return
    
    # Запускаем сервер
    print("Запуск FastAPI сервера...")
    subprocess.run(["python", "main.py"])

if __name__ == "__main__":
    main()
