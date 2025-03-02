#!/bin/bash

# Load .env file from the current directory
if [ -f "$PWD/.env" ]; then
  # Read and export variables, ignoring comments
  export $(grep -v '^#' "$PWD/.env" | xargs)

  # Print loaded environment variables
  printf "\033[32mLoaded environment variables:\033[0m\n"
  grep -v '^#' "$PWD/.env" | awk -F= '{print $1}' | while read -r var; do
    printf "\033[34m%s\033[0m=%s\n" "$var" "${!var}"
  done
else
  printf "\033[33mCan't find .env file. On build or test stage, this may cause issues.\033[0m\n"
fi
