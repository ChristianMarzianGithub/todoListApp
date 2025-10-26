# syntax=docker/dockerfile:1

# Build stage: install dependencies and create the production bundle
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Runtime stage: serve the static build with nginx
FROM nginx:1.25-alpine AS runtime

ENV PORT=8080

# Install envsubst for templating the nginx configuration
RUN apk add --no-cache gettext

# Prepare an nginx configuration template tailored for a single-page application
RUN rm /etc/nginx/conf.d/default.conf \
    && printf '%s\n' \
       'server {' \
       '    listen       ${PORT};' \
       '    listen       [::]:${PORT};' \
       '    server_name  _;' \
       '' \
       '    root   /usr/share/nginx/html;' \
       '    index  index.html;' \
       '' \
       '    location / {' \
       '        try_files $uri $uri/ /index.html;' \
       '    }' \
       '}' \
       > /etc/nginx/conf.d/default.conf.template

# Entry point writes the final nginx configuration using the runtime PORT value
RUN printf '%s\n' \
       '#!/bin/sh' \
       'envsubst '\''$PORT'\'' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf' \
       'exec nginx -g "daemon off;"' \
       > /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]
