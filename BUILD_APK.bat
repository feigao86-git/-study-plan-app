@echo off
chcp 65001
cls
echo ==========================================
echo   学习计划App - APK构建脚本
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] 检测到Node.js版本:
node --version
echo.

REM Check if EAS CLI is installed
eas --version >nul 2>&1
if errorlevel 1 (
    echo [2/5] 安装EAS CLI...
    npm install -g eas-cli
) else (
    echo [2/5] EAS CLI已安装
)
echo.

echo [3/5] 安装项目依赖...
call npm install
if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)
echo.

echo [4/5] 检查EAS登录状态...
eas whoami >nul 2>&1
if errorlevel 1 (
    echo 请先登录Expo账户:
    echo 访问 https://expo.dev 注册账户
    call eas login
)
echo.

echo [5/5] 开始构建APK...
echo 构建过程大约需要10-15分钟，请耐心等待...
echo.
call eas build --platform android --profile preview

echo.
echo ==========================================
echo 构建完成！
echo ==========================================
echo 请访问上面的链接下载APK
echo.
pause
