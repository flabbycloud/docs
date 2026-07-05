---
title: Object Storage
description: S3-совместимое объектное хранилище для файлов, резервных копий и статических сайтов.
category: Store
updated: 4 мая 2026
order: 6
---

## Создание bucket

Имя bucket должно быть уникальным. Сразу выберите уровень публичного доступа и политику хранения.

## S3 API

Используйте стандартные SDK AWS, указав endpoint FlabbyCloud и созданную пару ключей.

```bash
aws s3 ls --endpoint-url https://s3.example.cloud
```

## Жизненный цикл объектов

Правила lifecycle автоматически удаляют старые версии и незавершённые multipart-загрузки.
