<script setup name="Index">
  const title = import.meta.env.VITE_APP_TITLE
</script>
<template>
  <div class="home">
    <p class="text-4xl text-center mt-20">{{ title }}</p>
  </div>
</template>

<style scoped lang="scss">
  .home {
  }
</style>
