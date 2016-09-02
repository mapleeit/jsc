#!/bin/bash

CUR_DIR=$(cd $(dirname $0); pwd) 
CUR_PATH=$(pwd) 

echo $CUR_DIR
echo $CUR_PATH

node "../index.js" m="$CUR_PATH/"

