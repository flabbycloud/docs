FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3007
EXPOSE 3007

USER node

CMD ["npm", "start", "--", "-p", "3007"]
