<script setup>
const { placeholder, disabled } = defineProps({
    placeholder: String,
    disabled: {
        type: Boolean,
        default: false
    }
})

const model = defineModel()
</script>

<template>
    <input type="text" v-model="model" :placeholder :disabled />
</template>

<style scoped>
input {
    padding: 3px;
    background-color: var(--bg-secondary);
    border: 2px var(--text-weak) solid;
    border-radius: 4px;
    outline: none;
}

input:hover {
    border-color: var(--text-default);
}

input:focus {
    border-color: var(--text-strong);
}

input:disabled {
    border-color: var(--text-weak);
    background-color: var(--bg-primary);
}
</style>