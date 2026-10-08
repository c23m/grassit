<script setup>
import { ref, computed } from 'vue'
import { useDark, useToggle, useMediaQuery } from '@vueuse/core'
import Icon from '@/components/common/Icon.vue'
import NavAvatar from '@/components/layouts/nav/NavAvatar.vue'
import { Link } from '@/components/common'
import logo from '@/assets/images/Grassit.png'
const menuOpen = ref(false)

const isDesktop = useMediaQuery('(min-width: 768px)')

const isDark = useDark()
// 模板里必须写成 toggleDark()，括号不能省：不带括号时 Vue 会把点击事件当参数传进来，
// useToggle 收到参数就"直接设值"，事件对象是真值 → 只会切到暗色，再也切不回来
const toggleDark = useToggle(isDark)

const theme = computed(() => (isDark.value ? 'dark' : 'light'))
</script>

<template>
  <nav>
    <a class="logo" :style="{ maskImage: `url(${logo})` }" href="/"></a>
    <ul v-if="isDesktop">
      <li>
        <Link url="/home">首页</Link>
      </li>
      <li>
        <Link url="/article">文档</Link>
      </li>
      <li>
        <Link url="/test">api测试</Link>
      </li>
      <li>
        <Link url="">文本</Link>
      </li>
    </ul>
    <div class="buttons">
      <Icon :name="theme" @click="toggleDark()" />

      <Icon v-if="!isDesktop" name="menu" @click="menuOpen = !menuOpen" />
    </div>

    <!-- 图标区与用户区之间的竖线；字重与颜色统一在 base.css 的 .divider 里 -->
    <span class="divider">|</span>

    <!-- 用户区只在宽屏出现，窄屏的入口收在下面的菜单面板里 -->
    <div class="user-slot">
      <NavAvatar />
    </div>

    <!-- 移动端菜单面板：窄屏没有 ul，链接和用户入口都收在这儿；点一下收起 -->
    <div v-if="!isDesktop && menuOpen" class="menu" @click="menuOpen = false">
      <Link url="/home">首页</Link>
      <Link url="/article">文档</Link>
      <Link url="/test">api测试</Link>
      <Link url="">文本</Link>
      <NavAvatar />
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: relative;
  display: flex;
  align-items: center;
  /* 宽屏下四个区域全交给 flex 分配：logo 固定、链接吃剩余、图标自动、用户自动。
       space-between 是留给移动端的——那时没有 ul 也没有用户区，靠它把图标顶到右边 */
  justify-content: space-between;
  box-shadow: 0 0 0.75rem var(--color-shadow);
  backdrop-filter: blur(4px);
  position: sticky;
  top: 0;
  height: var(--nav-height);
  /* 纵向留 0 是因为 .logo 取 height: 100%，上下再给内边距会把 logo 压矮 */
  padding: 0 1rem;
  background: var(--color-bg-primary);
  color: var(--color-text-strong);
  z-index: 20;
}

/* 导航链接：占住 logo 与功能图标之间的剩余空间，内容居中 */
ul {
  flex: 1;
  color: var(--color-text-default);
  display: flex;
  justify-content: center;
  white-space: nowrap;
  font-size: 1em;
  flex-flow: row;
  gap: 1.5rem;
  margin: 0;
}

ul a {
  color: var(--color-text-default);
}

ul a:hover {
  color: var(--color-link-hover);
  text-decoration: none;
}

/* 功能图标：宽度由内容决定，不参与伸缩 */
.buttons {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* 竖线与用户区都只在宽屏出现：窄屏的入口在菜单面板里 */
.divider,
.user-slot {
  display: none;
}

/* 移动端菜单面板：贴在导航栏下方，纵向排列 */
.menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-primary);
  box-shadow: 0 0.25rem 0.5rem var(--color-shadow);
  color: var(--color-text-default);
  font-size: 1em;
}

.menu a {
  color: var(--color-text-default);
}

.menu a:hover {
  color: var(--color-link-hover);
  text-decoration: none;
}

@media screen and (min-width: 768px) {
  .user-slot {
    display: flex;
  }

  /* 竖线靠自身外边距跟图标、用户区各留 1rem */
  .divider {
    display: inline;
    margin: 0 1rem;
  }
}

/* 图标 */

.logo {
  /* 宽度由 height + aspect-ratio 推出，本来就是固定值，这里只禁止被拉伸 */
  flex: none;
  aspect-ratio: 1280 / 720;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  height: 100%;
  width: auto;

  display: inline-block;
  background-color: var(--color-text-default);
}

.logo:hover {
  background-color: var(--color-text-strong);
}

@media print {
  nav {
    display: none;
  }
}
</style>

<style>
html {
  --nav-height: 3rem;
  scroll-padding-top: calc(var(--nav-height) + 0.5rem);
}
</style>
