#!/bin/bash
set -e

git pull origin main
bun install
sudo systemctl restart bun-app
