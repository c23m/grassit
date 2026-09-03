<script setup>

import NavBar from '@/components/layouts/NavBar.vue';
import Footer from '@/components/layouts/Footer.vue';
import Button from '@/components/common/Button.vue'
import Link from '@/components/common/Link.vue';

import ArticleView from './ArticleView.vue';
</script>

<template>
    <div class="layout">
        <NavBar />
        <main>
            查看: <Button>Hello</Button>
            <p>获得更多.</p>
            <p>
                <Link url="https://example.com"> 一个链接 </Link>
            </p>
            <ArticleView url="html" />
        </main>
        <Footer />
    </div>
</template>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
}
</style>