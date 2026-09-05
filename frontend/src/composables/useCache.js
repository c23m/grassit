import { ref, computed } from "vue";

export function useCache(name, unique = false, capacity = 20) {
    const items = ref([])
    const index = ref(0)

    const raw = localStorage.getItem(name)
    items.value = raw ? JSON.parse(raw) : []
    index.value = items.value.length - 1


    const current = computed(() => items.value[index.value] ?? null)

    const insert = (item) => {
        if (unique) {
            const existingIndex = items.value.indexOf(item)
            if (existingIndex !== -1) {
                items.value.splice(existingIndex, 1)
            }
        }
        items.value.push(item)

        if (items.value.length > capacity) {
            items.value.splice(0, items.value.length - capacity)
        }
        index.value = items.value.length - 1

        localStorage.setItem(name, JSON.stringify(items.value));
    }

    const indexInc = () => {
        if (index.value < items.value.length - 1) {
            index.value++
        }
    }

    const indexDec = () => {
        if (index.value > 0) {
            index.value--
        }
    }

    const clear = () => {
        items.value = []
        localStorage.setItem(name, '[]');
        index.value = 0
    }

    return { items, index, current, insert, indexInc, indexDec, clear }
}