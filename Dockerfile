FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS runtime

RUN rm -f /etc/nginx/conf.d/default.conf \
    && mkdir -p /tmp/nginx/client_body /tmp/nginx/proxy /tmp/nginx/fastcgi \
    && chown -R 101:101 /usr/share/nginx/html /var/cache/nginx /var/run /tmp/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html

USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]