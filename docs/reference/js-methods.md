# JavaScript 常用方法速查

> 参考笔记（学习用），不是项目规范。示例代码在 Node 24 上实测过，输出与文中所写一致。

## 数组

| 方法                 | 作用                                 | 实测结果                                  |
| -------------------- | ------------------------------------ | ----------------------------------------- |
| `map`                | 逐个转换，返回新数组                 | `[1,2,3].map(n => n * 2)` → `[2,4,6]`     |
| `filter`             | 筛选，返回新数组                     | `[1,2,3].filter(n => n % 2)` → `[1,3]`    |
| `reduce`             | 汇总成一个值                         | `[...].reduce((s, n) => s + n, 0)` → `15` |
| `find` / `findIndex` | 第一个匹配的元素 / 下标              | `find(n => n > 3)` → `4`                  |
| `some` / `every`     | 是否存在 / 是否全都满足              | `some(n => n > 4)` → `true`               |
| `includes`           | 是否包含某个值                       | `[1,2,3].includes(3)` → `true`            |
| `flat`               | 拍平嵌套数组                         | `[[1,2],[3]].flat()` → `[1,2,3]`          |
| `slice` / `splice`   | 截取（不改原数组）/ 增删（改原数组） | 两者最容易混，注意区别                    |
| `join` / `sort`      | 拼接 / 排序（`sort` 会改原数组）     |                                           |

`map`、`filter`、`slice` 返回**新数组**，原数组不动；`push`、`pop`、`splice`、`sort`、`reverse` 会**就地修改**。Vue 里两种都能用，但同一个数组被多处引用时，就地修改会让组件跟着意外变化。

## 对象

| 写法                             | 实测结果                                               |
| -------------------------------- | ------------------------------------------------------ |
| `Object.keys({ a: 1, b: 2 })`    | `['a', 'b']`                                           |
| `Object.entries({ a: 1, b: 2 })` | `[['a', 1], ['b', 2]]`                                 |
| `Object.fromEntries([['a', 1]])` | `{ a: 1 }`                                             |
| `{ ...a, ...b }`                 | 浅合并，同名字段后者覆盖前者                           |
| `obj?.profile?.email`            | 中间是 `null` / `undefined` 时返回 `undefined`，不报错 |
| `value ?? '(无)'`                | 只有 `null` / `undefined` 才取默认值                   |

`??` 和 `||` 的差别值得单独记：`0 || 5` 得到 `5`，而 `0 ?? 5` 得到 `0`。当"0"或空字符串是合法值时（比如数量、价格），必须用 `??`。

## 字符串

```js
'  Hello World  '.trim() // 'Hello World'
'Hello World'.slice(0, 5) // 'Hello'
'a,b,c'.split(',') // ['a', 'b', 'c']
'grassit.cn'.startsWith('grass') // true
'7'.padStart(3, '0') // '007'
'a-a'.replace('a', 'x') // 'x-a'  只替换第一个
'a-a'.replaceAll('a', 'x') // 'x-x'  全部替换
```

## 数字与日期

- `Number('12')` → `12`；`parseInt('12px')` → `12`（忽略尾部非数字，所以别拿它直接解析用户输入）
- `Math.round` / `Math.floor` / `Math.ceil` / `Math.max` / `Math.min` / `Math.random`
- `new Date().toISOString()` 得到 UTC 字符串；`toLocaleDateString()` 得到本地格式

## 需要真实 DOM 的场景

Vue 里绝大多数情况都不该碰 DOM（对照表见 [html-semantics.md](html-semantics.md)）。确实需要节点时用模板引用：

```vue
<script setup>
import { onMounted, ref } from 'vue'

const inputEl = ref(null)

onMounted(() => {
    inputEl.value?.focus()
})
</script>

<template>
    <input ref="inputEl" />
</template>
```

Vue 3.5+ 也可以写成 `useTemplateRef('inputEl')`，语义更明确。
