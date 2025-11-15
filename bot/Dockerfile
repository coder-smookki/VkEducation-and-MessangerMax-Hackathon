FROM python:3.12.4-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Копируем requirements.txt
COPY requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY bot/ ./bot/
COPY database/ ./database/
COPY migrations/ ./migrations/
COPY alembic.ini ./

CMD ["python", "-m", "bot"]