@echo off
chcp 65001
cls
echo ==========================================
echo   学习计划App - 本地APK自动构建脚本
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js！
    echo 请访问 https://nodejs.org/ 下载安装LTS版本
    pause
    exit /b 1
)

echo [✓] Node.js已安装
node --version
echo.

REM Check EAS CLI
eas --version >nul 2>&1
if errorlevel 1 (
    echo [1/5] 安装EAS CLI...
    call npm install -g eas-cli --registry=https://registry.npmmirror.com
    if errorlevel 1 (
        echo [错误] EAS安装失败，尝试使用npm官方源...
        call npm install -g eas-cli
    )
) else (
    echo [1/5] EAS CLI已安装
)
eas --version
echo.

REM Check login
echo [2/5] 检查Expo登录状态...
eas whoami >nul 2>&1
if errorlevel 1 (
    echo [提示] 请先登录Expo账户
    echo 如果没有账户，访问 https://expo.dev 注册
    echo.
    call eas login
    if errorlevel 1 (
        echo [错误] 登录失败
        pause
        exit /b 1
    )
) else (
    echo [✓] 已登录Expo:
    eas whoami
)
echo.

REM Install dependencies
echo [3/5] 安装项目依赖...
cd /d "%~dp0"
call npm install --registry=https://registry.npmmirror.com
if errorlevel 1 (
    echo 尝试使用官方源...
    call npm install
)
echo.

REM Configure EAS
echo [4/5] 配置EAS项目...
call eas build:configure --platform android --non-interactive
if errorlevel 1 (
    echo [提示] 项目可能已配置，继续构建...
)
echo.

REM Build APK
echo [5/5] 开始构建APK...
echo 提示：构建大约需要10-15分钟，请耐心等待
echo 构建完成后会显示下载链接
echo.
echo ==========================================
echo           开始构建...
echo ==========================================
echo.

call eas build --platform android --profile preview --non-interactive

echo.
echo ==========================================
echo 构建完成！
echo ==========================================
echo.
echo 如果构建成功，请查看上面的下载链接
echo 或者访问 https://expo.dev 查看构建状态
echo.
pause
