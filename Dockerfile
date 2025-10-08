# ==========================
# Estágio de build (Angular)
# ==========================
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build -- --configuration=production

# ==========================
# Estágio final (Nginx)
# ==========================
FROM nginx:stable-alpine
COPY --from=build /app/dist/competicoes-ui /usr/share/nginx/html

# Copia configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
