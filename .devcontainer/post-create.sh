#!/usr/bin/env bash
set -e

PNPM_HOME="/home/node/.local/share/pnpm"

sudo mkdir -p "$PNPM_HOME"
sudo chown -R node:node "$PNPM_HOME" "${PWD}/node_modules"

sudo corepack enable
corepack install

pnpm config set store-dir "$PNPM_HOME/store"
pnpm install --frozen-lockfile

pnpm --version
node --version
