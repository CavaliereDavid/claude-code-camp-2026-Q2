#!/usr/bin/env bash

set -euo pipefail

exec /home/david/apps/llamacpp/llama.cpp/build/bin/llama-server \
  -hf ggml-org/gemma-4-26B-A4B-it-GGUF \
  --hf-file gemma-4-26B-A4B-it-Q4_0.gguf \
  --port 8080 \
  "$@"
  # by not passing -c the context size is set to the default one that is 4096 tokens and that is too low
