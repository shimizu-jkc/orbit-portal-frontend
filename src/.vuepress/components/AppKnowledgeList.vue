<template>
  <div id="AppKnowledgeList">
    <el-row :gutter="20" type="flex" align="middle">
      <el-col :span="14">
        <span>キーワード</span>
        <el-input
          v-model="keyword"
          placeholder="ナレッジで検索"
          prefix-icon="el-icon-search"
          size="small"
        ></el-input>
      </el-col>
    </el-row>
    <el-table :data="knowledges">
      <el-table-column width="120" sortable prop="Phase" label="フェーズ"></el-table-column>
      <el-table-column width="500" prop="Name" label="ナレッジ"></el-table-column>
      <el-table-column sortable prop="Type" label="種別"></el-table-column>
      <el-table-column sortable prop="Env" label="利用環境"></el-table-column>
      <el-table-column width="80">
        <template v-slot="scope">
          <el-button type="primary" @click="onClickDetail(scope.row)" size="mini">詳細</el-button>
        </template>
      </el-table-column>
    </el-table>
    <a id="HiddenLink" :href="url" target="_blank"></a>
  </div>
</template>

<script>
export default {
  name: "AppKnowledgeList",
  data(){
    return {
      keyword: "",
      url: ""
    }
  },
  computed: {
    knowledges() {
      return this.$store.getters.searchKnowledge({keyword: this.keyword});
    }
  },
  methods: {
    async onClickDetail(knowledge) {
      if(knowledge.Link.Type === "INTERNAL"){
        this.$router.push({ path: knowledge.Link.Path });
      }else if(knowledge.Link.Type === "EXTERNAL"){
        this.url = knowledge.Link.Url;
        document.getElementById("HiddenLink").click();
      }else{
        console.error(`Not support link type [${knowledge.Link.Type}]`);
      }
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