<script setup>
const { placeholder, disabled } = defineProps({
  placeholder: String,
  disabled: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel()
</script>

<template>
  <textarea v-model="model" :placeholder :disabled>
        <slot></slot>
    </textarea>
</template>

<style scoped>
textarea {
  padding: 3px;
  background-color: var(--color-bg-secondary);
  border: 2px var(--color-text-weak) solid;
  border-radius: 4px;
  outline: none;
  min-height: 100px;
  resize: vertical;
}

textarea:hover {
  border-color: var(--color-text-default);
}

textarea:focus {
  border-color: var(--color-text-strong);
}

textarea:disabled {
  background-color: var(--color-bg-primary);
  border-color: var(--color-text-weak);
}
</style>
