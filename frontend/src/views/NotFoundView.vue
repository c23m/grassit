<script setup>
import { ref } from 'vue';
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Link from '@/components/common/Link.vue';

const seconds = ref(10)
const timer = setInterval(() => {
    seconds.value--
    if (seconds.value <= 0) {
        clearInterval(timer)
        location.href = '/'
    }
}, 1000)
</script>

<template>
    <BaseLayout class="not-found">
        <div class="main">
            <h2>页面没找到</h2>
            <p>请检查URL, 再试一次。</p>
            <p><strong>将在{{ seconds }}秒后返回首页...</strong></p>
            <p>手动<Link href="/">返回主页</Link>
            </p>
        </div>
    </BaseLayout>
</template>

<style scoped>
p {
    margin: 1em;
}

.main {
    padding: 40px;
}
</style>