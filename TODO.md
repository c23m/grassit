# 全栈开发学习路线

这条路线以最终项目为目标：
使用 Vue 3 + JavaScript 开发 Web 前端，并进一步使用 Electron 开发桌面应用；
后端使用 FastAPI，数据库使用 MySQL；
需要实时通信时使用 WebSocket，需要 P2P 联机时进一步学习 WebRTC。

整体原则是：
先建立 Web 基础，再掌握 JavaScript，再学习 Vue；
随后进入 FastAPI、数据库和前后端通信；最后学习 WebSocket、WebRTC 和 Electron。
暂时不把 TypeScript、复杂前端工程化等非当前项目必需内容加入主线。

## 一、Web 基础

这一阶段负责补齐 Web 开发最底层的知识。HTML、CSS、JavaScript 是 Vue 的基础，而 HTTP、TCP/IP 则是后续前后端通信、WebSocket 和 WebRTC 的基础。已经掌握的内容不需要重新系统学习，只在实际使用时查漏补缺。

### 1. HTML

HTML 主要学习页面结构和语义化，不需要在标签细节上投入过多时间。目标是能够独立看懂和写出一个正常的 Web 页面。

- [x] HTML 文档结构与常用元素
- [x] HTML 语义化与页面结构
- [x] HTML 表单
- [x] HTML 综合实践

### 2. CSS

CSS 的目标不是成为专业前端，而是能够独立完成项目需要的布局和样式。重点是盒模型、Flex、Grid、定位和响应式设计。

- [x] CSS 基础语法与选择器
- [x] 盒模型与尺寸
- [x] 文本、颜色、背景与视觉效果
- [x] 普通布局与定位
- [x] Flexbox
- [x] CSS Grid
- [x] 响应式设计
- [x] CSS 综合实践

### 3. JavaScript 基础

JavaScript 是当前路线中非常重要的基础。Vue 并不是 JavaScript 的替代品，因此这里先把语言本身补完整，再进入 Vue。当前已经掌握基本语法、函数、对象、数组和模块化，但数组高阶方法等内容仍需要系统学习。

- [x] JS 运行环境与基本语法
- [x] 运算符、条件与循环
- [x] 函数
- [x] 对象
- [x] 数组
- [ ] 数组高阶方法
- [ ] 解构、展开与现代 JS 语法
- [x] ES Module 模块化


## 二、浏览器与网络基础

这一阶段把 JavaScript 和真实浏览器环境连接起来，同时补齐 HTTP、TCP/IP 等网络知识。后面的 Fetch、FastAPI、WebSocket、WebRTC 都建立在这些概念上。

### 4. 浏览器 JavaScript

这里重点学习 JavaScript 如何操作网页，以及浏览器提供的常用 API。DOM 和事件已经掌握，因此重点转向 Web Storage 和实际浏览器环境中的综合使用。

- [x] DOM 基础
- [x] 事件系统
- [x] 表单与 DOM 实践
- [ ] Web Storage

### 5. JavaScript 异步

异步是现代 Web 开发的核心。Vue 获取后端数据、调用 API、WebSocket、Electron 等都会大量使用异步代码。这里需要真正理解 Promise 和 `async/await`，而不是只会照着写。

- [ ] 同步与异步
- [ ] Promise
- [ ] async / await
- [ ] Fetch API
- [ ] 异步综合实践

### 6. JavaScript 核心进阶

这一阶段解决目前 JavaScript 基础中的主要缺口。闭包、`this`、作用域、原型等不需要研究到语言专家级，但必须能够看懂现代前端代码。旧计划将这些内容列为 Vue 和后续前端开发的重要基础。

- [ ] 作用域与作用域链
- [ ] 闭包
- [ ] `this`
- [ ] 原型与原型链
- [ ] class 与继承
- [ ] JavaScript 综合实践

### 7. 网络基础

网络基础是整个联机功能的底层知识。重点理解 TCP/IP 的基本分层、IP、端口、DNS，以及 HTTP 的请求和响应模型。不需要一开始深入到计算机网络课程的全部细节。

- [x] TCP/IP 分层与基本概念
- [x] IP、端口与 DNS
- [x] TCP 与 UDP
- [x] TCP 三次握手与四次挥手
- [x] HTTP 请求与响应
- [x] HTTP 方法与状态码
- [ ] HTTP Headers、Cookie 与 Authorization
- [ ] HTTP 请求体与 JSON
- [ ] 使用浏览器 Network 面板分析请求
- [ ] 使用 curl 手动发送 HTTP 请求


## 三、Vue 前端

Vue 是当前项目的主要前端框架。目标不是把 Vue 的所有 API 学完，而是理解组件化、响应式、路由和前后端数据交互，并能够独立组织一个中小型 Vue 项目。

### 8. Vue 3 基础

这一阶段掌握 Vue 的基本运行方式和模板系统。你已经实际搭建并运行过 Vue + Vite 项目，因此这些内容主要用于建立系统理解。

- [x] Vue 项目与 Vite
- [x] Vue Single File Component
- [x] 模板语法
- [x] `ref` / `reactive`
- [x] `v-if` / `v-show`
- [x] `v-for` 与 `key`
- [x] `v-model`
- [x] Vue 事件处理

### 9. Vue 组件

组件是 Vue 区别于传统 DOM 开发的核心。重点理解父子组件之间如何传递数据和事件，以及什么时候应该拆分组件。

- [x] 组件的意义与拆分
- [x] Props
- [x] Emits
- [ ] Props + Emits 综合实践
- [x] Slots
- [ ] `v-model` 组件通信
- [ ] `provide` / `inject`

### 10. Vue 响应式与生命周期

这一阶段进一步理解 Vue 如何管理状态以及组件生命周期。`computed` 和 `watch` 是实际项目中经常使用的工具，`onMounted` 等生命周期则会和 API 请求、WebSocket 等功能结合。

- [x] `computed`
- [ ] `watch`
- [x] `onMounted`
- [ ] `onUnmounted`
- [ ] Vue 生命周期综合实践

### 11. Vue Router

当前项目已经配置 Vue Router，但还需要系统掌握路由。重点包括页面切换、嵌套路由、动态路由、参数和编程式导航。

- [x] Router 基础
- [ ] 嵌套路由与 Layout
- [ ] 动态路由
- [ ] 编程式导航
- [ ] 路由参数与查询参数
- [ ] 路由守卫基础

### 12. Vue 工程化

这一阶段解决你目前项目中已经实际遇到的 Vite 路径、`assets`、`public`、`<style scoped>`、全局 CSS 等问题。目标是能够理解一个 Vue 项目的目录结构，而不是死记路径写法。

- [x] Vue 项目结构设计
- [ ] Vite 静态资源与路径
- [ ] Vue 中的全局 CSS 与 `<style scoped>`
- [ ] CSS 变量与组件样式
- [ ] Vue 项目综合实践

### 13. Vue 状态管理

状态管理暂时不是当前项目的第一优先级。先理解为什么需要状态管理，再学习 Pinia。只有当项目出现多个组件共享复杂状态时，才真正发挥它的价值。

- [ ] 前端状态管理问题
- [ ] Pinia 基础
- [ ] Pinia Store
- [ ] Pinia 综合实践


## 四、后端与数据库

这一阶段开始进入真正的全栈开发。FastAPI 负责提供 API，MySQL 负责持久化数据，Vue 负责调用 API 并展示数据。

### 14. HTTP API 与 REST

在正式学习 FastAPI 前，需要把 API 的概念建立起来。目标是能够理解前端和后端之间到底交换了什么数据，以及如何设计一个简单、合理的 API。

- [x] HTTP 请求完整流程
- [ ] JSON API
- [ ] REST API 基础
- [ ] HTTP Headers
- [ ] Cookie
- [ ] Authorization
- [ ] CORS
- [ ] 前后端 API 设计基础

### 15. FastAPI 基础

你已经有 Flask 基础，因此这里不需要从“什么是 Web 后端”重新学习，而是重点掌握 FastAPI 的写法和它与 Flask 的区别。

- [ ] FastAPI 项目结构
- [ ] 路由与 Path Operation
- [ ] 路径参数
- [ ] 查询参数
- [ ] Request Body
- [ ] Response Model
- [ ] 错误处理
- [ ] FastAPI API 文档

### 16. Pydantic 与依赖注入

Pydantic 是 FastAPI 中非常重要的数据模型工具，负责请求和响应的数据验证。依赖注入则是 FastAPI 的重要机制，后面数据库连接、用户认证等都会使用。

- [ ] Pydantic 基础
- [ ] 数据校验
- [ ] Response Model
- [ ] FastAPI Depends
- [ ] 依赖注入实践

### 17. FastAPI 异步

这里把 Python 的异步机制与 FastAPI 联系起来。当前阶段不需要深入异步编程理论，只需要知道什么时候使用 `async/await`，以及它和同步代码的区别。

- [ ] Python async / await
- [ ] FastAPI async 路由
- [ ] 同步与异步代码的选择
- [ ] FastAPI 异步综合实践

### 18. MySQL

你已经安装 MySQL 并掌握基本 SQL，因此这一阶段主要补齐项目开发需要的数据库知识，而不是重新学习 SQL 入门。

- [x] MySQL 基础
- [x] 表、主键、外键与索引
- [x] SELECT 查询
- [x] JOIN
- [x] GROUP BY 与聚合
- [x] INSERT / UPDATE / DELETE
- [ ] 事务基础
- [ ] 数据库设计实践

### 19. SQLAlchemy

SQLAlchemy 负责把 FastAPI 和数据库连接起来。重点理解 ORM 的基本思想、Model、Session 和 CRUD，不需要一开始研究 SQLAlchemy 的全部高级功能。

- [ ] SQLAlchemy 与 ORM 思维
- [ ] Model
- [ ] Engine 与连接
- [ ] Session
- [ ] CRUD
- [ ] 查询与过滤
- [ ] 表关系
- [ ] FastAPI + SQLAlchemy
- [ ] 数据库项目实践

### 20. 前后端第一次连接

这是整个学习路线中的一个重要里程碑：Vue 页面能够真正向 FastAPI 请求数据，FastAPI 从 MySQL 获取数据，再返回给 Vue。

- [ ] Vue 调用 FastAPI
- [ ] GET 数据展示
- [ ] POST 数据提交
- [ ] Loading 状态
- [ ] Error 状态
- [ ] 前后端 API 综合实践


## 五、用户系统与实时通信

完成普通 HTTP API 后，再进入登录、WebSocket 等更复杂的功能。这一阶段开始逐渐接近真正的联机应用。

### 21. 用户系统

用户系统建立在 FastAPI、数据库、HTTP 和前端状态管理之上。重点是理解认证流程，而不是直接复制一套 JWT 模板。

- [ ] 用户注册
- [ ] 密码安全存储
- [ ] 用户登录
- [ ] JWT 基础
- [ ] FastAPI JWT 认证
- [ ] Vue 登录状态
- [ ] 路由鉴权
- [ ] 权限控制

### 22. WebSocket

WebSocket 用于需要持续连接和实时双向通信的场景。它和普通 HTTP 请求的思维方式不同，是后续聊天、实时状态同步以及 WebRTC 信令的基础。

- [ ] WebSocket 与 HTTP 的区别
- [ ] WebSocket 基础 API
- [ ] FastAPI WebSocket
- [ ] Vue WebSocket 客户端
- [ ] WebSocket 连接状态管理
- [ ] 多客户端通信
- [ ] 心跳
- [ ] 断线与重连
- [ ] WebSocket 综合实践


## 六、P2P 联机

WebRTC 是整个路线中最复杂的部分之一。它不应该在基础 Web 开发之前学习，而应该建立在 HTTP、TCP/UDP、WebSocket 和前端基础之上。目标是最终能够理解并实现基本的 P2P 联机。

### 23. WebRTC 基础

先理解 WebRTC 的整体架构和核心对象，再进入具体 API。根据项目实际需求决定是使用 DataChannel、音视频还是两者。

- [ ] WebRTC 是什么
- [ ] MediaStream
- [ ] 摄像头与麦克风
- [ ] RTCPeerConnection
- [ ] RTCDataChannel
- [ ] WebRTC 基本连接流程

### 24. WebRTC 建连机制

这里理解 Offer / Answer、SDP、ICE Candidate 等概念。这部分不要求一开始理解协议内部所有细节，但必须知道它们分别解决什么问题。

- [ ] SDP
- [ ] Offer / Answer
- [ ] ICE
- [ ] Candidate
- [ ] WebRTC 建连流程
- [ ] WebRTC 状态管理

### 25. STUN / TURN 与信令

WebRTC 本身不会替你解决所有网络连接问题，因此需要理解 NAT 穿透以及 STUN / TURN。WebSocket 可以作为信令通道，负责交换建立连接所需的信息。

- [ ] NAT 与内网穿透基础
- [ ] STUN
- [ ] TURN
- [ ] WebSocket 信令服务器
- [ ] WebRTC + WebSocket 综合实践

### 26. WebRTC 项目实践

这一阶段才把前面的知识组合起来，完成真正的联机功能。具体实现方式根据最终项目需求决定。

- [ ] 两人 P2P 连接
- [ ] DataChannel 联机
- [ ] 音视频通信
- [ ] 断线处理
- [ ] WebRTC 综合项目


## 七、桌面应用

Electron 将前面已经掌握的 Web 技术转换为桌面应用。它的核心难点不是 Vue，而是理解 Chromium Renderer、Node.js Main Process、Preload 和 IPC 之间的关系。

### 27. Electron 基础

先建立 Electron 的整体架构，再学习如何将现有 Vue 项目加载进 Electron。

- [ ] Electron 架构
- [ ] Main Process
- [ ] Renderer Process
- [ ] Chromium 与 Node.js
- [ ] Electron 项目结构
- [ ] Electron 加载 Vue

### 28. Electron IPC

Electron 的核心能力之一是让渲染进程和主进程安全地通信。理解 IPC 后，才能使用桌面系统能力。

- [ ] IPC 基础
- [ ] `ipcMain`
- [ ] `ipcRenderer`
- [ ] preload
- [ ] contextBridge
- [ ] Main / Renderer 综合实践

### 29. Electron 系统能力

这里学习 Electron 相比普通 Web 应用多出来的能力，例如窗口、菜单、文件系统等。

- [ ] Electron 窗口管理
- [ ] 系统菜单
- [ ] 系统托盘
- [ ] 快捷键
- [ ] 文件系统
- [ ] Node.js `fs` 基础

### 30. Electron 安全与项目实践

Electron 可以直接接触本地系统，因此安全模型非常重要。目标是形成正确的 preload、context isolation 和 IPC 使用习惯。

- [ ] Electron 安全模型
- [ ] context isolation
- [ ] Node Integration
- [ ] 安全的 IPC API
- [ ] Electron 调用 Web API
- [ ] Electron 调用 WebSocket
- [ ] Vue + Electron 综合实践

### 31. Electron 发布

最后学习如何把开发环境中的 Electron 应用变成可以实际运行和分发的桌面程序。

- [ ] Electron 打包
- [ ] electron-builder
- [ ] Windows 应用构建
- [ ] 应用配置
- [ ] Electron 发布流程


## 八、部署与工程化

这一阶段主要使用你已经接触过的 Linux、Nginx、Gunicorn、Supervisor 和 Cloudflare，同时补齐生产环境中的前端构建、配置管理和容器化。

### 32. Web 生产部署

你已经有实际部署经验，因此这里以理解整个生产链路为主，而不是重新学习 Linux。

- [x] Linux Web 服务结构
- [x] Nginx 反向代理
- [x] Gunicorn / FastAPI 部署
- [x] Supervisor 服务管理
- [ ] 前端生产构建
- [ ] 前后端生产环境配置
- [x] HTTPS / 域名 / Cloudflare

### 33. Docker

Docker 目前不是项目开发的前置条件，因此放在后面。重点是能够使用 Docker 管理 FastAPI、MySQL 等服务，而不是深入 Docker 底层原理。

- [ ] Docker 基础
- [ ] Dockerfile
- [ ] Docker Compose
- [ ] FastAPI 容器化
- [ ] MySQL 容器化
- [ ] 前后端完整部署

### 34. 项目工程化

当项目规模扩大后，需要解决配置、日志、目录结构、API 规范和代码组织问题。这部分不需要一开始全部掌握，而是在项目逐渐复杂后学习。

- [ ] Git 项目工作流
- [ ] 环境变量与配置管理
- [ ] 日志与错误处理
- [ ] API 文档与接口规范
- [ ] 前端项目规范
- [ ] 后端项目分层
- [ ] 项目综合重构


## 九、综合项目

前面的学习最终都应该回到实际项目中。综合项目不是重新学习知识，而是把 Vue、FastAPI、MySQL、WebSocket、WebRTC 和 Electron 逐步组合起来。

### 35. Web 版项目

先完成纯 Web 版本，避免 Electron 和联机功能同时增加复杂度。目标是完成一个具有真实数据、用户系统和基本业务逻辑的完整 Web 应用。

- [ ] Vue 前端页面
- [ ] FastAPI API
- [ ] MySQL 数据库
- [ ] 用户系统
- [ ] 前后端完整交互
- [ ] Web 生产部署

### 36. 实时联机功能

在普通 Web 应用稳定后加入实时通信。根据项目实际需求选择 WebSocket 或 WebRTC，不为了学习而强行加入不需要的技术。

- [ ] WebSocket 实时通信
- [ ] 实时状态同步
- [ ] WebRTC P2P 通信
- [ ] 信令服务器
- [ ] 联机功能综合实践

### 37. Electron 桌面版

最后将成熟的 Web 前端迁移到 Electron，并根据桌面环境增加本地文件、窗口、系统托盘等能力。

- [ ] Vue + Electron 整合
- [ ] Electron IPC
- [ ] 本地系统能力
- [ ] WebSocket / WebRTC 联机
- [ ] Windows 打包
- [ ] 桌面应用综合实践