FROM mhart/alpine-node:4.4

COPY app /app
WORKDIR /app
CMD node server.js
