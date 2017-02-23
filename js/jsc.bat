@echo off
title cfgkey=%1 %CD%
node "%~dp0\..\..\..\..\tools\jsc\index.js" m="%~dp0\" cfgkey=%1 all=yes
cls
echo ..............................
echo .                            .
echo .  OK, let's rock and roll!  .
echo .                            .
echo ..............................
node "%~dp0\..\..\..\..\tools\jsc\index.js" m="%~dp0\" cfgkey=%1
