<script setup>
const { url, title } = defineProps(['url', 'title'])
const isExternal = typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))
</script>

<template>
    <RouterLink v-if="!isExternal" :to="url" :title $attr>
        <slot></slot>
    </RouterLink>
    <a v-else :href="url" :title target="_blank" rel="noopener noreferre" $attr>
        <slot></slot>
    </a>
</template>

<style scoped>
a {
    color: var(--link);
}

a:hover {
    color: var(--link-hover);
}

.no-underline {
    text-decoration: none;
}
</style>