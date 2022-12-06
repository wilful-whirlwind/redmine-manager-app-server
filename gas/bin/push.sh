#!/bin/bash

if [ -z "$1" ];  then
  echo "引数を指定してください。"
  exit
fi
npm run build && cd projects/$1 && clasp push