<script setup>
import Link from '@/components/common/Link.vue'
import Icon from '@/components/common/Icon.vue'
</script>

<template>
  <footer>
    <div class="contact">
      <Link url="https://github.com/c23m">
        <Icon name="github" />
      </Link>
    </div>

    <div class="beian">
      <Link url="https://beian.miit.gov.cn/">皖ICP备2025089416号</Link>
    </div>

    <div class="copyright">&copy; 2026 grassit</div>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--color-bg-secondary);
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: var(--color-text-default);
  z-index: 5;
}

a {
  color: var(--color-text-default);
  margin: 0 10px;
}

a:hover {
  color: var(--color-text-strong);
  text-decoration: none;
}

.beian {
  margin-top: 15px;
  line-height: 1.8;
}

.copyright {
  margin-top: 15px;
}

@media screen and (min-width: 768px) {
  footer {
    padding: 30px 0;
  }
}
</style>
