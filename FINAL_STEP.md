# 最后一步：触发构建并下载APK

## 🚀 触发自动构建

1. 打开 https://github.com/feigao86-git/-study-plan-app/actions

2. 你会看到两个工作流：
   - **Build Android APK**
   - **Build Android APK (Fixed)**

3. 点击 **Build Android APK (Fixed)** （修复版，更稳定）

4. 点击右侧的 **Run workflow** 下拉按钮

5. 再点击绿色的 **Run workflow** 按钮

6. 刷新页面，会看到一个黄色圆圈 ⏳ 表示正在运行

---

## ⏱️ 等待构建完成

- **大约需要 10-15 分钟**
- 期间可以看到进度：
  - Set up job ✅
  - Checkout repository ✅
  - Setup Node.js ✅
  - Setup Expo and EAS ✅
  - Install dependencies ✅
  - Build Android APK ⏳ (这是最耗时的步骤)
  - Upload APK artifact ✅

---

## 📥 下载APK

构建完成后（所有步骤变成绿色 ✅）：

1. 点击那个完成的 workflow
2. 滚动到页面最底部
3. 找到 **Artifacts** 部分
4. 点击 **study-plan-app-apk**
5. APK文件会下载到你的电脑

---

## 📱 安装APK到手机

1. 把下载的APK文件传到手机
2. 在手机上点击安装
3. 如果提示"未知来源"，去设置里允许安装

---

## ✅ 恭喜！完成！

你现在有了自己的学习计划App，包含：
- 三大任务分类（课内/课外/遗留）
- 任务评价系统
- 改期功能
- 猫粮养成系统

---

## 如果构建失败

1. 点击红色的 ❌ 查看错误
2. 截图发给我
3. 或者尝试点击 **Build Android APK**（另一个工作流）

---

快去触发构建吧！🎉
