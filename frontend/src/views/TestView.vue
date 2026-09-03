<script setup>

import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Button from '@/components/common/Button.vue'
import Link from '@/components/common/Link.vue';

import ArticleView from './ArticleView.vue';
</script>

<template>
    <BaseLayout>
        查看: <Button>Hello</Button>
        <p>获得更多.</p>
        <p>
            <Link href="https://example.com"> 一个链接 </Link>
        </p>

        <ArticleView url="html" />

    </BaseLayout>
</template>