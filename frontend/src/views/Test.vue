<script setup>
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRequest } from 'vue-request'
import { Button, Link, Radio, TextInput, Textarea } from '@/components/common'
import request from '@/utils/request'
import { useAuthStore } from '@/stores/auth'

// 调试页（原 Playground 与原 ApiTest 合并而成，路由 /test）：
// 左列放各种临时内容，右列是接口测试。登录/注册有真页面了，这里不再重复实现
const auth = useAuthStore()
const { user } = storeToRefs(auth)

// —— 左列：后端连通性 ——
const { data, loading, error, refresh } = useRequest(() => request.get('/test'))

// 字段名跟着后端的 camelCase 别名走（BaseSchema 配了 to_camel），别写成 db_status
const dbOk = computed(() => data.value?.dbStatus === 'OK')
const time = computed(() =>
  data.value?.time ? new Date(data.value.time).toLocaleString() : '—',
)
const errorText = computed(
  () => error.value?.response?.data?.detail ?? error.value?.message ?? '',
)

// —— 右列：接口测试 ——
// 表单只活在内存里：写完即用，不记历史（原来那套 useCache 历史已经砍掉）
const form = reactive({
  method: 'GET',
  target: '/test',
  body: '',
})

const result = ref(null)
const failure = ref('')
const sending = ref(false)
// 结果卡片上标一下这次请求的是什么，好跟结果对上
const sentRequest = ref('')

// 请求体按 JSON 解析：空着就是不带 body，写错了直接报出来，别原样发出去
const parseBody = () => {
  if (!form.body.trim()) return undefined
  try {
    return JSON.parse(form.body)
  } catch {
    throw new Error('请求体不是合法 JSON')
  }
}

const send = async () => {
  if (!form.target.trim()) {
    failure.value = '目标不能为空'
    return
  }
  failure.value = ''
  sending.value = true
  sentRequest.value = `${form.method} ${form.target}`
  try {
    result.value = await request(form.target, {
      method: form.method,
      data: form.method === 'GET' ? undefined : parseBody(),
    })
  } catch (err) {
    result.value = null
    failure.value = err.response?.data?.detail ?? err.message ?? '请求失败'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="test">
    <h2>Test</h2>

    <div class="columns">
      <!-- 左列：临时内容。以后再试什么，往这一列末尾再加一个 .card -->
      <div class="column">
        <div class="card">
          <h3>登录态</h3>
          <dl class="fields">
            <dt>当前用户</dt>
            <dd v-if="user">{{ user.nickname }}（{{ user.username }}）</dd>
            <dd v-else class="muted">未登录</dd>
          </dl>
          <p v-if="user">
            <Button @click="auth.logout()">退出登录</Button>
          </p>
          <!-- 登录页和注册页是游客页：已登录再点会被守卫送回首页，所以入口只在未登录时给 -->
          <p v-else class="entries">
            <Link url="/login">登录</Link>
            <Link url="/register">注册</Link>
          </p>
        </div>

        <div class="card">
          <div class="card-head">
            <h3>后端连通性</h3>
            <Button :disabled="loading" @click="refresh()">
              {{ loading ? '请求中…' : '重新请求' }}
            </Button>
          </div>

          <p v-if="error" class="error" role="alert">{{ errorText }}</p>
          <dl v-else class="fields">
            <dt>时间</dt>
            <dd>{{ loading ? '—' : time }}</dd>
            <dt>版本</dt>
            <dd>{{ loading ? '—' : (data?.version ?? '—') }}</dd>
            <dt>数据库</dt>
            <dd>
              <span v-if="loading" class="muted">—</span>
              <span v-else :class="dbOk ? 'ok' : 'bad'">
                {{ data?.dbStatus ?? '—' }}
              </span>
            </dd>
          </dl>
        </div>
      </div>

      <!-- 右列：接口测试（原 ApiTest.vue 的功能） -->
      <div class="column">
        <div class="card">
          <h3>接口测试</h3>
          <form @submit.prevent="send">
            <div class="group">
              <span class="label">方法</span>
              <div class="methods">
                <Radio v-model="form.method" value="GET">GET</Radio>
                <Radio v-model="form.method" value="POST">POST</Radio>
                <Radio v-model="form.method" value="PUT">PUT</Radio>
                <Radio v-model="form.method" value="DELETE">DELETE</Radio>
              </div>
            </div>

            <div class="group">
              <span class="label">目标</span>
              <TextInput
                class="mono wide"
                v-model="form.target"
                placeholder="/test"
                @keyup.enter="send"
              />
            </div>

            <div class="group">
              <span class="label">请求体（JSON，GET 不用）</span>
              <Textarea
                class="mono wide"
                v-model="form.body"
                :disabled="form.method === 'GET'"
                placeholder='{"key": "value"}'
              />
            </div>

            <div class="actions">
              <Button type="submit" :disabled="sending">
                {{ sending ? '请求中…' : '请求' }}
              </Button>
            </div>
          </form>
        </div>

        <div class="card">
          <div class="card-head">
            <h3>结果</h3>
            <span v-if="sentRequest" class="muted mono">{{ sentRequest }}</span>
          </div>

          <p v-if="failure" class="error" role="alert">{{ failure }}</p>
          <pre v-else-if="result !== null">{{
            JSON.stringify(result, null, 2)
          }}</pre>
          <p v-else class="muted">还没发过请求</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.test {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.entries {
  display: flex;
  gap: 1rem;
}

/* 左列临时内容 + 右列接口测试；窄屏收成一列 */
.columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 1.5rem;
  align-items: start;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* 字段用 grid 排：标签一列、值一列，窄屏也不会错行 */
.fields {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 0.5rem 1rem;
}

.fields dt {
  color: var(--color-text-weak);
}

/* 接口测试：一组 = 标签（右边可挂历史翻页）+ 控件 */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.label {
  font-size: 0.875rem;
  color: var(--color-text-weak);
}

.methods {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.methods label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

/* 路径与 JSON 用等宽字体：值里对齐要求高 */
.mono {
  font-family: consolas, monospace;
}

.wide {
  width: 100%;
}

pre {
  margin: 0;
  padding: 1rem;
  min-height: 6rem;
  max-height: 22rem;
  overflow: auto;
  background-color: var(--color-bg-primary);
  border-radius: 0.5rem;
  font-family: consolas, monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.muted {
  color: var(--color-text-weak);
}

.ok {
  color: var(--color-success);
}

.bad {
  color: var(--color-warning);
}

.error {
  color: var(--color-danger);
}

@media (max-width: 900px) {
  .columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
