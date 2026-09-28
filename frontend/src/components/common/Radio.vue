<script setup>
const { value, disabled } = defineProps({
    value: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const model = defineModel()
</script>

<template>
    <label>
        <input type="radio" :value v-model="model" :disabled />
        <slot></slot>
    </label>

</template>

<style scoped></style>