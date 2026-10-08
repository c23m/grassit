<script setup>
import { storeToRefs } from 'pinia'
import Link from '@/components/common/Link.vue'
import { useAuthStore } from '@/stores/auth'

// 未登录时 user 是 null，改显示「注册 | 登录」。
// 必须走 storeToRefs：直接解构 store 拿到的是快照，之后 user 变了组件不会更新
const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <div class="user">
    <Link v-if="user" :url="`/user/${user.username}`">{{ user.nickname }}</Link>
    <template v-else>
      <Link url="/register">注册</Link>
      <Link url="/login">登录</Link>
    </template>
  </div>
</template>

<style scoped>
/* 只管内容长相；在哪儿出现（宽屏导航栏 / 窄屏菜单面板）由 NavBar 决定 */
.user {
  flex: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
}

.user a {
  color: var(--color-text-default);
}

.user a:hover {
  color: var(--color-link-hover);
  text-decoration: none;
}
</style>
