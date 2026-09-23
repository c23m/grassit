<script setup>
const { data, content } = defineProps({
    data: Object,
    content: String
})

import { ref, computed } from 'vue'
import { marked } from 'marked'
import BaseLayout from '@/components/layouts/BaseLayout.vue';

const html = computed(() => marked.parse(content))
</script>

<template>
    <BaseLayout>
        <aside class="menu"></aside>
        <article class="content" v-html="html"></article>
    </BaseLayout>
</template>

<style scoped></style>