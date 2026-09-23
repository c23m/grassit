<script setup>
import { computed } from 'vue';
import github from '@/assets/icons/github.svg'
import menu from '@/assets/icons/menu.svg'
import light from '@/assets/icons/light.svg'
import dark from '@/assets/icons/dark.svg'

const icons = { github, menu, light, dark }
const { name, title } = defineProps({
    name: {
        type: String,
        required: true
    },
    title: String
})
</script>

<template>
    <span class="wrapper" :title>
        <span :style='{ maskImage: `url("${icons[name]}")` }' class="icon"></span>
    </span>
</template>

<style scoped>
.wrapper {
    cursor: pointer;
    display: inline-flex;
    justify-items: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
}

.wrapper:hover {
    background-color: var(--bg-secondary);
}

.icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: var(--text-default);
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
}
</style>