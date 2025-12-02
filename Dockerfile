# === Etapa 1: Build do Angular ===
FROM node:18-alpine AS build
WORKDIR /app

# Copia dependências
COPY package*.json ./

# Instala dependências (modo tolerante)
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera o build no caminho correto (dist/competicoes-ui)
#RUN npm run build -- --output-path=dist/competicoes-ui
#RUN npm run build -- --configuration production --output-path=dist/competicoes-ui
RUN npm run build -- --configuration=production

# === Etapa 2: Servir via Nginx ===
FROM nginx:1.25-alpine

# Copia o build gerado para a pasta padrão do Nginx
COPY --from=build /app/dist/competicoes-ui /usr/share/nginx/html

# 👉 Copia a configuração customizada do Nginx (fundamental!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
