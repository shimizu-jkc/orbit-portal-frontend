<template>
  <div id="AppKnowledgeGridList">
    <el-container>
      <el-aside width="240px">
        <el-menu :default-openeds="defaultOpenMenu">
          <el-button type="text" @click="clearAllFilters()">すべてのフィルタをクリア</el-button>
          <el-submenu index="phase">
            <template slot="title">フェーズ</template>
            <el-checkbox-group v-model="checkedPhases">
              <el-menu-item v-for="p in getDispNameSets('knowledgePhase')" :key="p.value">
                <el-checkbox :label="p.value">{{ p.label }}</el-checkbox>
              </el-menu-item>
            </el-checkbox-group>
          </el-submenu>
          <el-submenu index="type">
            <template slot="title">種別</template>
            <el-checkbox-group v-model="checkedTypes">
              <el-menu-item v-for="t in getDispNameSets('knowledgeType')" :key="t.value">
                <el-checkbox :label="t.value">{{ t.label }}</el-checkbox>
              </el-menu-item>
            </el-checkbox-group>
          </el-submenu>
          <el-submenu index="env">
            <template slot="title">利用環境</template>
            <el-checkbox-group v-model="checkedEnvs">
              <el-menu-item v-for="e in getDispNameSets('knowledgeEnv')" :key="e.value">
                <el-checkbox :label="e.value">{{ e.label }}</el-checkbox>
              </el-menu-item>
            </el-checkbox-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-row>
          <el-input
            v-model="keyword"
            placeholder="キーワード検索"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-row>
        <el-row>
          並べ替え：
          <el-select
            class="form-item-vshort"
            v-model="sortType"
            clearable>
            <el-option
              v-for="o in sortOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value">
            </el-option>
          </el-select>
        </el-row>
        <div class="grid-container">
          <knowledgeItem
            v-for="(k, index) in knowledges" :key="index"
            class="knowledge-item"
            :phase="getDispName('knowledgePhase', k.Phase)"
            :type="getDispName('knowledgeType', k.Type)"
            :env="getDispName('knowledgeEnv', k.Env)"
            :author="k.Author"
            :title="k.Name"
            :description="k.Desc"
            :link="k.Link"
            :updatedAt="k.UpdatedAt">
          </knowledgeItem>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import KnowledgeItem from "./AppKnowledgeParts/KnowledgeItem";
import Util from "../mixins/util";
import Disp from "../mixins/disp";

export default {
  name: "AppKnowledgeGridList",
  components: {
    knowledgeItem: KnowledgeItem
  },
  mixins: [Util, Disp],
  data() {
    return {
      defaultOpenMenu: ["phase", "type", "env"],
      keyword: "",
      checkedPhases: [],
      checkedTypes: [],
      checkedEnvs: [],
      sortType: "",
      sortOptions: [
        { value: "desUpdatedAt", label: "最終更新日" },
        { value: "ascTitle", label: "タイトル (昇順)" },
        { value: "desTitle", label: "タイトル (降順)" }
      ]
    };
  },
  computed: {
    knowledges() {
      return this.$store.getters.searchKnowledge({
        keyword: this.keyword,
        phases: this.checkedPhases,
        types: this.checkedTypes,
        envs: this.checkedEnvs
      }).sort( (a, b) => {
        switch(this.sortType) {
          case "desUpdatedAt":
            return b.UpdatedAt - a.UpdatedAt;
          case "ascTitle":
            return a.Name && a.Name.localeCompare(b.Name);
          case "desTitle":
            return b.Name && b.Name.localeCompare(a.Name);
        }
      });
    }
  },
  methods: {
    async clearAllFilters() {
      this.checkedPhases = [];
      this.checkedTypes = [];
      this.checkedEnvs = [];
    }
  },
  mounted() {
    // expand content width for VuePress
    document.querySelector("div.theme-default-content:not(.custom)").style.maxWidth = "1280px";
  }
};
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
.el-aside {
  overflow: visible;
}
.el-row {
  margin-bottom: 12px;
}
.grid-container {
  display: flex;
  flex-wrap: wrap;
}
.knowledge-item {
  margin: 12px;
}
</style>
