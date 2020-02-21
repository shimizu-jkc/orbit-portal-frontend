<template>
  <figure>
    <img :src="imagesrc" alt=""/>
    <figcaption><i>{{ caption }}</i></figcaption>
  </figure>
</template>

<script>
export default {
  props: ['src', 'caption'],
  computed: {
    imagesrc () {
      return '/img/' + this.src
    }
  }
}
</script>