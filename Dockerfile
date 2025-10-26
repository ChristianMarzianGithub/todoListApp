# syntax=docker/dockerfile:1

# Build stage: install dependencies and compile the production bundle
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Runtime stage: serve the static build with nginx on port 8080 for Cloud Run
FROM nginx:1.25-alpine AS runtime

# Cloud Run expects the service to listen on $PORT (default 8080)
# Adjust the default nginx configuration to match
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf \
    && sed -i 's/listen  \[::\]:80;/listen  \[::\]:8080;/' /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
