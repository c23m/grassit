<script setup>
import { ref, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import Icon from '@/components/common/Icon.vue'
import Link from '@/components/common/Link.vue'
import logo from '@/assets/images/Grassit.png'
// import Button from '@/components/common/Button.vue'
const theme = ref('')
const menuOpen = ref(false)

const isDesktop = useMediaQuery('(min-width: 768px)')

function applyTheme() {
    localStorage.setItem('theme', theme.value);
    document.documentElement.setAttribute('data-theme', theme.value)
}
function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyTheme();
}

onMounted(() => {
    theme.value = localStorage.getItem('theme') ?? 'dark';
    applyTheme();
})

</script>

<template>
    <nav>
        <a class="logo" :style="{ maskImage: `url(${logo})` }" href="/"></a>
        <ul v-if="isDesktop">
            <li><a href="/">首页</a></li>
            <li><a href="/article">文档</a></li>
            <li><a href="/test">测试</a></li>
            <li><a href="">文本</a></li>
            <li><a href="">文本</a></li>
        </ul>
        <div class="buttons">
            <Icon :name="theme" @click="toggleTheme" />

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
    box-shadow: 0 0 12px var(--shadow);
    backdrop-filter: blur(4px);
    position: sticky;
    top: 0;
    height: 50px;
    padding: 0 10px;
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
    gap: 20px;
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
    gap: 1em;
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