@echo off
docker build -t blog-front .
docker tag blog-front:latest libra001/blog-front:latest
docker push libra001/blog-front:latest
exit