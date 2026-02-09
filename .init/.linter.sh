#!/bin/bash
cd /home/kavia/workspace/code-generation/shared-tic-tac-toe-318062-318076/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

