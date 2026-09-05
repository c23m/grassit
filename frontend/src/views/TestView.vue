<script setup>

import '@/assets/styles/base.css'
import NavBar from '@/components/layouts/NavBar.vue';
import Footer from '@/components/layouts/Footer.vue';

import ArticleView from './ArticleView.vue';

import { onMounted, ref, reactive, watch } from 'vue'
import { get } from '@/utils/request.js';
import { useAsync } from '@/composables/useAysnc.js';
import { useCache } from '@/composables/useCache.js';
import { request } from '@/utils/request.js';
import { Button, Radio, TextInput, TextArea } from '@/components/common';

const form = reactive({
    method: 'GET',
    target: '/api/',
    body: ''
})

const urlCache = useCache('url-cache', true)


const bodyCache = useCache('body-cache', true)



const { data, loading, error, execute } = useAsync(async (form) => {
    urlCache.insert(form.target)
    bodyCache.insert(form.body)
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

watch(() => urlCache.current.value, (newVal) => {
    form.target = newVal
})

watch(() => bodyCache.current.value, (newVal) => {
    form.body = newVal
})


onMounted(() => {
    if (urlCache.items.value) {
        form.target = urlCache.current.value
    }
    form.target = form.target ?? '/api/'
    if (bodyCache.items.value) {
        form.body = bodyCache.current.value
    }
    refresh()
})

const refresh = () => {
    execute(form)
}

const clear = () => {
    urlCache.clear()
    bodyCache.clear()
}

</script>

<template>
    <div class="layout">
        <NavBar />
        <main>
            <form @submit.prevent="refresh">
                <h2>测试表单</h2>
                <fieldset>
                    <legend>
                        <h4>方法</h4>
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
                        <h4>目标</h4>
                        <Button @click="urlCache.indexDec" :disabled="urlCache.index === 0">
                            &lt;
                        </Button>
                        <Button @click="urlCache.indexInc" :disabled="urlCache.index === urlCache.items.length">
                            &gt;
                        </Button>
                    </legend>
                    <TextInput class="target" v-model="form.target" placeholder="/api/..." @keyup.enter="refresh" />
                </fieldset>
                <fieldset>
                    <legend>
                        <h4>主体</h4>
                        <Button @click="bodyCache.indexDec" :disabled="bodyCache.index === 0">
                            &lt;
                        </Button>
                        <Button @click="bodyCache.indexInc" :disabled="bodyCache.index === bodyCache.items.length">
                            &gt;
                        </Button>
                    </legend>
                    <code><pre><TextArea class="request-body" v-model="form.body" :disabled="form.method === 'GET'" /></pre></code>
                </fieldset>
                <fieldset class="buttons">
                    <Button type="submit"> 请求 </Button>
                    <Button @click="" disabled> 上传文件 </Button>
                    <Button @click="clear"> 清除缓存 </Button>
                </fieldset>
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

h4 {
    display: inline;
    margin-right: auto;
}

main {
    display: flex;
    flex: 1;
    padding: 40px;
}

form {
    width: 50vw;
    padding: 1em;
}

fieldset {
    padding: 1em 0;
    width: 600px;
    margin: 20px 0;
}

legend {
    padding: 0 10px;
    display: flex;
    width: 600px;
    gap: 30px;
}

legend button {
    padding: 5px 10px;
}

.method label {
    margin-right: 20px;
}

.target {
    font-family: "consolas";
    width: 600px;
}

.request-body {
    width: 600px;
    height: 200px;
}

.buttons {
    display: flex;
    justify-content: space-between;
}

.error {
    color: red;
}

.query {
    padding: 20px;
}

pre {
    font-family: 'consolas';
    white-space: pre-wrap;
    word-wrap: break-word;

}
</style>