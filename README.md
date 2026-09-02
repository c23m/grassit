# my-website

个人网站项目的企划书。

在线地址：<https://grassit.cn>
## 1. 概要


## 2. 技术栈

- **前端**: Vue 3(JS) / Vite / Vue Router
- **后端**: FastAPI(python)
- **数据库**: MySQL
- **桌面端**: Electron（计划使用）
- **实时通信**: WebSocket / WebRTC（计划使用）
- **部署**: 
  - Linux / WSL
  - Nginx
  - Gunicorn
  - Supervisor
  - Cloudflare Tunnel

## 3. 文件结构
省略了环境和部分文件. 

- Web/
  - frontend/
    - public/
      - images/
      - robots.txt
      - favicon.ico
    - src/
      - assets/
        - images/
        - icons/
        - styles/
      - components/
        - common/
        - layouts/
        - misc/
      - router/
      - utils/
      - views/
      - App.vue
      - main.js
    - index.html
  - backend/
    - main.py
  - .gitignore

## 4. url结构

`/:lang?`设置网站语言(*不控制文档语言*):  
省略时为`zh`, 中文.  
`en`为英文.  

本网站暂时不支持其他语言...  

其他下面的都是子路径.

### `/`
**主页(Home)**

在这里可以跳转到其他页面.

### `/login`
**登录界面(Login)**
登录成功后默认跳转到主页

### `/register`
**注册界面(Register)**
注册成功后跳转到登录

### `/user/:username?`
**用户页面(User)**

`username`置空且未登录, 跳转到登录

否则到对应`username`(置空为登录的`username`).  

### `/article/:slug?`
**文档页(Article)**

如果`slug`为空, 查询`readme`.

渲染对应文档

#### `?`参数
`by=id` 时, 根据文章id而非slug来查找

### `404`
若是根节点匹配失败, 则到**404页面**.

否则, 根据具体查询失败的页面渲染出错信息. 

## 存储结构

**用户**  
```ts
type user = {
    id: number // 自增主键
    username: string // unique 用户名, 不可更改
    nickname: string // 显示名
    password: string // 密码哈希
    email: string // 邮箱
    avatar: string // 头像url
}
```

**文章记录**  
```ts
type article = {
    id: string[4] // 哈希后的主键
    slug: string // 唯一, 用作临时链接
    auther: string // 作者的username, 渲染为昵称
    created_at: string // 文章创建时间
    updated_at: string // 最后一次对任意版本修改的时间
}
```

**文件存储**

在后端, 例如:
- articles/
  - 1v4r/
    - main.md 
    - raw.md
    - sunny.png
    - resource.zip
    - ...
- avatars/
  - r674.jpeg
  - ...

### 1. 核心功能
- 资源系统
  - 不做通用网盘，而是作为文章的依赖资源仓库
  - 一篇文章由 Markdown 和若干依赖资源组成
  - 不支持深层目录
- Markdown 引用
  - 上传时将站内文章、资源引用转换为内部 ID
  - 内部引用不依赖 slug，因此修改 slug 不会导致站内引用失效
  - 渲染时将内部 ID 转换为当前可读 URL
  - 外部引用不进行处理，可能因外部地址变化而失效
- Markdown 导出
  - 原始：直接返回用户上传的原始 Markdown
  - 即用：将内部引用转换为永久链接，可直接在网站外使用

### 3. 项目阶段

- 0.x
  - 当前开发阶段
  - 完成基础页面与项目框架
  - 尚未达到最小可行产品，因此暂不使用正式版本号

- 1.0
  - 初步完成文章系统
  - 可以通过 slug 查看预存文章

- 2.0
  - 初步完成账号系统
  - 接入数据库
  - 文章与用户关联
  - 可以查找、发布文章

- 3.0
  - 初步完成个人资源存储系统
  - 文章拥有自己的依赖资源
  - Markdown 支持内部资源引用
  - 可以引用本站上传的图片等资源

- 4.0
  - 调整已有系统和底层
  - 提供桌面端
  - 学习并加入实时网络通信
  - 支持主动推送、私聊等功能

### 4. 后续扩展

- Wiki
- 自定义标签
- 自定义样式
- 创建日期、更新日期
- 留言
- 更多文章版本
- 游戏相关内容
- 其他功能模块

## 游戏项目

- 与网站项目分开开发
- 游戏项目可以独立完成，不强制与 GrassIt 网站绑定
- 卡牌游戏、解谜游戏、生存建造游戏等作为独立企划
- 卡牌游戏可以作为其他游戏的底层框架或独立项目
- 网络通信可以作为游戏项目和网站桌面端共同学习的技术
- 美术资源尽量考虑招募美工协作，避免个人开发占用过多时间
- 游戏项目不以短期完成为目标，在有足够时间和资源后再推进

