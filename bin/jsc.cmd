@echo off
title cfgkey=%1 %CD%
node "%~dp0\..\index.js" m="%CD%" cfgkey=%1
