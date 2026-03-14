# 初中生学习计划跟进 App

一款专为初中生设计的学习计划管理App，通过游戏化机制（宠物养成、积分奖励）提升学习动力，帮助养成良好的学习习惯。

## 功能特性

### 核心功能
- **智能任务管理**：课内/课外分类，9大学科细分
- **前日遗留滚动**：自动将未完成任务滚动到次日
- **灵活提醒系统**：精确到分钟的自定义提醒，支持循环提醒
- **未完成记录**：拍照、语音、文字记录未完成原因

### 游戏化激励
- **宠物养成系统**：可爱的宠物随完成度变化表情
- **积分奖励机制**：完成任务、连续打卡获得积分
- **等级成长体系**：宠物升级解锁新外观

### 统计视图
- **当日视图**：任务列表 + 完成进度
- **学科视图**：各学科完成率分析
- **月度视图**：日历热力图展示学习轨迹

## 技术栈

- **React Native** + **Expo**
- **SQLite** 本地数据库
- **React Navigation** 路由导航
- **Expo Notifications** 本地通知
- **Expo Camera** 相机功能
- **Expo Speech** 语音合成

## 安装运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npx expo start

# iOS 模拟器
i

# Android 模拟器
a
```

## 项目结构

```
study-plan-app/
├── App.js                 # 应用入口
├── app.json               # Expo 配置
├── src/
│   ├── components/        # 组件
│   │   ├── PetDisplay.js
│   │   ├── ProgressRing.js
│   │   └── TaskItem.js
│   ├── screens/           # 页面
│   │   ├── HomeScreen.js
│   │   ├── TaskScreen.js
│   │   ├── PetScreen.js
│   │   ├── StatsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── AddTaskScreen.js
│   │   └── IncompleteRecordScreen.js
│   ├── services/          # 服务
│   │   ├── database.js
│   │   └── notifications.js
│   ├── utils/             # 工具函数
│   │   ├── dateUtils.js
│   │   └── speechUtils.js
│   ├── constants/         # 常量配置
│   │   └── theme.js
│   └── assets/            # 资源文件
└── package.json
```

## 数据库设计

### 核心表
- **tasks**：任务表
- **task_roll_history**：任务滚动历史
- **user_settings**：用户设置
- **points_history**：积分记录
- **daily_stats**：每日统计

## 颜色规范

- **主色**：活力橙 #FF8C42
- **辅色**：清新蓝 #4ECDC4
- **成功**：成功绿 #2ECC71
- **警告**：提醒黄 #F1C40F
- **学科**：各学科学科专属颜色

## 开发计划

1. ✅ 项目搭建 + 数据库设计
2. ✅ 任务CRUD功能
3. ✅ 任务状态管理（完成/未完成/放弃）
4. ✅ 前日遗留滚动机制
5. ✅ 本地通知实现
6. ✅ 提醒时间配置
7. ✅ 宠物养成系统
8. ✅ 积分系统
9. ✅ 统计视图
10. ✅ UI/UX 打磨

## 后续扩展

- AI智能分析学习数据
- 番茄钟专注计时
- 错题本集成
- 数据导出PDF
- 社区打卡功能

## License

MIT
