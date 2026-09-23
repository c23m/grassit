<script setup>

import NavBar from '@/components/layouts/NavBar.vue';
import Footer from '@/components/layouts/Footer.vue';
import Button from '@/components/common/Button.vue'
import Link from '@/components/common/Link.vue';

import ArticleView from './ArticleView.vue';

import { onMounted, ref, computed } from 'vue'
import { get } from '@/utils/request.js';
import { useAsync } from '@/composables/useAysnc.js';

const { data, loading, error, execute } = useAsync(
    () => get("/api/test/time/now"),
    true
)

const refresh = () => {
    execute()
}

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

            <p v-if="loading">
                加载中
            </p>
            <p v-else-if="error">
                出错: {{ error }}
            </p>
            <p v-else>
                查询时间: {{ data?.time }}
            </p>
            <Button @click="refresh">刷新时间</Button>

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