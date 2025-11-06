# Инструкция по внесению изменений 

## new branch + commit + push + pull request

---

1. Создаем ветку от dev! Пример команды: 

```bash
git checkout -b task origin/dev
```

2. Затем, если мы вносим изменения (commit), то пишем документационно название изменения (commit) на английском. Пример команды:

```bash
git commit -m "Added response delay middlewares"
```

3. После того, как мы внесли изменения, мы посылаем изменения в текущую ветку [ВЫ ДОЛЖНЫ НАХОДИТЬСЯ В НЕЙ]. Пример команды:

```bash
git push origin task
```

4. Если вы закончили выполнять задачу в ветку, то нужно послать pull request (изменение глобальные) в ветку dev [ДЕЛАЕТСЯ В ВЕБ-ИНТЕРФЕЙСЕ GITHUB]

5. Поздравляю! Вы умеете правильно заливать изменения в наш проект!

----

# Запуск бота

## docker + postgreSQL

Запуск контейнера
```bash
docker-compose up -d --build
```

Примечания: Убедитесь, что у вас нету в `ackend/migrations/versions` других версий миграций
```bash
docker-compose exec bot alembic revision --autogenerate -m "Initial migration"
```


```bash
docker-compose exec bot alembic upgrade head
```