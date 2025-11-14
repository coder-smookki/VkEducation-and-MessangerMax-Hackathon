FROM python:3.12.4-slim

WORKDIR /app

# Копируем requirements.txt
COPY requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY webapp/ ./webapp/
COPY database/ ./database/

EXPOSE 8000

CMD ["python", "-m", "webapp"]