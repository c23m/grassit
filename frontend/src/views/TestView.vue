<script setup>

import NavBar from '@/components/layouts/NavBar.vue';
import Footer from '@/components/layouts/Footer.vue';
import Button from '@/components/common/Button.vue'
import Link from '@/components/common/Link.vue';

import ArticleView from './ArticleView.vue';

import { onMounted, ref, reactive, computed } from 'vue'
import { get } from '@/utils/request.js';
import { useAsync } from '@/composables/useAysnc.js';

const form = reactive({
    method: 'get',
    url: '/api/test'
})

const { data, loading, error, execute } = useAsync(
    async (url) => {
        const response = await get(url)
        return response
    }, false
)

const request = ref({
    method: '',
    url: ''
})

const refresh = () => {
    request.value.method = form.method
    request.value.url = form.url
    execute(form.url)
}

onMounted(refresh)

</script>

<template>
    <div class="layout">
        <NavBar />
        <main>
            <h2>测试表单</h2>
            <form @submit.prevent="">
                <p>
                    <label>
                        请指定方法: <input type="radio" value="get" v-model="form.method" checked /> GET
                    </label>
                </p>
                <p>
                    <label>
                        请输入URL <input class="url-input" v-model="form.url" placeholder="/api/..." />
                    </label>
                </p>
                <Button @click="refresh"> 重新抓取 </Button>
            </form>
            <div>
                <h4>查询: {{ request.method.toUpperCase() }} {{ request.url }}</h4>

                <p v-if="loading">
                    加载中
                </p>
                <p v-else-if="error" class="error">
                    {{ error }}
                </p>
                <p v-else>
                    {{ JSON.stringify(data, null, 2) }}
                </p>
            </div>

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

p {
    margin: 30px 0;
}

h4 {
    margin-top: 60px;

}

main {
    flex: 1;
    padding: 40px;
}

.error {
    color: red;
}

.url-input {
    width: 800px;
}
</style>