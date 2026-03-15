# 构建问题排查指南

## ❌ 常见问题及解决方案

### 问题1: "EXPO_TOKEN not found" 或认证失败

**症状**: 构建日志显示 `Error: EXPO_TOKEN is not defined`

**解决方案**:
1. 确认已在GitHub仓库设置Secret:
   - 访问: https://github.com/feigao86-git/-study-plan-app/settings/secrets/actions
   - 检查是否有 `EXPO_TOKEN`
   - 如果没有，点击 **New repository secret** 添加

2. 获取正确的Expo Token:
   - 访问 https://expo.dev/settings/access-tokens
   - 创建新token（不要用过期的）
   - 复制完整的token值

### 问题2: "npm ci failed" 或依赖安装失败

**症状**: `npm ci` 命令失败，提示缺少package-lock.json

**解决方案**:
已修复！使用 `npm install` 代替 `npm ci`

### 问题3: "Project not configured" 或EAS配置错误

**症状**: `eas build:configure` 提示项目未配置

**解决方案**:
已添加自动配置步骤到工作流

### 问题4: 构建超时或长时间等待

**症状**: 构建步骤卡住超过20分钟

**解决方案**:
- EAS构建通常需要10-15分钟，请耐心等待
- 如果超过30分钟，可能是EAS服务器问题，稍后重试

### 问题5: "Build failed" 但不知道原因

**查看详细日志**:
1. 打开 https://github.com/feigao86-git/-study-plan-app/actions
2. 点击失败的构建
3. 点击每个步骤查看详细日志
4. 找到红色错误信息

---

## ✅ 修复步骤

### 方案A: 使用修复后的工作流

我已创建了修复版工作流文件 `build-apk-fixed.yml`

在Git Bash中执行：
```bash
cd /c/Users/feigao/study-plan-app
git add .
git commit -m "Fix: 更新构建工作流"
git push origin main
```

然后重新触发构建:
1. 访问 https://github.com/feigao86-git/-study-plan-app/actions
2. 点击 "Build Android APK (Fixed)"
3. 点击 "Run workflow"

### 方案B: 手动在Expo网站构建

如果GitHub Actions持续失败，可以直接在Expo网站构建：

1. **本地安装依赖并登录**:
```bash
cd /c/Users/feigao/study-plan-app
npm install -g eas-cli
eas login
# 输入你的Expo用户名密码
```

2. **配置项目**:
```bash
eas build:configure
# 选择 Android
```

3. **开始构建**:
```bash
eas build --platform android --profile preview
```

4. **等待完成**:
- 构建完成后会显示下载链接
- 或访问 https://expo.dev 查看构建状态

### 方案C: 使用Expo Go直接测试

如果只想测试功能，不需要APK：

1. **安装Expo Go App**（Google Play或应用商店）

2. **本地启动项目**:
```bash
cd /c/Users/feigao/study-plan-app
npm install
npx expo start
```

3. **手机扫描QR码**测试

---

## 🔍 如何获取构建日志

### 从GitHub Actions:
1. 访问 https://github.com/feigao86-git/-study-plan-app/actions
2. 点击失败的构建记录
3. 查看红色标记的步骤
4. 展开查看详细错误信息

### 从Expo网站:
1. 访问 https://expo.dev
2. 登录你的账户
3. 找到项目
4. 查看构建日志

---

## 🆘 如果以上都不行

### 选项1: 本地构建（需要Android Studio）
```bash
# 生成Android项目
npx expo prebuild --platform android

# 使用Android Studio打开 android 文件夹
# 点击 Build → Generate Signed Bundle/APK
```

### 选项2: 联系我获取预构建APK
告诉我具体的错误信息，我可以帮你分析问题。

---

## 📋 检查清单

- [ ] GitHub仓库已设置 `EXPO_TOKEN` secret
- [ ] Expo token没有过期
- [ ] GitHub Actions工作流文件正确
- [ ] package.json 存在且有效
- [ ] app.json 配置正确

---

## 💡 建议

如果构建持续失败，请：
1. 复制具体的错误信息发给我
2. 或者尝试 **方案B: 手动在Expo网站构建**（最稳定）
