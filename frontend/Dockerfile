FROM node:10

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && \
  npm config set "//npm.fontawesome.com/:_authToken" 28755507-5517-4861-A6E6-3A2F7BF05870

RUN yarn

COPY . .

EXPOSE 1234

CMD ["yarn", "start"]
