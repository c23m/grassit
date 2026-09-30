# 前端文档索引

> 这个目录放**与前端当前工作直接相关**的文档，分两类：
>
> - **规范**：[components.md](components.md) 是页面与组件的结构基准，加页面、改组件前先对齐它
> - **任务指南**：为某个任务写的、照做就能落地的文档。任务做完、代码里已经有答案的就删掉，不留在仓库里
>
> 不绑任务的速查表与学习笔记在 [docs/reference/](../reference/)，本文件也说明这边引用了哪些。参考件不是规范，结论以代码和实测为准。

## 任务指南

- [auth-form-parts.md](auth-form-parts.md)——认证表单能用哪些现成组件、有哪些缺口、数据层有哪几个入口（0.0.4；Register 写完即删）
- [form-errors.md](form-errors.md)——AxiosError 的结构、FastAPI 的 409 与 422 两种 `detail` 怎么转人话（0.0.4；Register 写完即删）

## 当前任务（0.0.4 · 鉴权与前端登录态）在用的速查

- [pinia.md](../reference/pinia.md)——store 怎么写、`useLocalStorage` 持久化、刷新后怎么恢复登录态
- [router-guards.md](../reference/router-guards.md)——导航守卫、返回值语义、`meta` 鉴权与跳转
- [css.md](../reference/css.md)——选择器与优先级、flex、单位、状态伪类、scoped 样式的命中规则

## 全部引用

- [html-semantics.md](../reference/html-semantics.md)——语义化标签、表单与可访问性、Vue 与原生写法对照
- [js-methods.md](../reference/js-methods.md)——JavaScript 数组 / 对象 / 字符串常用方法与实测结果
- [vue-events.md](../reference/vue-events.md)——`@click="fn"` 与 `fn()` 的区别、事件修饰符、组件上的事件与 `v-model`
