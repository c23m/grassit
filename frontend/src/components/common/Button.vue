<script setup>

const { type, disabled } = defineProps({
    type: {
        type: String,
        default: "button"
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <button :type :disabled>
        <slot>按钮</slot>
    </button>
</template>

<style scoped>
button {
    background-color: var(--link);
    color: var(--bg-secondary);
    font-size: 1em;
    border: none;
    border-radius: 0.5em;
    padding: 0.5em 1em;
}

button:hover {
    background-color: var(--link-hover);
    color: var(--bg-primary);
}

button:disabled {
    background-color: var(--border);
    color: var(--bg-secondary);
}
</style>