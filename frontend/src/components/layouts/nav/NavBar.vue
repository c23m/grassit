<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDark, useToggle, useMediaQuery } from '@vueuse/core'
import Icon from '@/components/common/Icon.vue'
import { Link } from '@/components/common'
import logo from '@/assets/images/Grassit.png'
const menuOpen = ref(false)

const isDesktop = useMediaQuery('(min-width: 768px)')

const isDark = useDark()
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
                <Link url="/playground">调试</Link>
            </li>
            <li>
                <Link url="">文本</Link>
            </li>
        </ul>
        <div class="buttons">
            <Icon :name="theme" @click="toggleDark" />

            <Link url="https://github.com/c23m">
                <Icon name="github" />
            </Link>
            <Icon v-if="!isDesktop" name="menu" @click="menuOpen = !menuOpen" />
        </div>
    </nav>
</template>

<style scoped>
nav {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 0.75rem var(--shadow);
    backdrop-filter: blur(4px);
    position: sticky;
    top: 0;
    height: var(--nav-height);
    padding: 0 0.5rem;
    background: var(--bg-primary);
    color: var(--text-strong);
    z-index: 20;
}

ul {
    color: var(--text-default);
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 1em;
    flex-flow: row;
    gap: 1.5rem;
    margin: 0 auto;
}

ul a {
    color: var(--text-default);
}

ul a:hover {
    color: var(--link-hover);
    text-decoration: none;
}

.buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

/* 图标 */

.logo {
    aspect-ratio: 1280 / 720;
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    height: 100%;
    width: auto;

    display: inline-block;
    background-color: var(--text-default);
}

.logo:hover {
    background-color: var(--text-strong);
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
