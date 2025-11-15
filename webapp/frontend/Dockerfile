# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY webapp/frontend/package*.json ./

# Устанавливаем зависимости с помощью npm
RUN npm ci

# Копируем весь фронтенд-код
COPY webapp/frontend .

# Указываем порт, который будет использоваться
EXPOSE 5173

# Запускаем приложение в режиме разработки
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
