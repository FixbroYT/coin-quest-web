from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
import uuid
import os
from pathlib import Path

app = FastAPI()

# Включаем CORS для взаимодействия с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене следует указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Путь к статическим файлам (фронтенд)
static_dir = Path(__file__).parent / "dist"
if not static_dir.exists():
    os.makedirs(static_dir, exist_ok=True)

# Монтируем статические файлы
app.mount("/assets", StaticFiles(directory=f"{static_dir}/assets"), name="assets")
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

# Модели данных
class Player(BaseModel):
    id: int
    tg_id: int
    name: str
    coins: int
    total_earned: int
    click_power: int
    current_location: int

class Upgrade(BaseModel):
    id: int
    name: str
    description: str
    base_cost: int
    current_level: int
    coin_multiplier: float
    icon: str

class Location(BaseModel):
    id: int
    name: str
    description: str
    unlock_cost: int
    coin_multiplier: float
    background: str
    is_unlocked: bool

class BalanceUpdate(BaseModel):
    coins: int

# Хранение данных (в реальном приложении следует использовать базу данных)
players = {}
upgrades = [
    {
        "id": 1,
        "name": "Клик-усиление",
        "description": "Увеличивает количество монет за клик",
        "base_cost": 10,
        "current_level": 0,
        "coin_multiplier": 1.2,
        "icon": "mouse-pointer-click"
    },
    {
        "id": 2,
        "name": "Бустер мощности",
        "description": "Увеличивает эффективность всех кликов",
        "base_cost": 50,
        "current_level": 0,
        "coin_multiplier": 1.5,
        "icon": "zap"
    }
]
locations = [
    {
        "id": 1,
        "name": "Начальная локация",
        "description": "Стартовая точка вашего приключения",
        "unlock_cost": 0,
        "coin_multiplier": 1.0,
        "background": "bg-gradient-to-br from-blue-100 to-blue-200",
        "is_unlocked": True
    },
    {
        "id": 2,
        "name": "Лесная поляна",
        "description": "Загадочное место с повышенным доходом",
        "unlock_cost": 100,
        "coin_multiplier": 1.5,
        "background": "bg-gradient-to-br from-green-100 to-green-300",
        "is_unlocked": False
    },
    {
        "id": 3,
        "name": "Горная местность",
        "description": "Богатые залежи монет в горах",
        "unlock_cost": 500,
        "coin_multiplier": 2.0,
        "background": "bg-gradient-to-br from-stone-200 to-stone-400",
        "is_unlocked": False
    }
]

# API эндпоинты

@app.get("/api")
def read_root():
    return {"message": "Добро пожаловать в API игры!"}

@app.get("/api/users/{tg_id}", response_model=Player)
def get_user_data(tg_id: int):
    if tg_id in players:
        return players[tg_id]
    raise HTTPException(status_code=404, detail="Пользователь не найден")

@app.post("/api/users/create")
def create_user(tg_id: int):
    if tg_id in players:
        return {"success": False, "message": "Пользователь уже существует"}
    
    new_player = {
        "id": len(players) + 1,
        "tg_id": tg_id,
        "name": f"Игрок_{tg_id}",
        "coins": 0,
        "total_earned": 0,
        "click_power": 1,
        "current_location": 1
    }
    players[tg_id] = new_player
    return {"success": True, "message": "Пользователь создан"}

@app.get("/api/upgrades")
def get_upgrades():
    # Для каждого пользователя должны быть свои уровни апгрейдов
    # Здесь упрощенная версия
    return upgrades

@app.get("/api/locations")
def get_locations():
    # Для каждого пользователя должны быть свои доступные локации
    # Здесь упрощенная версия
    return locations

@app.post("/api/users/{tg_id}/buy_upgrade/{upgrade_id}")
def buy_user_upgrade(tg_id: int, upgrade_id: int):
    if tg_id not in players:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    player = players[tg_id]
    upgrade = next((up for up in upgrades if up["id"] == upgrade_id), None)
    
    if not upgrade:
        raise HTTPException(status_code=404, detail="Апгрейд не найден")
    
    # Расчет стоимости апгрейда с учетом уровня
    cost = upgrade["base_cost"] * (1.5 ** upgrade["current_level"])
    
    if player["coins"] < cost:
        return {"success": False, "message": "Недостаточно монет"}
    
    # Обновляем данные пользователя
    player["coins"] -= cost
    
    # Обновляем уровень апгрейда и эффект
    upgrade["current_level"] += 1
    if upgrade_id == 1:  # Если это апгрейд клик-усиления
        player["click_power"] += 1
    
    return {"success": True, "new_balance": player["coins"]}

@app.post("/api/users/{tg_id}/buy_location/{location_id}")
def buy_user_location(tg_id: int, location_id: int):
    if tg_id not in players:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    player = players[tg_id]
    location = next((loc for loc in locations if loc["id"] == location_id), None)
    
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    
    if location["is_unlocked"]:
        return {"success": True, "message": "Локация уже разблокирована"}
    
    if player["coins"] < location["unlock_cost"]:
        return {"success": False, "message": "Недостаточно монет"}
    
    # Обновляем данные пользователя
    player["coins"] -= location["unlock_cost"]
    location["is_unlocked"] = True
    
    return {"success": True, "message": "Локация разблокирована"}

@app.post("/api/users/{tg_id}/set_location/{location_id}")
def set_user_location(tg_id: int, location_id: int):
    if tg_id not in players:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    location = next((loc for loc in locations if loc["id"] == location_id), None)
    
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    
    if not location["is_unlocked"]:
        return {"success": False, "message": "Локация заблокирована"}
    
    # Обновляем текущую локацию пользователя
    players[tg_id]["current_location"] = location_id
    
    return {"success": True, "message": "Текущая локация обновлена"}

@app.post("/api/users/{tg_id}/balance/add")
def add_user_balance(tg_id: int, balance_update: BalanceUpdate):
    if tg_id not in players:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    player = players[tg_id]
    coins_to_add = balance_update.coins
    
    # Применяем множитель локации
    current_location_id = player["current_location"]
    location = next((loc for loc in locations if loc["id"] == current_location_id), None)
    if location:
        coins_to_add = int(coins_to_add * location["coin_multiplier"])
    
    # Обновляем баланс пользователя
    player["coins"] += coins_to_add
    player["total_earned"] += coins_to_add
    
    return {"success": True, "new_balance": player["coins"]}

if __name__ == "__main__":
    # Запуск сервера
    uvicorn.run(app, host="0.0.0.0", port=8000)
