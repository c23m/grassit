<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import { useAsync } from '@/composables/useAysnc'
// import { get } from '@/utils/request';
import Aside from '@/components/common/Aside.vue'

const { identifier } = defineProps({
    identifier: {
        type: String,
        required: true,
    },
})

// const article = ref({
//     title: '',
//     content: '',
//     slug: '',
//     uuid: '',
//     author: {
//         username: '',
//         nickname: ''
//     },
//     createdAt: ' ',
//     updatedAt: ' ',
// })

// const content = ref('')

// const { data, loading, error, execute } = useAsync(async (url) => {

//     const response = await get(url)
//     return response
// }
// )

// watch(data, () => {
//     article.value = data.value
//     if (article.value.content) {
//         content.value = marked.parse(article.value.content)
//     }
// })

// onMounted(() => {
//     execute(`/api/article/${identifier}`)
// }
// )
</script>

<template>
    <!-- <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="container">
        <Aside :items="[]" class="menu"> 目录 </Aside>
        <div class="content">
            <h2>{{ article.title }}</h2>
            <div class="info">
                <span class="author"> {{ article.author.nickname }} </span>
                <span class="date">{{ article.updateTime }}</span>
            </div>
            <article class="markdown-body" v-html="content"></article>
        </div>

    </div> -->
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

.info {
    color: var(--text-weak);
    font-weight: 400;
}
</style>
