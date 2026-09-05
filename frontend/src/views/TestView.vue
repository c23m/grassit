<script setup>

import NavBar from '@/components/layouts/NavBar.vue';
import Footer from '@/components/layouts/Footer.vue';
import Button from '@/components/common/Button.vue'
import Link from '@/components/common/Link.vue';

import ArticleView from './ArticleView.vue';

import { onMounted, ref, reactive } from 'vue'
import { get } from '@/utils/request.js';
import { useAsync } from '@/composables/useAysnc.js';
import { request } from '@/utils/request.js';
import Radio from '@/components/common/Radio.vue';

const form = reactive({
    method: 'GET',
    target: '/api/',
    body: ''
})

const { data, loading, error, execute } = useAsync(async (form) => {

    const response = await request(form.target, {
        method: form.method,
        headers: {
            "Content-Type": "application/json"
        },
        body: form.method === "GET" ? null : JSON.stringify(form.body)
    })
    return response
}
)

const refresh = () => {
    execute(form)
}

onMounted(() => {
    form.method = 'GET'
    refresh()
})

</script>

<template>
    <div class="layout">
        <NavBar />
        <main>
            <form @submit.prevent="refresh">
                <h2>测试表单</h2>
                <fieldset>
                    <legend>
                        方法
                    </legend>
                    <div class="method">
                        <Radio value="GET" v-model="form.method"> GET </Radio>
                        <Radio value="POST" v-model="form.method"> POST </Radio>
                        <Radio value="PUT" v-model="form.method"> PUT </Radio>
                        <Radio value="DELETE" v-model="form.method"> DELETE </Radio>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        目标
                    </legend>
                    <input class="target" v-model="form.target" placeholder="/api/..." @keyup.enter="refresh" />
                </fieldset>
                <fieldset>
                    <legend>主体</legend>
                    <code><pre><textarea class="request-body" v-model="form.body"></textarea></pre></code>
                </fieldset>
                <Button type="submit"> 请求 </Button>
            </form>
            <div class="query">
                <h3>查询结果</h3>
                <p v-if="loading">
                    加载中
                </p>
                <p v-else-if="error" class="error">
                    {{ error }}
                </p>
                <code v-else><pre>{{ JSON.stringify(data, null, 2) }}</pre></code>
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

h3 {
    margin-bottom: 30px;
}

main {
    display: flex;
    flex: 1;
    padding: 40px;
}

form {
    width: 50vw;
}

fieldset {
    margin: 20px 0;
}

.method label {
    margin-right: 20px;
}

.request-body {
    width: 600px;
    height: 200px;
}

.error {
    color: red;
}

.query {
    padding: 20px;
    border: 1px var(--boeder);
}

pre {
    font-family: 'consolas';

    white-space: pre-wrap;
    word-wrap: break-word;

}

.target {
    width: 600px;
    font-family: "consolas";
}
</style>