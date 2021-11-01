FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm build
RUN npm prune --production

FROM node:16 as production-stage
WORKDIR /app
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/src/.env ./dist/.env
USER node
EXPOSE 3000
CMD ["node", "./dist/index.js"]