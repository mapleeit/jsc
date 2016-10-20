@echo off
title cfgkey=%1 %CD%
node "%~dp0\..\index.js" m="%CD%" all=yes cfgkey=%1
