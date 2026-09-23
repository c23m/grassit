import { ref } from 'vue'

export function useAsync(asyncFn) {
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
            console.error(err)
        }
        finally {
            loading.value = false
        }
    }
    return { data, loading, error, execute }
}