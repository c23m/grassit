<script setup>
import { computed, ref } from 'vue'
import { get, useMediaQuery } from '@vueuse/core'
import NavBar from '@/components/layouts/nav/NavBar.vue'
import Footer from '@/components/layouts/Footer.vue'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Aside from '@/components/common/Aside.vue'
import RecommendCard from '@/components/misc/RecommendCard.vue'
import Button from '@/components/common/Button.vue'

import { useRequest } from 'vue-request'
import { getArticles } from '@/api/article'

const {
  data: articles,
  loading,
  error,
  refresh,
} = useRequest(() => getArticles())

const isDesktop = useMediaQuery('(min-width: 768px)')

const pictIndex = ref(0)
// 头图的三套背景渐变（按钮切换）。深色系配白字，避免整屏高亮刺眼
const colors = [
  'linear-gradient(to right bottom, #1d4ed8, #0e7490)',
  'linear-gradient(to right bottom, #b91c1c, #a21caf)',
  'linear-gradient(to right bottom, #15803d, #4d7c0f)',
]

const items = computed(() => {
  return (articles.value || []).map((item) => ({
    url: '/article/' + item.slug,
    title: item.title,
    subtitle: item.author.nickname,
  }))
})

const recommendations = [
  {
    title: '调试页',
    description:
      '开发自用的一页：登录、注册、接口测试都从这里进，省得手敲 url。上线前会删掉。',
    link: '/playground',
    image: 'test',
  },
  {
    title: '访问学校官网',
    description:
      '本站可以跳转到学校官网。真是一项实用的功能！本站可以跳转到学校官网。真是一项实用的功能啊！本站可以跳转到学校官网。真是一项实用的功能啊！',
    link: 'https://www.hfut.edu.cn',
    image: 'sunny',
  },
  {
    title: '请输入文本',
    description:
      '会跳转到本站测试界面。一个用来测试html/css/js的界面。会跳转到本站测试界面。一个用来测试html/css/js的界面。会跳转到本站测试界面。一个用来测试html/css/js的界面。',
    link: '/test',
    image: 'desert',
  },
  {
    title: '占位符',
    description:
      '盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。小草偷偷地从土里钻出来，嫩嫩的，绿绿的。',
    link: 'https://deepseek.com',
    image: 'dark',
  },
]
</script>

<template>
  <div class="layout">
    <header v-if="isDesktop" :style="{ background: colors.at(pictIndex) }">
      <h1>GRASSIT</h1>
      <p>
        欢迎来到本站！
        <br />
        可以在此进行学习。
      </p>
      <div>
        <Button @click="pictIndex = (pictIndex - 1) % colors.length"
          >&lt;</Button
        >
        <Button @click="pictIndex = (pictIndex + 1) % colors.length"
          >&gt;</Button
        >
      </div>
    </header>
    <NavBar />
    <main class="main">
      <Aside :items class="articles" id="articles"> 文章列表 </Aside>
      <section class="products">
        <h2>推荐列表</h2>
        <ul>
          <RecommendCard v-for="recommend in recommendations" :recommend />
        </ul>
      </section>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Header */
header {
  display: block flex;
  height: calc(100vh - 50px);
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to right bottom, #1d4ed8, #0e7490);
  color: #fff;
  transition: background-color 0.3s ease;
}

header h1 {
  background: linear-gradient(135deg, #6ee7b7, #7dd3fc, #a5b4fc);
  background-clip: text;
  color: transparent;
  font-size: 5rem;
  letter-spacing: 0.2em;
}

header p {
  font-size: 1.5rem;
  margin-top: 20px;
  opacity: 0.8;
  text-align: center;
}

header div {
  margin-top: 30px;
  display: flex;
  position: absolute;
  bottom: 100px;
  right: 40px;
}

header button {
  font-size: 2em;
  padding: 10px 20px;
  margin: 0 20px;
}

/* Main */
.main {
  width: 100%;
  display: grid;
  gap: 30px;
  padding: 20px;
  grid-template-columns: 1fr;
  grid-template-areas:
    'articles'
    'products';
}

/* Products */
.products {
  width: 100%;
  grid-area: products;
}

.products h2 {
  display: inline-block;
  font-size: 1.5em;
  margin: 20px 0;
  background-color: var(--color-bg-secondary);
  padding: 0.5em;
  border-radius: 20px;
  box-shadow: 0px 0px 10px var(--color-shadow);
}

.products ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 30px;
}

/* Articles */

@media screen and (min-width: 768px) {
  .main {
    grid-template-columns: 20em 1fr;
    grid-template-areas: 'articles products';
  }

  .main .image a {
    position: absolute;
    padding: 0.5rem 1rem;
    bottom: 20px;
    right: 20px;
    font-size: 30px;
  }

  .aside {
    width: unset;
  }

  .products {
    width: unset;
  }
}

@media screen and (min-width: 1024px) {
  .main {
    grid-template-columns: 25em 1fr;
  }
}

@media print {
  nav {
    display: none;
  }
}
</style>
