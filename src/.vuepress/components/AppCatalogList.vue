<template>
  <div id="AppCatalogList">
    <el-row :gutter="20" type="flex" align="middle">
      <el-col :span="14">
        <span>キーワード</span>
        <el-input
          v-model="keyword"
          placeholder="カタログ名で検索"
          prefix-icon="el-icon-search"
          size="small"
        ></el-input>
      </el-col>
    </el-row>
    <el-table :data="catalogs">
      <el-table-column sortable prop="Name" label="カタログ名"></el-table-column>
      <el-table-column sortable prop="Type" label="提供形式"></el-table-column>
      <el-table-column sortable prop="Genre" label="ジャンル"></el-table-column>
      <el-table-column sortable prop="Vender" label="対応ベンダ"></el-table-column>
      <el-table-column sortable prop="Version" label="最新バージョン"></el-table-column>
      <el-table-column width="80">
        <template v-slot="scope">
          <el-button type="primary" @click="onClickDetail(scope.row)" size="mini">詳細</el-button>
        </template>
      </el-table-column>
    </el-table>  
  </div>
</template>

<script>
export default {
  name: "AppCatalogList",
  data(){
    return {
      keyword: ""
    }
  },
  computed: {
    catalogs() {
      return this.$store.getters.searchCatalog({keyword: this.keyword});
    }
  },
  methods: {
    onClickDetail(catalog) {
      this.$router.push({ path: catalog.Link });
    }
  }
}
</script>
<style scoped>
.el-row {
  margin: 12px 0;
}
</style>
<style>
table {
  margin: 0
}
</style>