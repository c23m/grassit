<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import BaseLayout from '@/components/layouts/BaseLayout.vue';
import { get } from '@/utils';
import Aside from '@/components/common/Aside.vue';

const { url } = defineProps({
    url: {
        type: String,
        required: true
    }
})

const loading = ref(false)
const error = ref(null)

const article = ref({
    content: '',
    slug: '',
    uuid: '',
})

const testArticle = {
    "attachments": null,
    "authorId": 3,
    "authorName": null,
    "content": "# 一级标题\n\n正文内容...\n\n## 二级标题\n\n更多内容...",
    "createdAt": "2026-09-02 19:17:10",
    "slug": "html",
    "toc": null,
    "updatedAt": "2026-09-02 19:17:12",
    "uuid": "123e4567-e89b-12d3-a456-426614174000"
}

const html = computed(() => {
    if (!article.value.content) return ''
    return marked.parse(article.value.content)
})

async function loadArticle() {

    try {
        const data = await get(`api/article/${url}`)
        article.value = data
    } catch (err) {
        error.value = err.message || '加载文章失败'
        console.error(error.value)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    // loadArticle()
    article.value = testArticle
})

</script>

<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="container">
        <Aside :items="[]" class="menu"> 目录 </Aside>
        <article class="content markdown-body" v-html="html"></article>
    </div>
</template>

<style scoped>
.loading,
.error {
    padding: 20px;
}

.error {
    color: red;
}

.container {
    display: flex;
    gap: 20px;

}

.menu {
    width: 240px;
    position: sticky;
    top: 20px;
    align-self: flex-start;

    max-width: calc(100vh - 40px);
    overflow-y: auto;
}

.content {
    padding: 40px;
    flex: 1;
}
</style>