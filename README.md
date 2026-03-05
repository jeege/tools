# Tools Server Web UI

一个基于 React + TypeScript + Vite 构建的移动端优先的 Web 管理界面，提供剪贴板管理和 Tunnel 规则管理功能。

## 功能特性

- **剪贴板管理** - 快速创建、复制和删除文本片段
- **Tunnel 管理** - 管理内网穿透规则（需登录）
- **移动端优先** - 针对手机触摸操作优化的界面设计
- **响应式布局** - 同时适配移动端和 PC 端

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理
- **Axios** - HTTP 客户端

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── api/           # API 客户端和接口定义
├── components/    # UI 组件
│   ├── ui/       # 基础 UI 组件
│   └── Layout.tsx # 布局组件
├── pages/         # 页面组件
│   ├── Clipboard.tsx  # 剪贴板页面
│   ├── Login.tsx      # 登录页面
│   └── Tunnel.tsx     # Tunnel 管理页面
├── lib/           # 工具函数
└── index.css      # 全局样式
```

## 移动端设计特点

- **底部导航栏** - 登录后显示多标签导航
- **卡片式布局** - 内容以卡片形式展示，便于触摸操作
- **底部弹窗** - 新建/编辑操作使用从底部滑出的弹窗
- **大触摸区域** - 按钮和交互元素最小 44px 点击区域
- **圆角现代风格** - 使用大量圆角营造现代感
- **安全区域适配** - 适配刘海屏和底部手势条

## 认证机制

- 使用 JWT Token 进行身份验证
- Token 存储在 localStorage

## 环境变量

```env
VITE_API_URL=http://localhost:8080  # API 基础地址
```
