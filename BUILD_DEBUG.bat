@echo off
chcp 65001
cls
echo ==========================================
echo   学习计划App - APK构建脚本（调试版）
echo ==========================================
echo.
echo 如果窗口自动关闭，请截图这个窗口的内容发给我
echo.

REM Check if Node.js is installed
echo [检查] Node.js...
node --version
if errorlevel 1 (
    echo [错误] 未检测到Node.js！
    echo 请访问 https://nodejs.org/ 下载安装LTS版本
    echo 安装完成后重新运行此脚本
    pause
    exit /b 1
)
echo [✓] Node.js已安装
echo.

REM Check if EAS CLI is installed
echo [检查] EAS CLI...
eas --version
if errorlevel 1 (
    echo [安装] 正在安装EAS CLI...
    call npm install -g eas-cli --registry=https://registry.npmmirror.com
    if errorlevel 1 (
        echo 尝试使用官方源...
        call npm install -g eas-cli
    )
)
eas --version
echo.

REM Check project directory
echo [检查] 项目目录...
cd /d "%~dp0"
echo 当前目录: %cd%
if not exist "package.json" (
    echo [错误] 未找到package.json，请确保在正确目录运行
    pause
    exit /b 1
)
echo [✓] 项目目录正确
echo.

REM Install dependencies
echo [步骤1/4] 安装项目依赖...
call npm install --registry=https://registry.npmmirror.com
if errorlevel 1 (
    echo [警告] 国内源失败，尝试官方源...
    call npm install
)
echo.

REM Check EAS login
echo [步骤2/4] 检查Expo登录状态...
eas whoami
if errorlevel 1 (
    echo [提示] 需要登录Expo账户
    echo 如果没有账户，请先访问 https://expo.dev 注册
    echo.
    call eas login
    if errorlevel 1 (
        echo [错误] 登录失败
        pause
        exit /b 1
    )
)
echo [✓] 已登录Expo
eas whoami
echo.

REM Configure EAS
echo [步骤3/4] 配置EAS项目...
call eas build:configure --platform android --non-interactive
if errorlevel 1 (
    echo [提示] 项目可能已配置，继续...
)
echo.

REM Build APK
echo [步骤4/4] 开始构建APK...
echo ==========================================
echo  构建开始！大约需要10-15分钟
echo ==========================================
echo.

call eas build --platform android --profile preview --non-interactive

set BUILD_RESULT=%errorlevel%

echo.
echo ==========================================
if %BUILD_RESULT% == 0 (
    echo  [✓] 构建命令执行成功！
    echo.
    echo 请查看上面的下载链接
    echo 或访问 https://expo.dev 查看构建状态
) else (
    echo  [✗] 构建命令执行失败，错误码: %BUILD_RESULT%
    echo.
    echo 可能的原因：
    echo 1. 网络问题
    echo 2. Expo账户问题
    echo 3. 项目配置问题
    echo.
    echo 请截图错误信息发给我
)
echo ==========================================
echo.
pause
