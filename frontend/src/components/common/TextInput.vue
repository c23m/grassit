<script setup>
const { type, placeholder, disabled } = defineProps({
    type: {
        type: String,
        default: 'text',
    },
    placeholder: String,
    disabled: {
        type: Boolean,
        default: false,
    },
})

const model = defineModel()
</script>

<template>
    <input :type v-model="model" :placeholder :disabled />
</template>

<style scoped>
input {
    padding: 3px;
    background-color: var(--color-bg-secondary);
    border: 2px var(--color-text-weak) solid;
    border-radius: 4px;
    outline: none;
}

input:hover {
    border-color: var(--color-text-default);
}

input:focus {
    border-color: var(--color-text-strong);
}

input:disabled {
    border-color: var(--color-text-weak);
    background-color: var(--color-bg-primary);
}
</style>
