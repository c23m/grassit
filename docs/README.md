# 文档地图

> 本仓库唯一的文档地图，说明每份文档管什么、现在能不能删。写法与删除规则见 [AGENTS.md](../AGENTS.md) 的「文档约定」一节。
> 参考笔记不是规范，结论以代码和实测为准。

## 怎么判断一份新文档放哪

1. **过了当前阶段就没用了** → `guides/`（临时，做完即删）
2. **长期有效**：
   - 限定某个领域、写的是「该领域该长什么样」 → `specs/`
   - 学习、总结、速查 → `notes/`
   - 跨领域、最要紧的（需求、计划） → `docs/` 根下

## docs/ 根下（跨领域、长期）

| 文件                       | 职责                                                         |
| -------------------------- | ------------------------------------------------------------ |
| [planning.md](planning.md) | 产品需求：目标与范围、用户、认证、文章、存储、接口、待定事项 |
| [todo.md](todo.md)         | 版本规划、详细待办与验收标准，只保留未完成的版本             |

## specs/ · 领域规范与定案（长期维护，越写越细）

| 文件                                 | 状态   | 职责                                               |
| ------------------------------------ | ------ | -------------------------------------------------- |
| [components.md](specs/components.md) | 已定案 | 前端页面与组件的结构基准；加页面、改组件前先对齐它 |
| [deploy.md](specs/deploy.md)         | 未开始 | 生产环境部署方案：架构、服务器目录、配置、容器     |

## guides/ · 临时指南（跟着任务走，做完即删）

现在为空。0.0.4 的三份指南已按"做完即删"处理，可用部分提炼进了 notes：`form-errors.md` 整体提升为 [notes/form-errors.md](notes/form-errors.md)，`auth-form-parts.md` 提炼进 [notes/frontend-parts.md](notes/frontend-parts.md)，`ai-changes-0.0.4.md` 的排查过程提炼进 [notes/login-state-recovery.md](notes/login-state-recovery.md)。原文件可用 `git show 866ebf9:docs/guides/ai-changes-0.0.4.md` 取回。

## notes/ · 学习与速查（不绑任务，没有约束力）

| 文件                                                               | 用途 | 一句话                                                     |
| ------------------------------------------------------------------ | ---- | ---------------------------------------------------------- |
| [project-primer.md](notes/project-primer.md)                       | 通读 | 面向零基础的全项目知识导读（6 类 71 条）                   |
| [login-state-recovery.md](notes/login-state-recovery.md)           | 通读 | 「刷新后登录态没了」的复盘：两个原因与可复用的排查套路     |
| [jwt.md](notes/jwt.md)                                             | 通读 | JWT 结构、签名与校验；access / refresh 靠 payload 区分     |
| [sqlalchemy.md](notes/sqlalchemy.md)                               | 通读 | ORM 思路、Model、Engine 与 Session、CRUD、查询与表关系     |
| [sqlalchemy-pydantic-types.md](notes/sqlalchemy-pydantic-types.md) | 速查 | SQLAlchemy 字段类型与 Pydantic 类型的对应                  |
| [pinia.md](notes/pinia.md)                                         | 速查 | store 怎么写、持久化、刷新后恢复登录态                     |
| [router-guards.md](notes/router-guards.md)                         | 速查 | 导航守卫、返回值语义、meta 鉴权与跳转                      |
| [vue-events.md](notes/vue-events.md)                               | 速查 | @click 两种写法、修饰符、组件事件与 v-model                |
| [css.md](notes/css.md)                                             | 速查 | 选择器与优先级、flex、单位、状态伪类、scoped 命中规则      |
| [html-semantics.md](notes/html-semantics.md)                       | 速查 | 语义化标签、表单与可访问性、Vue 与原生写法对照             |
| [js-methods.md](notes/js-methods.md)                               | 速查 | JS 数组 / 对象 / 字符串常用方法与实测结果                  |
| [regex.md](notes/regex.md)                                         | 速查 | 正则速查与 Pydantic pattern 的匹配语义                     |
| [form-errors.md](notes/form-errors.md)                             | 速查 | AxiosError 结构、409 / 422 的 detail 怎么转人话、提交链路  |
| [frontend-parts.md](notes/frontend-parts.md)                       | 速查 | common 组件的 props 与默认值、数据层入口、几个 import 的坑 |
| [resume.md](notes/resume.md)                                       | 参考 | 个人简历                                                   |

## 仓库根目录（不在 docs/ 下）

| 文件                            | 职责                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| [AGENTS.md](../AGENTS.md)       | 协作规范：结构、命令、风格、后端异步红线、文档约定、提交与版本、协作分工 |
| [HANDOVER.md](../HANDOVER.md)   | 交接快照：现在在哪、下一步、已知问题                                     |
| [CHANGELOG.md](../CHANGELOG.md) | 已完成版本的重要变更                                                     |
| [README.md](../README.md)       | 项目说明与快速开始                                                       |
