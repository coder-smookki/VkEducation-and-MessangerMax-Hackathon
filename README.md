# VK Education & Max Messanger Hack
<p align="center">
  <img width="200" height="200" src="./content/max icon.png">
</p>
<div align="center">

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)  
![Python](https://img.shields.io/badge/python-3.12-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-CC3534?logo=python&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-017A73?logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Aiogram](https://img.shields.io/badge/Aiogram-009688?logo=telegram&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)

</div>

## Запуск
1. Склонируйте репозиторий и перейдите в него
   ```bash
   git clone https://github.com/coder-smookki/VkEducation-and-MessangerMax-Hackathon.git
   cd ./VkEducation-and-MessangerMax-Hackathon
   ```

2. Создать и заполнить файл .env в корневой папке
   ```
    BOT_TOKEN=

    DB_HOST=
    DB_PORT=
    DB_NAME=
    DB_USER=
    DB_PASSWORD=

    REDIS_HOST=
    REDIS_PORT=
    ```

## Установка зависимостей
   Установка всех библиотек перечисленный в `requirements.txt` файле
   ```
    pip install -r ./requirements.txt
   ```
   или 
   ```
   poetry install
   ```
## Docker
1. Необходимо скачать [Docker Engine](https://docs.docker.com/engine/)
2. Сделать сборку и запуск: 
   ``` 
   docker-compose up -d --build
   ```
3. После запуска начать миграцию базы данных
   ```
   docker-compose exec bot alembic revision --autogenerate

   docker-compose exec bot alembic upgrade head
   ```
### docker-compose.yml
Для работы проекта было выделино 5 контейнеров:

1. **Бот (bot)**

   Сам бот, в котором и происходит общение с Max Messanger и регистрация пользователя.

2. **Backend для WebApp**

   Был создан для взаимодействия frontend веб приложение с базой данных.

3. **Frontend для WebApp**

   Создание веб интерфейса, webapp, со всем функционалом бота.

4. **СУБД PostgreSQL (database)**

   Постгресу было отдано предпочтение вместо sqlite'а, так как с ним удобнее взаимодействовать в ручном режиме, когда идёт разработка.

## Внешние интеграции, обоснование выбора

   ### **[PostgreSQL](https://en.wikipedia.org/wiki/PostgreSQL)**
**Обоснование выбора:**  
PostgreSQL — это мощная объектно-реляционная СУБД с открытым исходным кодом. Она была выбрана благодаря следующим преимуществам:  
- **Надежность и масштабируемость:** PostgreSQL поддерживает большие объемы данных и сложные запросы, что делает ее отличным выбором для высоконагруженных систем.  
- **Расширяемость:** Поддержка пользовательских функций и типов данных.  
- **Соответствие стандартам SQL:** Полная поддержка ACID, транзакций и сложных операций с данными.  
- **Широкая экосистема:** Хорошая интеграция с различными языками и фреймворками, включая SQLAlchemy для Python.

---

### **[Redis]((https://en.wikipedia.org/wiki/Redis))**
**Обоснование выбора:**  
Redis — это высокопроизводительное хранилище данных в оперативной памяти, используемое как кэш, брокер сообщений или база данных.  
- **Быстродействие:** Redis хранит данные в оперативной памяти, что обеспечивает минимальную задержку и максимальную скорость чтения/записи.  
- **Поддержка сложных структур данных:** Помимо ключ-значения, Redis поддерживает списки, множества и хэши.  
- **Широкие сценарии использования:** Подходит для кэширования, управления сессиями и очередей задач.  
- **Простота интеграции:** Легко интегрируется с FastAPI через сторонние библиотеки, такие как `aioredis`.

---

### **[FastAPI](https://en.wikipedia.org/wiki/FastAPI)**
**Обоснование выбора:**  
FastAPI — современный, асинхронный веб-фреймворк для создания API на Python. Он был выбран по следующим причинам:  
- **Высокая производительность:** Благодаря использованию асинхронных возможностей Python и асинхронного веб-сервера Uvicorn, FastAPI обеспечивает быструю обработку запросов.  
- **Интуитивно понятный синтаксис:** Простота в использовании, поддержка аннотаций типов для автоматической генерации документации (OpenAPI/Swagger).  
- **Встроенная поддержка валидации данных:** Использование Pydantic для автоматической проверки входных данных.  
- **Сообщество:** Активное развитие и поддержка большого сообщества разработчиков.

---

### **[SQLAlchemy](https://en.wikipedia.org/wiki/SQLAlchemy)**
**Обоснование выбора:**  
SQLAlchemy — это один из наиболее популярных ORM (Object-Relational Mapping) инструментов для Python.  
- **Универсальность:** Поддержка различных СУБД, включая PostgreSQL.  
- **Гибкость:** Возможность работы как с ORM, так и с чистым SQL через Core API.  
- **Транзакционная безопасность:** Поддержка транзакций и сложных операций с базами данных.  
- **Интеграция с FastAPI:** Позволяет легко управлять сессиями и выполнять асинхронные запросы к базе данных через `asyncpg` или `databases`.

---
