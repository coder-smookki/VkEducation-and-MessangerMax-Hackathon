FROM python:3.11.4-slim 
 
RUN apt-get update && \ 
  apt-get install -y gcc libpq-dev && \ 
  apt clean && \ 
  rm -rf /var/cache/apt/* 
 
ENV PYTHONDONTWRITEBYTECODE=1 \ 
  PYTHONUNBUFFERED=1 \ 
  PYTHONIOENCODING=utf-8 

COPY ./backend/requirements.txt /tmp/requirements.txt 

RUN pip install -U pip && \ 
  pip install -r /tmp/requirements.txt 

# Копируем весь backend в src
COPY ./backend /src

WORKDIR /src

# Запускаем app модуль вместо bot
CMD ["python", "-m", "app"]