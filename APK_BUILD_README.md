# APK构建指南 - 三种方法

## 方法一：GitHub Actions自动构建（推荐 ⭐）

**优点**: 无需安装任何软件，完全免费，自动化构建

### 步骤：

1. **创建GitHub仓库**
   - 访问 https://github.com/new
   - 仓库名称: `study-plan-app`
   - 点击 "Create repository"

2. **上传代码到GitHub**
   ```bash
   # 在项目文件夹中打开命令行，执行：
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/study-plan-app.git
   git push -u origin main
   ```

3. **配置Expo Token**
   - 访问 https://expo.dev 注册/登录账户
   - 进入 https://expo.dev/settings/access-tokens
   - 点击 "Create token" 创建新token
   - 复制token值

4. **设置GitHub Secrets**
   - 打开GitHub仓库页面
   - 点击 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 名称: `EXPO_TOKEN`
   - 值: 粘贴刚才复制的Expo token
   - 点击 "Add secret"

5. **触发构建**
   - 在GitHub仓库页面，点击 Actions 标签
   - 点击 "Build Android APK" 工作流
   - 点击 "Run workflow" → "Run workflow"
   - 等待10-15分钟

6. **下载APK**
   - 构建完成后，在Actions页面点击最新的工作流运行
   - 滚动到页面底部，找到 "Artifacts" 部分
   - 点击 `study-plan-app-apk` 下载APK文件

---

## 方法二：Windows批处理脚本（需要Node.js）

**优点**: 本地构建，不依赖网络

### 步骤：

1. **安装Node.js**
   - 访问 https://nodejs.org/
   - 下载 LTS 版本 (推荐 18.x 或 20.x)
   - 安装时保持默认选项

2. **运行构建脚本**
   - 双击运行 `BUILD_APK.bat` 文件
   - 按提示操作，等待构建完成

---

## 方法三：手动命令行构建

**优点**: 完全控制构建过程

### 步骤：

1. **安装依赖**
   ```bash
   cd study-plan-app
   npm install
   ```

2. **安装EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **登录Expo账户**
   ```bash
   eas login
   # 按提示输入用户名密码
   # 没有账户？先去 https://expo.dev 注册
   ```

4. **配置项目**
   ```bash
   eas build:configure
   # 选择 Android
   ```

5. **构建APK**
   ```bash
   # 预览版本（APK）
   eas build --platform android --profile preview

   # 或生产版本（AAB，用于Google Play）
   eas build --platform android --profile production
   ```

6. **等待完成**
   - 构建过程大约10-15分钟
   - 完成后会显示下载链接
   - 或访问 https://expo.dev 查看构建状态

---

## 常见问题

### Q1: 构建失败怎么办？
- 检查 `app.json` 配置是否正确
- 确保所有依赖都已安装: `npm install`
- 查看错误日志，根据提示修复

### Q2: 如何更新已构建的APK？
- 修改代码后重新推送到GitHub（方法1）
- 或重新运行构建脚本/命令（方法2/3）

### Q3: APK安装后无法运行？
- 确保Android版本 >= 8.0 (API 26)
- 检查是否开启了"允许安装未知来源应用"

### Q4: 如何调试？
- 开发模式: `npm start`
- 使用 Expo Go App 扫描二维码预览

---

## 构建输出说明

构建成功后会生成:
- **APK文件**: 可直接安装到Android设备
- **下载位置**:
  - 方法1: GitHub Actions Artifacts
  - 方法2/3: Expo网站或命令行输出的链接

---

## 需要帮助？

1. 查看详细文档: `BUILD_GUIDE.md`
2. 查看项目介绍: `PROJECT_SUMMARY.md`
3. Expo文档: https://docs.expo.dev

---

**推荐选择**: 如果你没有Node.js安装经验，建议使用方法1（GitHub Actions），最简单且免费！
