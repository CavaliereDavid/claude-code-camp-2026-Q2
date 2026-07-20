#!/usr/bin/env bash

set -euo pipefail

exec /home/david/apps/llamacpp/llama.cpp/build/bin/llama-server \
  -hf unsloth/Qwen3.5-2B-GGUF \
  --hf-file Qwen3.5-2B-UD-Q4_K_XL.gguf \
  --ctx-size 262144 \
  --gpu-layers 999 \
  --port 8080 \
  "$@"

# I have set explicitly the full context length because llama.cpp would failsafe when I exceeded.