import { ref, computed } from 'vue'

// 定长「最近使用」列表：整份列表存 localStorage，并带一个指针在这份列表里前后翻。
// 适合历史类小功能（搜索历史、上次登录用的用户名、最近编辑的草稿）。
// 两个已知边界：返回的 ref 挂在对象上，模板里不会自动解包，要用就顶层解构出来；
// 只在 setup 时读一次 localStorage，不跨标签页同步。
// 目前全仓没有调用点（唯一用过的 views/ApiTest.vue 已删），留着备用。
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

    localStorage.setItem(name, JSON.stringify(items.value))
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
    localStorage.setItem(name, '[]')
    index.value = 0
  }

  return { items, index, current, insert, indexInc, indexDec, clear }
}
