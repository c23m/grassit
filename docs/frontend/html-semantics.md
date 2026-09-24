# HTML 语义与表单速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅。

## 为什么用语义化标签

`<div>` 什么都能装，但结构信息就丢了：屏幕阅读器、搜索引擎，以及半年后回看代码的你自己，都靠标签名判断这块是什么。能用语义标签就别用 `div`。

| 用途        | 标签               | 本项目里的位置       |
| ----------- | ------------------ | -------------------- |
| 导航        | `<nav>`            | `NavBar.vue`         |
| 页脚        | `<footer>`         | `Footer.vue`         |
| 主内容      | `<main>`           | `BaseLayout.vue`     |
| 侧栏        | `<aside>`          | `Aside.vue` 文章列表 |
| 独立内容块  | `<article>`        | 文章详情             |
| 主题分组    | `<section>`        | 首页推荐列表         |
| 链接 / 按钮 | `<a>` / `<button>` | 见下方说明           |

`<h1>`~`<h6>` 表示的是**层次**而不是字号，不要为了字小就用 `h4`，那样结构就乱了；字号交给 CSS。

`<a>` 用于跳转（有 `href`），`<button>` 用于触发动作。给按钮套 `<a>`、或者给链接挂点击事件，都是常见的可访问性错误。

## 表单

```html
<form @submit.prevent="onSubmit">
    <label for="username">用户名</label>
    <input id="username" v-model="username" autocomplete="username" />
    <label for="password">密码</label>
    <input
        id="password"
        type="password"
        v-model="password"
        autocomplete="current-password"
    />
    <button type="submit">登录</button>
</form>
```

几个容易踩的点：

- **`<label for>` 要和 `<input id>` 对应**：点标签能聚焦输入框，读屏软件也读得出关联
- **`<button>` 默认是 `type="submit"`**：表单里放普通按钮必须显式写 `type="button"`，否则点一下就把表单提交了
- 浏览器默认提交会**刷新页面**，所以 Vue 里写 `@submit.prevent`
- `autocomplete` 用对值（`username` / `current-password` / `new-password`），密码管理器才能正常工作

## 常用属性

| 属性                      | 作用                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `alt`（`img`）            | 图挂了时显示的内容，也是读屏软件读的内容；纯装饰图写 `alt=""`                                |
| `lang`（`html`）          | 影响读屏发音、拼写检查、断词规则                                                             |
| `name="viewport"` 的 meta | `<meta name="viewport" content="width=device-width, initial-scale=1.0">`，移动端自适应的前提 |
| `hidden` / `disabled`     | 隐藏 / 禁用；注意 `disabled` 的元素不参与表单提交                                            |

Vue 里不要手写 `addEventListener`，用 `@click` / `@submit` 这类指令即可。

## Vue 与原生写法对照

| 原生写法                          | Vue SFC 写法                      |
| --------------------------------- | --------------------------------- |
| `document.querySelector('#x')`    | 模板引用 `ref="x"` + `ref()` 变量 |
| `el.addEventListener('click', f)` | `@click="f"`                      |
| `el.textContent = v`              | `{{ v }}`                         |
| `el.classList.add('active')`      | `:class="{ active: isActive }"`   |
| `el.style.color = 'red'`          | `:style="{ color: 'red' }"`       |

**核心原则**：Vue 里不要直接操作 DOM。DOM 是响应式状态的渲染结果——你改状态，Vue 负责改 DOM。少数确实需要真实节点的场景（聚焦输入框、测量尺寸、初始化第三方库）见 [js-methods.md](js-methods.md) 末尾。
