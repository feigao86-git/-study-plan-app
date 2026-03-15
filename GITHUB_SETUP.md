# GitHub Actions 配置步骤（截图对照版）

## 步骤1：获取 Expo Token

1. 打开浏览器访问：https://expo.dev
2. 点击右上角 **Sign Up** 注册（或 Sign In 登录）
   - 可以用邮箱注册，或直接用GitHub/Google账号登录

3. 登录后，访问：https://expo.dev/settings/access-tokens

4. 点击 **Create token** 按钮

5. 填写信息：
   - **Token name**: `GitHub Actions`
   - 点击 **Create**

6. **重要！立即复制token**（格式：`xxxxxxxxxxxxxxxxxxxxxxxx`）
   - ⚠️ 这个token只显示一次！
   - 复制后保存到记事本备用

---

## 步骤2：在GitHub设置 Secret

1. 打开：https://github.com/feigao86-git/-study-plan-app/settings/secrets/actions

2. 点击绿色按钮 **New repository secret**

3. 填写：
   - **Name**: `EXPO_TOKEN`
   - **Value**: 粘贴刚才复制的Expo token

4. 点击 **Add secret**

✅ 成功后会显示 `EXPO_TOKEN` 在列表中

---

## 步骤3：触发自动构建

1. 打开：https://github.com/feigao86-git/-study-plan-app/actions

2. 点击 **Build Android APK**（或 Build Android APK (Fixed)）

3. 点击右侧的 **Run workflow** 下拉按钮

4. 再点击绿色的 **Run workflow** 按钮

5. 刷新页面，会看到一个新的 workflow 正在运行（黄色圆圈）

---

## 步骤4：等待并下载 APK

1. 等待 10-15 分钟
2. 点击正在运行的 workflow
3. 等待所有步骤变成 ✅ 绿色
4. 滚动到页面底部，找到 **Artifacts** 部分
5. 点击 **study-plan-app-apk** 下载 APK 文件

---

## 常见问题

### Q: 找不到 Secrets 页面？
确保URL正确：
```
https://github.com/feigao86-git/-study-plan-app/settings/secrets/actions
```

### Q: Expo token 复制丢了怎么办？
回到 https://expo.dev/settings/access-tokens
- 删除旧的token
- 创建一个新的
- 重新添加到GitHub Secrets

### Q: 构建失败了？
1. 点击失败的 workflow
2. 查看红色 ❌ 的步骤
3. 展开查看错误信息
4. 截图发给我

---

## 检查清单

- [ ] Expo账户已注册
- [ ] Access token 已创建并复制
- [ ] GitHub Secret `EXPO_TOKEN` 已添加
- [ ] Workflow 已触发运行
- [ ] APK 已下载

---

完成后告诉我，或如果遇到问题截图给我！
