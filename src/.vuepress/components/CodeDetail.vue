<template>
  <details>
    <summary>{{title}}</summary>
    <pre><code>{{code}}</code></pre> 
  </details>
</template>

<script>
export default {
  name: "CodeDetail",
  props: {
    title: {
      type: String,
      default: "title"
    },
    code: {
      type: String,
      default: "code"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only
<style scoped lang="styl">
details {
  border-radius: 3px;
  background: #EEE;
}
details summary {
    font-size: 17px;
    vertical-align: top;
    background: #333;
    color: #FFF;
    border-radius: 3px;
    /* padding: 5px 10px; */
    padding: 5px 0px;
    outline: none;
    font-weight: bold;
}
</style>
-->