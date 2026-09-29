# 前端引用说明

> 这个目录放**与前端当前工作直接相关**的文档，其中 [components.md](components.md) 是页面与组件的结构基准（规范）。参考件都在 [docs/reference/](../reference/)：学习笔记、速查、旧文。本文件说明这边引用了哪些参考件——**当前任务在用的在上，全部引用在下**。
> 参考件不是规范，结论以代码和实测为准。

## 当前任务（0.0.4 · 鉴权与前端登录态）在用

- [pinia.md](../reference/pinia.md)——store 怎么写、`useLocalStorage` 持久化、刷新后怎么恢复登录态
- [router-guards.md](../reference/router-guards.md)——导航守卫、返回值语义、`meta` 鉴权与跳转
- [form-errors.md](../reference/form-errors.md)——AxiosError 的结构、FastAPI 的 409 与 422 两种 `detail`
- [auth-form-parts.md](../reference/auth-form-parts.md)——认证表单能用哪些现成组件、有哪些缺口、数据层有哪几个入口
- [css.md](../reference/css.md)——选择器与优先级、flex、单位、状态伪类、scoped 样式的命中规则

## 全部引用

- [html-semantics.md](../reference/html-semantics.md)——语义化标签、表单与可访问性、Vue 与原生写法对照
- [js-methods.md](../reference/js-methods.md)——JavaScript 数组 / 对象 / 字符串常用方法与实测结果
- [vue-events.md](../reference/vue-events.md)——`@click="fn"` 与 `fn()` 的区别、事件修饰符、组件上的事件与 `v-model`
