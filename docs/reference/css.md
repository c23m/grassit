# CSS 速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 语义标签、表单结构、可访问性见 [html-semantics.md](html-semantics.md)；组件结构基准见 [components.md](../frontend/components.md)。

## 本仓库的样式从哪来

| 文件                          | 内容                                | 谁导入                              |
| ----------------------------- | ----------------------------------- | ----------------------------------- |
| `assets/styles/base.css`      | reset + 配色变量（`:root` / `.dark`） | `BaseLayout.vue`、`Home.vue`        |
| `assets/styles/markdown.css`  | 文章正文排版                        | `main.js`                           |
| 组件里的 `<style scoped>`     | 单个组件的样式                      | 组件自己                            |

`base.css` 由 `BaseLayout` 导入，所以挂在它下面的路由（含 `/login`）都能拿到那套变量。

配色变量：

| 变量                                         | 亮色 / 暗色                    | 用途             |
| -------------------------------------------- | ------------------------------ | ---------------- |
| `--bg-primary`                               | `#eee` / `#111`                | 页面底色         |
| `--bg-secondary`                             | `#ddd` / `#222`                | 输入框、卡片     |
| `--text-strong` / `--text-default` / `--text-weak` | `#000` / `#333` / `#666`（亮） | 标题 / 正文 / 次要 |
| `--link` / `--link-hover`                    | `#44d` / `#33c`（亮）          | 链接、主按钮     |
| `--border`                                   | `#555` / `#aaa`                | 禁用态、边框     |

暗色由 `:root.dark` 那一段整体覆盖，所以**颜色一律用变量**：硬写 `#fff` 在暗色下会刺眼；变量名写错不会报错，只是那条声明整条失效（回退到默认值）。

## 选择器与优先级

| 写法             | 优先级权重 | 例                             |
| ---------------- | ---------- | ------------------------------ |
| 元素 / 伪元素    | (0,0,1)    | `label`、`::placeholder`       |
| 类 / 属性 / 伪类 | (0,1,0)    | `.field`、`[disabled]`、`:hover` |
| id               | (1,0,0)    | `#app`                         |
| 行内 style       | (1,0,0,0)  | `style="..."`                  |

- 权重相同则**后写的赢**（同一文件里往下写、或后导入的文件）
- 后代选择器把各段权重相加：`.form label input` = (0,2,2)
- 通配 `*` 权重为 0，`base.css` 的 reset 才容易被覆盖
- `!important` 只在覆盖第三方样式时用；用了就几乎没法再被覆盖

## 盒模型

```css
/* base.css 里已经全局设过 */
* {
    box-sizing: border-box;
}
```

- `border-box`：`width` 包含 padding 与 border，`width: 300px` 就是占 300px
- `content-box`（浏览器默认）：`width` 只算内容，加 padding 会变宽
- 垂直方向的相邻 `margin` 会折叠（取较大者），`padding` 不会
- 块级元素默认撑满父容器宽度；行内元素宽度由内容决定

## display 常用值

| 值             | 特点                                                     |
| -------------- | -------------------------------------------------------- |
| `block`        | 独占一行，可设宽高                                        |
| `inline`       | 跟着文字排，**设 width/height 无效**，上下 margin 无效     |
| `inline-block` | 像文字一样排列，但可以设宽高（`text-align` 能居中它）      |
| `flex`         | 自己变弹性容器，子元素按主轴排列                           |
| `grid`         | 二维网格，做整页布局时用                                   |
| `none`         | 从布局里彻底移除（对比 `visibility: hidden` 仍占位）       |

## 居中

| 目标                       | 写法                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| 行内内容横向居中           | 父元素 `text-align: center`                                           |
| 有确定宽度的块横向居中     | 自己 `width: 300px; margin: 0 auto`                                    |
| 任意内容水平 + 垂直居中     | 父元素 `display: flex; justify-content: center; align-items: center`   |
| 单行文字在盒子里垂直居中   | `line-height` 等于盒子高度，或直接用 flex                              |

`text-align: center` 只能影响**行内级**子元素；`inline-block` 算行内级，所以给父元素设 `text-align: center` 能把它推到中间——这是"居中一个表单"最省事的写法。

## flex 速查

```css
.row {
    display: flex;
    flex-direction: row; /* 默认；主轴 = 水平 */
    gap: 0.75rem; /* 子元素之间的间距 */
    align-items: center; /* 交叉轴（这里 = 垂直）对齐 */
    justify-content: space-between; /* 主轴（这里 = 水平）分配 */
}

.col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
```

- `flex-direction: column` 之后，`justify-content` 管垂直、`align-items` 管水平——主轴变了，两个属性的方向跟着换
- `gap` 比给子元素加 margin 干净：不产生首尾多余间距，也不会折叠
- `flex-wrap: wrap` 允许换行；默认 `nowrap` 会硬挤
- 子项：`flex: 1`（平分剩余空间并可收缩）、`flex: none`（保持自身尺寸）、`align-self: flex-end`（单独改交叉轴对齐）

## 尺寸与间距单位

| 单位         | 相对谁                    | 什么时候用                          |
| ------------ | ------------------------- | ----------------------------------- |
| `px`         | 绝对                      | 边框、细线、输入框宽度这类固定尺寸  |
| `rem`        | 根元素字号（默认 16px）   | 间距、字号（随用户设置缩放，首选）  |
| `em`         | 自身字号（嵌套会累积）    | 少用，容易越套越大                  |
| `%`          | 父容器对应尺寸            | 宽度；高度百分比需要父级有确定高度  |
| `vw` / `vh`  | 视口宽 / 高               | 整屏布局                            |

- `clamp(min, 理想值, max)` 可以做弹性尺寸：`font-size: clamp(1rem, 2.5vw, 1.5rem)`
- `calc()` 可以混算不同单位：`width: calc(100% - 2rem)`

## 常用属性速查

| 属性                                              | 说明                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `margin` / `padding`                              | 简写按「上 右 下 左」；两个值时 = 上下、左右；`margin: 0 auto` 左右自动 |
| `border`                                          | `border: 2px solid var(--border)`，简写顺序 宽 样式 颜色               |
| `border-radius`                                   | 圆角，`50%` 是正圆（配合等宽高）                                       |
| `box-shadow`                                      | 阴影，`0 2px 8px var(--shadow)`                                       |
| `overflow`                                        | `hidden` 裁剪、`auto` 需要时才出滚动条                                |
| `max-width`                                       | 比 `width` 更好用，小屏自动收缩                                       |
| `opacity`                                         | 整体透明度，子元素跟着变                                              |
| `cursor`                                          | `pointer` 表示可点                                                    |
| `line-height`                                     | 行高，无单位时表示倍数（如 `1.5`）                                    |
| `text-align`                                      | 行内内容的水平对齐                                                    |
| `white-space`                                     | `nowrap` 不换行                                                       |
| `transition`                                      | `background-color 0.2s ease`                                          |

单行文本溢出显示省略号，三个属性缺一不可（并且盒子要有确定宽度）：

```css
.title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
```

## 表单元素

- `base.css` 已给 `input`、`button`、`textarea`、`select` 设了 `font: inherit`，字体跟页面一致
- `fieldset { border: none }` 已在 reset 里；`legend` 的默认样式没动过
- 焦点：`:focus` 鼠标点击也触发，`:focus-visible` 只在键盘导航时触发
- 用 `outline: none` 去掉默认焦点框，**必须**换成别的可见反馈（本仓库 `TextInput` 是让边框变深）
- 占位符：`::placeholder { color: var(--text-weak) }`
- 禁用：`:disabled`；表单校验还可以用 `:invalid` / `:user-invalid`
- `appearance: none` 去掉系统原生外观，只在自己画控件时用

## 状态伪类

| 伪类                         | 命中时机                       |
| ---------------------------- | ------------------------------ |
| `:hover` / `:active`         | 悬停 / 按下                    |
| `:focus` / `:focus-visible`  | 获得焦点 / 键盘导航获得焦点    |
| `:disabled` / `:checked`     | 禁用 / 勾选                    |
| `:first-child` / `:last-child` | 第一个 / 最后一个子元素      |
| `:nth-child(2n)`             | 偶数位子元素                   |
| `:not(.x)`                   | 排除                         |

## CSS 变量

```css
:root {
    --gap: 1rem;
}

.card {
    padding: var(--gap);
    color: var(--text-default, #333); /* 第二个参数是兜底值 */
}
```

- 变量定义在某个选择器里，就只对那个元素及其后代生效（作用域）
- 变量是**继承**的，改一个祖先就能换整套主题——`base.css` 的 `:root.dark` 就是这么做的
- 组件里定义局部变量可以做局部主题，不必动全局文件

## 过渡

```css
.btn {
    transition: background-color 0.2s ease;
}
```

- `base.css` 的 `*` 已经给 `color`、`background-color`、`border-color`、`box-shadow` 设了 0.2s 过渡，状态切换自动有淡入，不用重复写
- 要过渡 `transform`、`opacity` 等其它属性，得自己把它们加进 `transition-property`

## 响应式

```css
@media (max-width: 600px) {
    .form {
        padding: 1rem;
    }
}
```

- 移动优先：默认写小屏样式，再用 `min-width` 逐级加宽屏
- 布局交给 flex + `gap`，通常比写好几段媒体查询省事
- 视口 meta 已在 `index.html` 里（`width=device-width`），不用再加

## Vue scoped 的几个坑

- `<style scoped>` 编译后会给选择器补一个 `[data-v-xxx]` 属性选择器，只命中带同一 id 的元素
- 子组件的**根元素**会继承父组件的 scope id，所以父组件里写 `.form label { }`、`.form > button { }` 能命中 `<TextInput>`、`<Button>` 的根节点
- 子组件内部的**非根节点**命中不了，要用 `:deep()`：`.form :deep(input) { }`
- 给单根组件传 `class` 会自动合并到根元素上，所以 `<TextInput class="field" />` 就等于给 `<input>` 加了 `field` 这个类名，通常比 `:deep()` 干净
- `:global(...)` 跳出 scoped；`:slotted(...)` 针对插槽内容
- 动态写法：`:class="{ active: isActive }"`、`:class="['a', cond && 'b']"`、`:style="{ width: w + 'px' }"`

## 调试

- DevTools → Elements → Styles：被划掉的声明就是优先级没赢
- 同面板的 Computed + 盒模型图：看实际生效的值，以及 margin/padding 从哪来
- 颜色在暗色下不对，先查是不是没用变量
