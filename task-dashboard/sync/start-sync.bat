@echo off
:: Task Dashboard Sync - Runs in background on Windows startup
:: Add this to startup: shell:startup

cd /d "H:\Personal Projects\BabyToad.github.io\task-dashboard"
node sync/sync.js --watch
