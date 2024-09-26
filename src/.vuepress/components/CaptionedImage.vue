<template>
  <figure>
    <img :src="imagesrc" alt=""/>
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<script>
import Config from '../config'

export default {
  props: ['src', 'caption'],
  computed: {
    imagesrc () {
      return Config.base + 'img/' + this.src
    }
  }
}
</script>

<style scoped>
figcaption {
  font: italic bold smaller sans-serif;
  text-align: center;
}
</style>