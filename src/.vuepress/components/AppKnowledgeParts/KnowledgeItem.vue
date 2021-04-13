<template>
  <div id="KnowledgeItem">
    <div class="container">
      <div class="header">
        <h3 class="category">
          <span>{{ category }}</span>
        </h3>
      </div>
      <div class="main">
        <div class="content">
          <h2 class="headline">
            <a v-if="external" :href="link" target="_blank">{{ title }}</a>
            <a v-else @click="$router.push({ path: link })">{{ title }}</a>
          </h2>
          <div class="subheadline">
            提供：{{ author }}
          </div>
          <div class="description">
            {{ description }}
          </div>
        </div>
      </div>
      <div class="footer">
        最終更新日：{{ updatedAt }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "KnowledgeItem",
  props: {
    phase: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    env: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: "不明"
    },
    title: {
      type: String,
      default: "タイトルなし"
    },
    description: {
      type: String,
      default: "詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし詳細なし"
    },
    link: {
      type: String,
      default: ""
    },
    external: {
      type: Boolean,
      default: false
    },
    updatedAt: {
      type: String,
      default: "不明"
    }
  },
  computed: {
    category() {
      let ret = (this.phase && this.type) ? `${this.phase} | ${this.type}` : (this.phase || this.type);
      if(this.env) {
        ret += ` (${this.env})`;
      }
      return ret;
    }
  },
  methods: {
  }
};
</script>

<style scoped>
a {
  cursor: pointer;
}
.container {
  position: relative;
  width: 252px;
  border-top: 5px solid #232f3e;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.header {
  min-height: 0px;
  padding: 8px 0;
  margin: 0 10px;
  border-bottom: 1px solid #cacdcd;
}
.category {
  font-weight: 500;
  line-height: 18px;
  height: 20px;
  font-size: 12px;
  color: #16191f;
  margin: 0;
}
.main {
  position: relative;
  padding: 0 10px;
  min-height: 200px;
}
.main .content {
  padding: 5px 0 32px;
}
.main .headline {
  overflow: hidden;
  line-height: 28px;
  max-height: 56px;
  margin: 8px 0 4px;
  font-size: 20px;
}
.main .subheadline {
  overflow: hidden;
  line-height: 18px;
  max-height: 36px;
  color: #677176;
  font-size: 12px;
}
.main .description {
  overflow: hidden;
  line-height: 24px;
  max-height: 100px;
  margin: 8px 0 4px;
  font-size: 16px;
}
.container:hover .headline {
  max-height: none;
}
.container:hover .subheadline {
  max-height: none;
}
.container:hover .description {
  max-height: none;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #cacdcd;
  color: #879196;
  padding: 8px 10px 0;
  height: 28px;
  font-size: 12px;
}
</style>
