FROM node:16-alpine
WORKDIR usr/app
COPY ./ ./
RUN yarn
CMD npm run start