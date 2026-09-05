@echo off
title RKMIDIGILABS - Push to GitHub
color 0A
echo ========================================================
echo   RKMIDIGILABS Portfolio - 1-Click Push to GitHub
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Checking Git Status...
git status -s

echo.
set /p commit_msg="Enter commit message (or press ENTER for default update): "
if "%commit_msg%"=="" (
    set commit_msg=Update portfolio content and settings
)

echo.
echo [2/3] Staging and Committing changes...
git add .
git commit -m "%commit_msg%"

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

echo.
echo ========================================================
echo   SUCCESS! All changes pushed to GitHub!
echo   Vercel and GitHub Pages are now automatically updating.
echo ========================================================
echo.
pause
