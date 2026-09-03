<script setup>
const { data, content } = defineProps({
    url: String
})

import { ref, computed } from 'vue'
import { marked } from 'marked'
import BaseLayout from '@/components/layouts/BaseLayout.vue';
import { get } from '@/utils';

const article = await get(`api/article/${url}`)

const html = computed(() => marked.parse(article.content))
</script>

<template>
    <BaseLayout>
        <aside class="menu"></aside>
        <article class="content" v-html="html">

        </article>
    </BaseLayout>
</template>

<style scoped></style>