import { ref, watchEffect } from 'vue'

export async function useAsync(asyncFn, immediate = false) {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const execute = async (...args) => {
        loading.value = true
        error.value = null
        try {
            data.value = await asyncFn(...args)

        } catch (err) {
            error.value = err.message || '请求失败'
            throw err
        }
        finally {
            loading.value = false
        }
    }

    if (immediate) {
        watchEffect(() => {
            execute()
        })
    }

    return { data, loading, error, execute }
}