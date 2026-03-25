FROM dhi.io/node:24-alpine3.22-dev AS builder

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY . .

FROM dhi.io/node:24-alpine3.22

WORKDIR /app

COPY --from=builder --chown=node:node /app /app

USER node

EXPOSE 5000

CMD ["node", "server.js"]