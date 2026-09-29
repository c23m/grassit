# Vue 事件与事件修饰符

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 版本按本仓库实际安装的核对过：vue 3.5.32、@vueuse/core 14.4.0（`useToggle`、`useDark` 的行为是从 node_modules 源码里读出来的）。
> 相关笔记：[js-methods.md](js-methods.md)（数组/对象方法）、[html-semantics.md](html-semantics.md)（表单与可访问性）、[auth-form-parts.md](auth-form-parts.md)（认证表单的现成组件）。

## `@click="fn"` 和 `@click="fn()"` 不是一回事

| 写法                    | 实际执行               | 处理器收到什么                 |
| ----------------------- | ---------------------- | ------------------------------ |
| `@click="fn"`           | 把这个函数交给 Vue 当处理器 | **第一个参数是事件对象**     |
| `@click="fn()"`         | 包成 `$event => fn()`  | 什么都不传                     |
| `@click="fn($event)"`   | 包成 `$event => fn($event)` | 手动把事件对象传进去       |
| `@click="fn('a')"`      | 包成 `$event => fn('a')` | 只拿到 `'a'`，事件对象被丢掉 |
| `@click="a(), b()"`     | 两个都执行             | 都拿不到事件                   |

**差别只在处理器的第一个参数有没有意义。** 处理器是 `() => {}` 这种不收参数的，写不写括号都行（多传一个事件对象会被忽略）；一旦第一个参数有意义，就必须分清。

本仓库踩过一次：`NavBar.vue` 的主题切换原来写的是 `@click="toggleDark"`，看着像是"把函数给 Vue"，实际上每次点击都把 **MouseEvent** 传给了 `useToggle`：

```js
// @vueuse/shared/dist/index.js（14.4.0）
function toggle(value) {
    if (arguments.length) {
        _value.value = value; // 传了参数 → 直接设值，不翻转
        return _value.value;
    }
    // 没参数才翻转
}

// @vueuse/core/dist/index.js（useDark 的 setter）
set(v) {
    const modeVal = v ? 'dark' : 'light';
    ...
}
```

事件对象是真值 → 永远被设成 dark，点了只能变暗、再也回不到亮色；系统本身是暗色时，看起来就是"按钮完全没反应"。改成 `@click="toggleDark()"` 就好了（VueUse 文档里也是带括号的写法）。

**规律**：要传固定参数或要"翻转/切换"这类无参行为时写括号；只想把事件对象转发给处理器时写 `fn($event)`。

## 事件对象里有什么

| 属性 / 方法                  | 用途                                                     |
| ---------------------------- | -------------------------------------------------------- |
| `$event.target`              | 触发事件的元素（可能是子元素，比如输入框里的 `<b>`）      |
| `$event.currentTarget`       | 绑定监听的那个元素——判断"点的是不是它自己"要用这个         |
| `$event.preventDefault()`    | 阻止默认行为（表单提交、链接跳转）                        |
| `$event.stopPropagation()`   | 阻止冒泡                                                  |
| `$event.key` / `$event.code` | 键盘按键（配合修饰符就不用自己判断了）                    |

## 修饰符

| 修饰符     | 等价于                                  | 常用场景                     |
| ---------- | --------------------------------------- | ---------------------------- |
| `.prevent` | `event.preventDefault()`                | 表单：`@submit.prevent`      |
| `.stop`    | `event.stopPropagation()`               | 阻止冒泡到父元素             |
| `.self`    | 只在 `target === currentTarget` 时触发   | 遮罩层点击关闭               |
| `.once`    | 只触发一次                              | 引导、一次性回调             |
| `.capture` | 捕获阶段触发                            | 父元素先于子元素拿到事件     |
| `.passive` | 声明"不会阻止默认行为"，滚动更顺          | `@scroll.passive`            |

可以串起来写，顺序有意义：`@click.stop.prevent="fn"`。

键盘、鼠标、系统键也有对应修饰符：

```html
<input @keyup.enter="submit" />
<input @keyup.esc="clear" />
<div @click.right.prevent="openMenu"></div>
<div @click.ctrl.exact="selectSome"></div>
```

多个监听器还能用对象语法集中写：

```html
<button v-on="{ click: onClick, mouseenter: onEnter }">…</button>
```

## 表单：`v-model` 管值，`submit` 管提交

- 用 `@submit.prevent` 而不是给按钮绑 `@click`：**在输入框里按回车也会走 submit**，用 click 就漏了这条路径；而且 submit 天然带"整张表单"的语义。
- 本仓库的 `Button.vue` 声明了 `type` prop 且默认 `'button'`，所以做提交按钮**必须写** `type="submit"`——不写就是普通按钮，表单不会提交（这是组件覆盖了浏览器默认值 `submit` 的结果）。
- 表单里的 `<button>` 默认类型是 `submit`；一个表单里如果还有别的按钮，记得显式写 `type="button"`，否则会误触提交。
- `TextInput.vue` 内部是 `const model = defineModel()` + `<input v-model="model">`，所以父组件直接 `v-model="username"` 即可，不需要自己写事件。

## 自定义组件上的事件

- **单根组件**没声明 `emits` 时，父组件写的 `@click` 会像普通属性一样落到子组件的根元素上（本仓库 `Icon.vue` 就是靠这个支持 `@click`）。
- 子组件一旦在 `defineEmits([...])` 里声明了某个事件名，父组件的 `@该事件` 就**不再**落到根元素，只有子组件主动 `emit` 才触发。
- `v-model` 在组件上展开成 `:modelValue` + `@update:modelValue`；`defineModel()` 是这两个的语法糖，本仓库的 `TextInput` / `Textarea` 用它。
- 传多个根节点（fragment）的组件没法自动继承 attrs/事件，会直接警告——这时要自己 `v-bind="$attrs"` 指定落点。

## 常见坑

- **把函数引用当处理器用**：只有当处理器"不在意第一个参数"时才安全。拿不准就写 `fn()`。
- **循环里传参数**：`@click="fn(item)"` 是对的（Vue 会包一层），别写成 `@click="fn"` 然后指望拿到 `item`。
- **处理器里 `await`**：Vue 不会等你，异常也不会自动冒出来——要自己 `try/catch`，否则只会在控制台看到未处理的 Promise 拒绝。
- **组合式 API 里没有 `this`**：`<script setup>` 的模板作用域就是顶层变量，别再找 `this.xxx`。
- **`target` 与 `currentTarget` 混用**：点在子元素上时 `target` 是子元素，判断"点没点自己"必须用 `currentTarget`（或用更省事的 `.self`）。

## 本仓库的相关位置

| 位置                        | 用到的东西                                             |
| --------------------------- | ------------------------------------------------------ |
| `layouts/nav/NavBar.vue`    | `@click="toggleDark()"`（踩过上面那个坑，已修）、`useDark` |
| `views/Login.vue`           | `@submit.prevent="onSubmit"`（处理器不收参数，可以不带括号）|
| `views/Home.vue`            | `@click="pictIndex = (pictIndex + 1) % colors.length"` |
| `views/ApiTest.vue`         | `@click="urlCache.indexInc"`——那些 handler 是 `() => {}`，多收一个事件参数无害 |
