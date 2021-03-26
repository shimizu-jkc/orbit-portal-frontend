<template>
  <figure>
    <img :src="imagesrc" alt=""/>
    <div style="text-align:right">
      <figcaption><i>{{ caption }}</i></figcaption>
    </div>
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