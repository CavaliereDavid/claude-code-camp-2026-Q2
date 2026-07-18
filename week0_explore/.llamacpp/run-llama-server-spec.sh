#!/usr/bin/env bash

set -euo pipefail

DFLASH_GGUF="/home/david/.cache/huggingface/hub/models--ggml-org--gemma-4-26B-A4B-it-GGUF/snapshots/3d3dca2094ff8112005fd10fc7a8e30cf4f45b56/dflash-gemma-4-26B-A4B-it-Q8_0.gguf"

exec /home/david/apps/llamacpp/llama.cpp/build/bin/llama-server \
  -hf ggml-org/gemma-4-26B-A4B-it-GGUF \
  --hf-file gemma-4-26B-A4B-it-Q4_0.gguf \
  -md "$DFLASH_GGUF" \
  --spec-type draft-dflash \
  --spec-draft-n-max 15 \
  -fa on \
  --gpu-layers-draft 0 \
  --no-mmproj \
  -c 2048 \
  --port 8080 \
  --alias gemma-4-26B-A4B-it \
  "$@"
