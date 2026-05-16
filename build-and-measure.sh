#!/bin/bash
# Docker Build Measurement Script (Bash)
# Measures build time, image size, and layer count

set -e

echo "================================"
echo "Docker Build Measurement Script"
echo "================================"
echo ""

# Record start time in seconds
START_TIME=$(date +%s)
echo "[*] Starting Docker build at $(date +'%Y-%m-%d %H:%M:%S')..."
echo ""

# Build the Docker image from backend directory
docker build -t execute:v2 ./backend

# Record end time in seconds
END_TIME=$(date +%s)

# Calculate build duration
BUILD_DURATION=$((END_TIME - START_TIME))

echo ""
echo "[+] Build completed in $BUILD_DURATION seconds"
echo ""

# Get image details
echo "Retrieving image metrics..."
IMAGE_INFO=$(docker image ls execute:v2 --format "table {{.Repository}}\t{{.Size}}")
IMAGE_SIZE=$(docker image ls execute:v2 --format "{{.Size}}")
LAYER_COUNT=$(docker image inspect execute:v2 --format='{{len .RootFS.Layers}}')

echo ""
echo "================================"
echo "Build Measurement Results"
echo "================================"
echo "Build time:       ${BUILD_DURATION}s"
echo "Image size:       ${IMAGE_SIZE}"
echo "Layer count:      ${LAYER_COUNT}"
echo ""
echo "Full image info:"
docker image ls execute:v2
echo ""
