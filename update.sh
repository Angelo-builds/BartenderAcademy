#!/bin/bash
echo "--- Inizio Aggiornamento ---"

# Forza Git a resettare eventuali modifiche locali (come l'index.html modificato a mano)
git fetch --all
git reset --hard origin/main  # <--- Cambia main in master se necessario

npm install
npm run build
pm2 restart bartender-app

echo "--- Sito Aggiornato con Successo! ---"
