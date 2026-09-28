<script setup>
import Link from '@/components/common/Link.vue';
</script>

<template>
    <footer>
        <div class="links">
            <Link url="#">关于</Link>
            <span class="divider">|</span>
            <Link url="#">联系</Link>
            <span class="divider">|</span>
            <Link url="#">查找</Link>
            <span class="divider">|</span>
            <Link url="#">发布</Link>
        </div>

        <div class="beian">
            <Link url="https://beian.miit.gov.cn/">皖ICP备2025089416号
            </Link>
            <span class="footer-divider">|</span>
            <Link url="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode= (公安备案号)">
                <!-- 此处添加公安备案号 -->
            </Link>
        </div>

        <div class="copyright">
            &copy; 2026 版权所有
        </div>

        <div class="notice">
            内容供个人学习交流使用
        </div>
    </footer>
</template>

<style scoped>
footer {
    background-color: var(--bg-secondary);
    padding: 20px 0;
    text-align: center;
    font-size: 14px;
    color: var(--text-default);
    z-index: 5;
}

.links {
    margin-bottom: 15px;
}

a {
    color: var(--text-default);
    margin: 0 10px;
}

a:hover {
    color: var(--text-strong);
    text-decoration: none;
}

.divider {
    margin: 0 5px;
    color: var(--text-weak);
}

.beian {
    margin-top: 15px;
    line-height: 1.8;
}

.copyright {
    margin-top: 15px;
}

.links a {
    display: block;
    margin: 5px 0;
}

.divider {
    display: none;
}

@media screen and (min-width: 768px) {

    footer {
        padding: 30px 0;
    }

    .links a {
        display: inline-block;
        margin: 0 10px;
    }

    .divider {
        display: inline-block;
    }
}
</style>