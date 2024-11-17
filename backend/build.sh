#!/bin/bash

OUT_DIR="./build"
BUILD_DIR="./build"
SRC_DIR="./"

if [ ! -d $OUT_DIR ]; then
    mkdir -p $BUILD_DIR
fi

while getopts "d" opt; do
    case $opt in
        d)
            find $BUILD_DIR -mindepth 1 -maxdepth 1 ! -name '_cpm' ! -name '_deps' ! -name '.gitignore' -exec rm -rf {} +
            ;;
        *)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
    esac
done

cmake -S $SRC_DIR -B $BUILD_DIR
