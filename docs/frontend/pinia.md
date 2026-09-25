# Pinia 状态管理与持久化速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> API 细节对照本仓库实际安装的版本核对过：pinia 4.0.3、@vueuse/core 14.4.0。

## 什么时候需要 store

组件自己的数据放组件里就够了。真正需要 store 的信号是：**同一个状态要被多个不相关的组件读写**。

登录态就是典型例子：导航栏要显示头像，文章详情页要知道"我是不是作者"，路由守卫要在进页面前判断有没有登录。这些位置在组件树上离得很远，用 props 往下传、用 emit 往上冒都会很快变成噪音。

Pinia 只解决这一件事：把状态放进一个全局可 import 的地方，谁需要谁 `useXxxStore()`。

## 最小 store（setup 风格）

```js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getMe } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)

    const isLoggedIn = computed(() => user.value !== null)

    const fetchMe = async () => {
        user.value = await getMe()
    }

    return { user, isLoggedIn, fetchMe }
})
```

几个容易混的点：

| 事项                          | 说明                                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| 返回值即接口                  | `return` 出去的东西才是 store 暴露的，没 return 的变量外部看不到 |
| 不是 `.value`                 | 组件里写 `store.user` 拿到的是解包后的值，store 内部照常写 `.value` |
| ref → state、computed → getter | 这只是分类，用起来都是普通属性                                   |
| 没有 `this`                   | setup 风格里 action 之间直接互相调用函数名                       |
| 懒加载                        | `useAuthStore()` 第一次被调用时才创建 store 实例                 |

### 解构会丢响应性

```js
const auth = useAuthStore()
const { user } = auth // 解构出来的是快照，之后变了也不更新
const { user } = storeToRefs(auth) // 正确：拿到的是 ref
```

action（函数）可以直接解构，它们不参与响应式追踪。

### 调用位置有要求

store 依赖一个"当前活动的 pinia 实例"，所以必须在 `app.use(createPinia())` 之后才能 `useAuthStore()`。在组件 setup 里、或在路由守卫里调用都没问题；在模块顶层直接调用则会报 `getActivePinia()` 相关的错。

## 持久化：为什么需要、怎么做

`ref` 存在内存里，刷新页面就回到初始值。要跨刷新保留状态，只能写浏览器存储（本项目是 localStorage）。

### 本项目用的写法：`useLocalStorage`

```js
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage('token', '') // 用法和 ref 一样，读写都会同步到 localStorage
token.value = 'xxx' // 内部执行 localStorage.setItem
token.value = '' // 写回空字符串
```

实测（@vueuse/core 14.4.0）几个值得知道的行为：

| 行为             | 说明                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 同页面多实例同步 | 写值时会 `window.dispatchEvent(new StorageEvent('storage', ...))`，所以**同一个 key 的多个 ref 会互相同步**，不必自己加 watch                               |
| 跨标签页同步     | 靠浏览器原生的 `storage` 事件，默认开启                                                                                                                     |
| 写 null          | 赋 `null` / `undefined` 会走 `removeItem`，不会留下字符串 `"null"`                                                                                           |
| 自动序列化       | 按初始值的类型挑序列化器：初始值 `''` 存字符串，初始值 `0` 存数字                                                                                            |
| 同步 API         | localStorage 读写是同步的，只适合放小数据；同源脚本都能读到，别放长期有效的敏感凭据                                                                           |

兄弟 API 是 `useSessionStorage`（关标签页就没了）；需要更细的控制可以直接用 `useStorage`，例如 `useStorage('k', 0, undefined, { writeDefaults: false })` 表示初始值不写回存储。

### 手写版本长什么样

原理就是"初始化时读一次 + watch 写回"：

```js
const token = ref(localStorage.getItem('token') ?? '')
watch(token, (v) => localStorage.setItem('token', v))
```

手写版没有多实例同步、没有类型序列化，也不处理异常（隐私模式下 localStorage 可能直接抛错），这就是本项目直接用 vueuse 的原因。

## 刷新后恢复登录态：一块持久化、一块要重拉

登录态实际上由两部分组成：

- **token**：字符串，适合持久化，刷新后还在
- **user**（昵称、头像等）：内存里的对象，刷新后是 `null`，必须拿 token 重新请求 `GET /users/me`

顺序很关键：重拉要发生在**路由守卫放行之前**。否则会出现"明明登录着，首页先渲染成未登录、一秒后头像才冒出来"的闪烁；如果守卫拿 `user` 判断，甚至会直接误判成未登录踢回登录页。

一种省事的写法是在 store 里留一个"确保已加载"的入口，并把并发请求合并掉：

```js
let pending = null

const ensureUser = () => {
    if (user.value || !token.value) return Promise.resolve()
    pending ??= fetchMe().finally(() => {
        pending = null
    })
    return pending
}
```

守卫里 `await auth.ensureUser()` 即可；同一个页面同时触发两次导航时，第二次拿到的是同一个 promise，不会重复请求 `/users/me`。

退出登录反过来做：清 token（赋 `''` 会同步写回 localStorage）、清 user、跳登录页。漏掉任何一块，刷新后就会"假登录"。

## 本项目的落点

| 文件                            | 职责                                              |
| ------------------------------- | ------------------------------------------------- |
| `frontend/src/stores/auth.js`   | 持有 token 与 user，暴露 login / fetchMe / logout |
| `frontend/src/utils/request.js` | 从同一个 localStorage key 读 token 塞进请求头     |

两边各自 `useLocalStorage('token', '')`，靠上面说的同页面同步机制保持一致。更"正规"的做法是让拦截器直接读 store，但 store 会 import api、api 又 import 拦截器，容易绕成循环依赖，0.0.5 处理 refresh 时值得一起想清楚。
