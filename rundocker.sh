#!/bin/bash
docker run -ti --rm -e PROJECT_NAME=eyeful53 -v $(pwd)/app:/app -p 8080:8080 mhart/alpine-node:4.4 /bin/sh
