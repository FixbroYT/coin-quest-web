
# Coin Quest

Игра-кликер для Telegram с FastAPI бэкендом.

## Установка и запуск

1. Установите зависимости:
```
pip install -r requirements.txt
```

2. Соберите фронтенд:
```
python build.py
```

3. Запустите сервер:
```
python main.py
```

Или используйте единую команду для запуска:
```
python run.py
```

4. Откройте браузер и перейдите по адресу: http://localhost:8000

## Структура приложения

- `main.py` - FastAPI сервер
- `src/` - Исходный код фронтенда (React)
- `dist/` - Собранный фронтенд (после выполнения build.py)
- `build.py` - Скрипт для сборки фронтенда
- `run.py` - Скрипт для запуска всего приложения

## API эндпоинты

- `GET /api` - Приветственное сообщение API
- `GET /api/users/{tg_id}` - Получить данные пользователя
- `POST /api/users/create` - Создать нового пользователя
- `GET /api/upgrades` - Получить список доступных улучшений
- `GET /api/locations` - Получить список локаций
- `POST /api/users/{tg_id}/buy_upgrade/{upgrade_id}` - Купить улучшение
- `POST /api/users/{tg_id}/buy_location/{location_id}` - Разблокировать локацию
- `POST /api/users/{tg_id}/set_location/{location_id}` - Установить текущую локацию
- `POST /api/users/{tg_id}/balance/add` - Добавить монеты пользователю
