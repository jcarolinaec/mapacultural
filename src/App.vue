<template>
  <section class="Application">
    <map-header></map-header>
    <router-view/>
  </section>
</template>

<script>

import MapHeader from '@/components/MapHeader.vue'

export default {
  name: 'App',
  components: {
    MapHeader
  }
}
</script>


<style lang="scss">

body {
  margin: 0;
  padding: 0;
}

.SitePopup {

  &-header {
    position: relative;
  }

  &-imageContainer {
    max-width: 263px;
    max-height: 113px;
    width: 263px;
    height: 113px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  &-image {
    width: 100%;
    height: auto;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  &-title {
    text-align: center;
  }

  &-content {
    text-align: justify;
  }

  & &-link {
    &,
    &:focus,
    &:visited,
    &:active {
      color: #c57130;
    }
  }

}

</style>
