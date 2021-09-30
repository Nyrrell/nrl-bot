FROM node:16-alpine AS nrl-bot
ENV NODE_ENV production
USER node
WORKDIR usr/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod && yarn cache clean
COPY ./ ./
CMD ["node", "."]