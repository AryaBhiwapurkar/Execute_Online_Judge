# Docker Build Measurement Script (PowerShell)
# Measures build time, image size, and layer count

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Docker Build Measurement Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check build context size
Write-Host "Checking build context size..." -ForegroundColor Yellow
Get-ChildItem -Recurse | 
  Where-Object { !$_.PSIsContainer } | 
  Measure-Object -Property Length -Sum | 
  Select-Object @{N='Size(MB)';E={[math]::Round($_.Sum/1MB,2)}}
Write-Host ""

# Record start time
$startTime = Get-Date
Write-Host "[*] Starting Docker build at $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))..." -ForegroundColor Yellow
Write-Host ""

# Build the Docker image from backend directory
docker build -t execute:v2 ./backend

# Record end time
$endTime = Get-Date

# Calculate build duration in seconds
$buildDuration = [Math]::Round(($endTime - $startTime).TotalSeconds, 2)

Write-Host ""
Write-Host "[+] Build completed in ${buildDuration}s" -ForegroundColor Green
Write-Host ""

# Get image details
Write-Host "Retrieving image metrics..." -ForegroundColor Yellow

# Get image size
$imageSizeRaw = docker image ls execute:v2 --format "{{.Size}}"
$imageSize = if ($imageSizeRaw) { $imageSizeRaw } else { "Unknown" }

# Get layer count
$layerCount = docker image inspect execute:v2 --format='{{len .RootFS.Layers}}'

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Build Measurement Results" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Build time:       ${buildDuration}s" -ForegroundColor Green
Write-Host "Image size:       ${imageSize}" -ForegroundColor Green
Write-Host "Layer count:      ${layerCount}" -ForegroundColor Green
Write-Host ""
Write-Host "Full image info:" -ForegroundColor Yellow
docker image ls execute:v2
Write-Host ""
