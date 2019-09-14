FROM node:alpine AS builder

WORKDIR /app

COPY ./package.json .
RUN npm install --production
COPY ./public ./public
COPY ./src ./src
RUN npm run build


FROM nginx
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
