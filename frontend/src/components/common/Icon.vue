<script setup>
import IconGithub from '~icons/mdi/github'
import IconLight from '~icons/material-symbols/light-mode-outline-rounded'
import IconDark from '~icons/material-symbols/dark-mode-outline-rounded'
import IconMenu from '~icons/material-symbols/menu-rounded'
import IconTranslate from '~icons/material-symbols/translate-rounded'
import IconExternal from '~icons/material-symbols/open-in-new-rounded'

const icons = {
    github: IconGithub,
    light: IconLight,
    dark: IconDark,
    menu: IconMenu,
    translate: IconTranslate,
    external: IconExternal
}

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
        <component :is="icons[name]" v-if="icons[name]" class="icon" />
    </span>
</template>

<style scoped>
.wrapper {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
}

.wrapper:hover {
    background-color: var(--bg-secondary);
}

.icon {
    display: inline-block;
    color: var(--text-default);
    width: 24px;
    height: 24px;
}
</style>