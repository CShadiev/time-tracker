FROM node:18
COPY . /app

WORKDIR /app
RUN yarn install
RUN yarn build

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html