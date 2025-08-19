<script lang="ts" setup>

</script>

<template>
  <div class="container">
    <!-- info -->
    <div class="profile">
      <div class="job">
        前端工程师
      </div>
      <div class="name">
        利威尔
      </div>
    </div>
    <!-- resume-section -->
    <section class="resume-section">
      <div class="sec-title">
        职业技能
      </div>
    </section>
    <!-- resume-item -->
    <div class="resume-item">
      <div class="item-left">
        杭州阅读科技有限公司
      </div>
      <div class="item-right">
        2023/02-至今
      </div>
    </div>
    <div class="content">
      <div class="resume-content-title">
        前端组长
      </div>
      <ul>
        <li>
          担任前端核心开发者，负责网易云音乐核心模块的开发和技术优化，采用React和
          TypeScript。
        </li>
        <li>
          担任前端核心开发者，负责网易云音乐核心模块的开发和技术优化，采用React和
          TypeScript。
        </li>
        <li>
          担任前端核心开发者，负责网易云音乐核心模块的开发和技术优化，采用React和
          TypeScript。
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 800px;
  margin: 0 auto;
}
.resume-section {
  border-bottom: 1px solid #d1d1d1;
  padding: 10px 0;
  margin: 10px 0;
}

.resume-section .sec-title {
  font-weight: bold;
  font-size: 18px;
}

.resume-item {
  display: flex;
  justify-content: space-between;
}

.resume-content-title {
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0 5px;
}
</style>
