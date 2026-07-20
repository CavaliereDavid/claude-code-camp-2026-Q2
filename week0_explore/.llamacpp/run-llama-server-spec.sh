#!/usr/bin/env bash

# This file is outdated and not used. My HW is poor to run speeculative decoding with only 6 GB of VRAM.

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
  --port 8080 \
  --alias gemma-4-26B-A4B-it \
  "$@"
  # The reason why I was passing -c (the context size was that the model barely fits and did not leave headroom for a KV cache
