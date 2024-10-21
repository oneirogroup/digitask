FROM node:22-alpine AS base

WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY apps/client/package.json apps/client/package.json
COPY libs/shared-lib/package.json libs/shared-lib/package.json
COPY modules/ui-kit/package.json modules/ui-kit/package.json
COPY modules/ws-client/package.json modules/ws-client/package.json

RUN yarn