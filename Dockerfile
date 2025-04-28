# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:alpine AS build

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

ARG VITE_API_URL=${VITE_API_URL}

RUN npm run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]