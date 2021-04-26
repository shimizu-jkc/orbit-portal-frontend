<template>
  <div id="KnowledgeLink">
    <el-button type="text" icon="el-icon-reading" @click="onClick()"><strong>{{knowledge.Name}}</strong></el-button>
    <a id="HiddenLink" :href="url" target="_blank"></a>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeLink',
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      url: ""
    }
  },
  computed: {
    knowledge() {
      return this.$store.getters.getKnowledgeById(this.id);
    }
  },
  methods: {
    onClick() {
      if(this.knowledge.Link.Type === "INTERNAL"){
        this.$router.push({ path: this.knowledge.Link.Path });
      }else if(this.knowledge.Link.Type === "EXTERNAL"){
        this.url = this.knowledge.Link.Url;
        document.getElementById("HiddenLink").click();
      }else{
        console.error(`Not support link type [${this.knowledge.Link.Type}]`);
      }
    }
  }
}
</script>
<style>
.el-button--text {
  font-size: 16px;
  color: #1761b4;
}
</style>