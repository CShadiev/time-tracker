FROM node:18
COPY . /app

WORKDIR /app
CMD ["yarn", "build"]

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html