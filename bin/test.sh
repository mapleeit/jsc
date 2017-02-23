#!/usr/bin/env bash

index='/Users/zhaofengmiao/Documents/Projects/jsc/src/index.js'
CUR_PATH=$(pwd)

node "$index" m="$CUR_PATH/" all=yes
node "$index" m="$CUR_PATH/"