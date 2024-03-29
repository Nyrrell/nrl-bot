FROM node:16-alpine
ENV NODE_ENV production
ENV TZ="Europe/Paris"
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod && yarn cache clean
COPY ./ ./
CMD npm run start