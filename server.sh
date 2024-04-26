#!/bin/bash
docker stop blog-front
docker rm blog-front
docker pull libra001/blog-front:latest
docker run -d -p 80:80 --name blog-front libra001/blog-front:latest
