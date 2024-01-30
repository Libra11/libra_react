## push

```bash
docker build -t blog-front .
docker tag blog-front:latest libra001/blog-front:latest
docker push libra001/blog-front:latest
```

## pull

```bash
docker stop blog-front
docker rm blog-front
docker pull libra001/blog-front:latest
docker run -d -p 80:80 --name blog-front libra001/blog-front:latest
```

## backend

```bash
# last step on server
docker compose up --build -d
```
