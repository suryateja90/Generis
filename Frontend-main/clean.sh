#!/bin/bash
rm -fr dist node_modules package-lock.json .angular
ng cache clean
npm cache clean --force
npm install
