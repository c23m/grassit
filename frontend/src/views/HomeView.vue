<script setup>
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import '@/assets/styles/base.css'
import NavBar from '@/components/layouts/NavBar.vue'
import Footer from '@/components/layouts/Footer.vue'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Aside from '@/components/common/Aside.vue'
import RecommendCard from '@/components/misc/RecommendCard.vue'
import Button from '@/components/common/Button.vue'
const isDesktop = useMediaQuery('(min-width: 768px)')

const pictIndex = ref(0)
const colors = ["linear-gradient(to right bottom, #33e, #3ee)",
    "linear-gradient(to right bottom, #e33, #e3e)",
    "linear-gradient(to right bottom, #3e3, #ee3)"]

const articles = [
    {
        slug: "dog",
        title: "Dog",
        subtitle: "Development of Grassit"
    },
    {
        slug: "deswaq",
        title: "DESWAQ",
        subtitle: "Disappeared Entrance: Start Without Any Quests"
    }
]

const recommendations = [
    {
        title: "访问学校官网",
        description: "本站可以跳转到学校官网。真是一项实用的功能！本站可以跳转到学校官网。真是一项实用的功能啊！本站可以跳转到学校官网。真是一项实用的功能啊！",
        link: "https://www.hfut.edu.cn",
        image: "sunny"
    },
    {
        title: "请输入文本",
        description: "会跳转到本站测试界面。一个用来测试html/css/js的界面。会跳转到本站测试界面。一个用来测试html/css/js的界面。会跳转到本站测试界面。一个用来测试html/css/js的界面。",
        link: "/test",
        image: "dessert"
    },
    {
        title: "占位符",
        description: "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。小草偷偷地从土里钻出来，嫩嫩的，绿绿的。",
        link: "https://deepseek.com",
        image: "dark"
    }
]
</script>

<template>
    <div class="layout">
        <header v-if="isDesktop" :style="{ background: colors.at(pictIndex) }">
            <h1>GRASSIT</h1>
            <p>
                欢迎来到本站！
                <br>
                可以在此进行学习。
            </p>
            <div>
                <Button @click="pictIndex = (pictIndex - 1) % colors.length">&lt;</Button>
                <Button @click="pictIndex = (pictIndex + 1) % colors.length">&gt;</Button>
            </div>
        </header>
        <NavBar />
        <main class="main">
            <Aside title="文章列表" :items="articles" class="articles" id="articles" />
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
    background: linear-gradient(to right bottom, #33e, #3ee);
    color: #fff;
    transition: background-color 0.3s ease;
}

header h1 {
    background: linear-gradient(135deg, #3e3, #3ec, #3ac);
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
        "articles"
        "products"
    ;
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
    background-color: var(--bg-secondary);
    padding: 0.5em;
    border-radius: 20px;
    box-shadow: 0px 0px 10px var(--shadow);
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
        grid-template-areas:
            "articles products"
        ;
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