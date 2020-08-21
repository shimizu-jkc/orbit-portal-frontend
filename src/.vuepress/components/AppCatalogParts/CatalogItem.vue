<template>
  <div id="CatalogItem">
    <el-row type="flex" justify="end">
      <el-button type="primary" plain @click="onClickBack()">一覧に戻る</el-button>
    </el-row>
    <el-tabs v-model="active">
      <el-tab-pane label="概要" name="overview">
        <iframe 
          class="catalog-inline" 
          frameborder="0" 
          src="/overview.html">
        </iframe>
      </el-tab-pane>
      <el-tab-pane label="使い方" name="manual">
        <iframe 
          class="catalog-inline" 
          frameborder="0" 
          src="/manual.html"></iframe>
      </el-tab-pane>
      <el-tab-pane label="アーキテクチャ" name="arch">
        <img src="/img/baseline_architecture.png#" alt=""/>
      </el-tab-pane>
      <el-tab-pane label="API仕様" name="api">
        <iframe 
          class="catalog-inline"
          src="https://s3-ap-northeast-1.amazonaws.com/ap-northeast-1.usermanagement.orbit-catalog.artifact/v0.9.8/html/api.html"
        ></iframe>
      </el-tab-pane>
      <el-tab-pane label="ダウンロード" name="download">
        <iframe 
          class="catalog-inline" 
          frameborder="0" 
          src="/download.html"></iframe>
      </el-tab-pane>
      <el-tab-pane label="リリースノート" name="release">
        <iframe 
          class="catalog-inline" 
          frameborder="0" 
          src=""></iframe>
      </el-tab-pane>
      <el-tab-pane label="ヒント" name="tips">
        <iframe 
          class="catalog-inline" 
          frameborder="0" 
          src="/tips.html"></iframe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "CatalogItem",
  data(){
    return {
      active: "overview"
    }
  },
  methods: {
    onClickBack(){
      this.$router.push({
        path: "/catalog/list.html"
      });
    }
  }
}
</script>
<style scoped>
.catalog-inline {
  width: 100%;
  height: 1500px;
}
</style>