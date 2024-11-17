@echo off
set OUT_DIR=.\build
set BUILD_DIR=.\build
set SRC_DIR=.\

:: Check if OUT_DIR exists and create if it doesn't
if not exist %OUT_DIR% (
    mkdir %BUILD_DIR%
)

:: Check if the delete flag is set
if "%1"=="d" (
    echo Deleting build files except _cpm, _deps, and .gitignore
    for /F "delims=" %%i in ('dir /B /A-D %BUILD_DIR%') do (
        if not "%%i"=="_cpm" if not "%%i"=="_deps" if not "%%i"==".gitignore" (
            del "%BUILD_DIR%\%%i"
        )
    )
)

@REM "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64
cmake -S %SRC_DIR% -G Ninja -B %BUILD_DIR% -DCMAKE_MAKE_PROGRAM="C:\Program Files\Ninja_Build\ninja.exe"

ninja -C %BUILD_DIR%

cmake --build %BUILD_DIR%
