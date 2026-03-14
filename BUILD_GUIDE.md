# 学习计划App - Android APK构建指南

## 项目概述
这是一款专为初中生设计的学习计划管理App，包含以下核心功能：

### ✅ 已实现功能
1. **任务三大分类**
   - 课内学习（语文、数学、英语等9大学科）
   - 课外学习（阅读、兴趣、运动等）
   - 遗留任务（从昨日滚动过来的任务）

2. **任务完成评价系统**
   - 学习态度（认真/不认真）+2分
   - 书写规范（规范/潦草）+2分
   - 草稿情况（认真/无草稿）+2分
   - 做题痕迹（有标注/无标注）+2分
   - 基础10分 + 评价标签×2分 = 最高18分

3. **改期功能**
   - 选择改期原因（需要思考/需要练习/其他）
   - 日期时间选择器
   - 拍照记录（支持相机调用）
   - 语音录入（支持语音识别）

4. **猫粮养成系统**
   - 10积分 = 1碗猫粮
   - 完成任务获得积分兑换猫粮
   - 投喂小猫增加经验值
   - 购买猫粮商店

5. **提醒系统**
   - 本地推送通知
   - 自定义提醒时间
   - 未完成任务循环提醒

6. **统计视图**
   - 日历热力图
   - 学科分析
   - 连续打卡记录
   - 积分历史

---

## 构建环境要求

### 必需软件
- Node.js 18+
- npm 或 yarn
- Git

### 安装 Expo CLI
```bash
npm install -g expo-cli
```

### 安装 EAS CLI（用于构建APK）
```bash
npm install -g eas-cli
```

---

## 项目设置步骤

### 1. 安装依赖
```bash
cd study-plan-app
npm install
```

### 2. 配置 app.json
已配置好的关键设置：
- Android包名: `com.yourcompany.studyplan`
- 权限: 通知、相机、麦克风
- 图标和启动屏已配置

### 3. 登录 Expo 账户
```bash
eas login
```
如果没有账户，先去 https://expo.dev 注册

---

## 构建 APK

### 方法一：使用 EAS Build（推荐）

#### 1. 配置 EAS
```bash
eas build:configure
```
选择 Android

#### 2. 构建 APK
```bash
# 预览版本（APK）
eas build --platform android --profile preview

# 生产版本（APK）
eas build --platform android --profile production
```

#### 3. 下载 APK
构建完成后，EAS会提供一个下载链接。通常在10-15分钟内完成。

### 方法二：本地构建（需要Android SDK）

#### 1. 安装 Android Studio
- 下载并安装 Android Studio
- 安装 Android SDK
- 配置 ANDROID_HOME 环境变量

#### 2. 本地构建
```bash
expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK将生成在 `android/app/build/outputs/apk/release/app-release.apk`

---

## 项目文件结构

```
study-plan-app/
├── App.js                 # 应用入口
├── app.json               # Expo配置
├── eas.json               # EAS构建配置
├── package.json           # 依赖列表
├── assets/                # 图片资源
└── src/
    ├── components/        # 组件
    │   ├── PetDisplay.js      # 宠物展示
    │   ├── ProgressRing.js    # 进度环
    │   ├── TaskItem.js        # 任务项
    │   ├── EvaluationModal.js # 评价弹窗
    │   └── PostponeModal.js   # 改期弹窗
    ├── screens/           # 页面
    │   ├── HomeScreen.js      # 首页
    │   ├── TaskScreen.js      # 任务页
    │   ├── PetScreen.js       # 宠物页
    │   ├── StatsScreen.js     # 统计页
    │   ├── ProfileScreen.js   # 个人中心
    │   ├── AddTaskScreen.js   # 添加任务
    │   └── IncompleteRecordScreen.js
    ├── services/          # 服务
    │   ├── database.js        # SQLite数据库
    │   └── notifications.js   # 通知服务
    ├── constants/         # 常量
    │   └── theme.js
    └── utils/             # 工具函数
        ├── dateUtils.js
        └── speechUtils.js
```

---

## 关键依赖

```json
{
  "expo": "~50.0.0",
  "expo-sqlite": "~13.2.0",        // 本地数据库
  "expo-notifications": "~0.27.0",  // 推送通知
  "expo-camera": "~14.0.0",        // 相机
  "expo-av": "~13.10.0",           // 音频/语音
  "expo-speech": "~11.7.0",        // 语音合成
  "react-navigation": "^6.x",      // 导航
  "uuid": "^9.0.1",                // UUID生成
  "date-fns": "^3.0.6"             // 日期处理
}
```

---

## 数据库结构

### 表: tasks
- id, title, category, subject, planned_date
- status (pending/completed/incomplete/abandoned)
- reminder_time, evaluation (JSON)
- rolled_from, incomplete_reason
- incomplete_photos, voice_note

### 表: user_settings
- total_points, cat_food, streak_days
- pet_level, pet_experience
- default_reminder_time

### 表: points_history
- 积分变更记录

---

## 测试运行

### 开发模式
```bash
npm start
# 或
expo start
```

### 在Android设备上测试
1. 安装 Expo Go App（Google Play）
2. 扫描终端中的二维码

---

## 常见问题

### Q1: EAS构建失败？
- 检查 `app.json` 配置是否正确
- 确保已登录: `eas login`
- 检查依赖版本兼容性

### Q2: 本地数据库不工作？
- SQLite在Expo Go中有限制
- 需要构建开发客户端: `eas build --profile development`

### Q3: 通知不显示？
- 确保在实体设备上测试（模拟器不支持）
- 检查通知权限是否授予

### Q4: 相机/语音不工作？
- 需要构建自定义客户端（非Expo Go）
- 使用 `expo-dev-client`

---

## 发布到应用商店

### Google Play Store
1. 创建开发者账户（$25一次性费用）
2. 生成AAB文件（非APK）
```bash
eas build --platform android --profile production
```
3. 上传到 Google Play Console

---

## 联系方式

如有问题，请通过 GitHub Issues 反馈。

**版本**: 1.0.0
**许可证**: MIT
