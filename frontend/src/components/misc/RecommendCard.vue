<script setup>
import sunny from "@/assets/images/sunny.png"
import dessert from "@/assets/images/dessert.png"
import dark from "@/assets/images/dark.png"
import Link from '../common/Link.vue';
import Button from '../common/Button.vue';
const { recommend } = defineProps(['recommend'])
const images = { sunny, dessert, dark }
</script>

<template>
    <li>
        <div class="info">
            <h3>
                {{ recommend.title }}
            </h3>
            <p>
                {{ recommend.description }}
            </p>
        </div>
        <div class="image-div" :style='{ backgroundImage: `url("${images[recommend.image]}")` }'>
            <Link :href="recommend.link">
                &rightarrow;
            </Link>
        </div>
    </li>
</template>

<style scoped>
li {
    width: 100%;
    height: unset;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 10px var(--shadow);
    transition: all, 0.2s;
    border-radius: 20px;
}

.info {
    padding: 10px;
    width: 100%;
    overflow: hidden;
}

h3 {
    font-size: 2em;
    margin: 10px 0;
    text-align: center;
}

p {
    width: 100%;
    font-size: 1.2em;
    padding: 0 20px;
}

.image-div {
    order: -1;
    height: 150px;
    width: 100%;
    border-radius: 20px;
    background: center/cover no-repeat;
    position: relative;
}

a {
    position: absolute;
    padding: 0.5rem 1rem;
    bottom: 20px;
    right: 20px;
    font-size: 20px;
    color: var(--link-hover);
    border: 2px solid var(--link-hover);
    background-color: var(--bg-secondary);
    opacity: 0.8;
    border-radius: 20%;
}

a:hover {
    color: var(--bg-secondary);
    background-color: var(--link-hover);
    text-decoration: none;
    opacity: 1;
}

@media screen and (min-width: 768px) {
    li {
        height: unset;
    }
}

@media screen and (min-width: 1024px) {
    li {
        max-width: 800px;
        height: 300px;
        flex-direction: row;
    }

    .image-div {
        max-width: 40%;
        height: 100%;
        order: 1;
    }
}
</style>