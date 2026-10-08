<script setup>
import Link from '@/components/common/Link.vue'
const { items } = defineProps({
  items: Array,
})
</script>

<template>
  <aside>
    <h2>
      <slot></slot>
    </h2>
    <ul>
      <li v-for="item in items" :key="item.url">
        <Link :url="item.url" class="no-underline">
          <h4>{{ item.title }}</h4>
          <p v-if="item.subtitle">{{ item.subtitle }}</p>
        </Link>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
aside {
  width: 100%;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0px 0px 10px var(--color-shadow);
  border-radius: 20px;
  background: var(--color-bg-secondary);
}

aside h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-border);
}

aside ul {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

li {
  padding: 10px;
  display: block;
  border-radius: 10px;
  background-color: var(--color-bg-secondary);
}

li:hover {
  background-color: var(--color-bg-primary);
  text-decoration: none;
}

li:hover h4 {
  color: var(--color-link-hover);
}

li:hover p {
  color: var(--color-link);
}

h4 {
  font-size: 1.2em;
  font-weight: 400;
  color: var(--color-text-strong);
}

p {
  font-style: italic;
  font-weight: 300;
  color: var(--color-text-weak);
}
</style>
