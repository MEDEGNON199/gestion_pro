#!/bin/bash
npm install
npm run build
echo "/*    /index.html   200" > dist/_redirects
