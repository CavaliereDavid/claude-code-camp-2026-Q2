#!/usr/bin/env bash

set -euo pipefail

exec /home/david/apps/llamacpp/llama.cpp/build/bin/llama-server \
  -hf ggml-org/gemma-4-26B-A4B-it-GGUF \
  --hf-file gemma-4-26B-A4B-it-Q4_0.gguf \
  --port 8080 \
  "$@"
