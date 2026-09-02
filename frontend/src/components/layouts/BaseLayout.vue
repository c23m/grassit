<script setup>
import '@/assets/styles/base.css'
import NavBar from '@/components/layouts/NavBar.vue'
import Footer from '@/components/layouts/Footer.vue'

</script>

<template>
    <div class="layout">
        <slot name="header"></slot>
        <NavBar />
        <main>
            <slot></slot>
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
</style>