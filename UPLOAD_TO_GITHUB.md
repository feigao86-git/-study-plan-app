# 上传代码到GitHub步骤

## 第一步：在GitHub上创建仓库

1. 打开浏览器访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `study-plan-app`
   - **Description**: 初中生学习计划App（可选）
   - **Visibility**: 选择 Public（免费）或 Private（私人）
   - ✅ 勾选 "Add a README file"
3. 点击 **Create repository**

## 第二步：打开Git Bash

在文件夹 `C:\Users\feigao\study-plan-app` 中右键点击，选择 **Git Bash Here**

## 第三步：执行以下命令

复制粘贴以下命令到Git Bash中执行：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交文件
git commit -m "Initial commit: 完整的学习计划App"

# 添加远程仓库（将下面的URL替换为你自己的仓库URL）
# 注意：USERNAME换成你的GitHub用户名
git remote add origin https://github.com/USERNAME/study-plan-app.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

## 第四步：输入GitHub凭证

执行 `git push` 后会提示输入：
- **Username**: 你的GitHub用户名
- **Password**: 你的GitHub Personal Access Token（不是登录密码！）

### 如何获取Personal Access Token:

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 输入Note: `Study Plan App`
4. 选择有效期（Expiration）
5. 勾选权限：
   - ✅ `repo` （完整仓库访问）
6. 点击 **Generate token**
7. **立即复制token**（只显示一次！）

## 替代方法：使用GitHub Desktop（图形界面）

如果不习惯命令行，可以使用GitHub Desktop：

1. 下载安装 https://desktop.github.com/
2. 登录你的GitHub账户
3. 点击 **File** → **Add local repository**
4. 选择文件夹 `C:\Users\feigao\study-plan-app`
5. 点击 **Publish repository**

## 验证上传成功

上传完成后，访问：
```
https://github.com/你的用户名/study-plan-app
```

应该能看到所有文件：
- App.js
- src/ 文件夹
- .github/workflows/build-apk.yml
- 等等...

## 下一步：触发APK构建

代码上传后，按照 `APK_BUILD_README.md` 中的步骤配置Expo Token并触发自动构建。

---

## 遇到问题？

### 错误1: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/study-plan-app.git
```

### 错误2: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 错误3: 认证失败
- 确保使用的是Personal Access Token，不是GitHub登录密码
- 检查token是否有过期
- 检查token是否有repo权限

---

## 快速检查清单

- [ ] GitHub仓库已创建
- [ ] Git Bash在项目文件夹中打开
- [ ] 执行了 git init
- [ ] 执行了 git add .
- [ ] 执行了 git commit
- [ ] 设置了正确的远程仓库URL
- [ ] 成功推送到GitHub
- [ ] 在GitHub网页上能看到代码

完成后告诉我，我会帮你下一步配置自动构建！
