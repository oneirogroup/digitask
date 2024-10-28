FROM base

WORKDIR /app
COPY vite.config.js Routers.jsx index.html apps/client/
COPY src apps/client/src

WORKDIR /app/apps/client
RUN yarn build

CMD yarn preview --host