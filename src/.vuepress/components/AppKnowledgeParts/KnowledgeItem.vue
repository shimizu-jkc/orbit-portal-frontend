<template>
  <div id="KnowledgeItem" class="card">
    <div class="container">
      <div class="header">
        <h3 class="category">
          <span>{{ category }}</span>
        </h3>
      </div>
      <div class="main">
        <div class="content">
          <h2 class="headline">
            <a v-if="isExternalLink" :href="link.Url" target="_blank">{{ title }}</a>
            <a v-else @click="$router.push({ path: link.Path })">{{ title }}</a>
          </h2>
          <div class="subheadline">{{ author }}</div>
          <div class="description">{{ description }}</div>
        </div>
      </div>
      <div class="footer">
        最終更新日：{{ lastUpdate }}
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
      default: "詳細なし"
    },
    link: {
      type: Object,
      default: () => {return {};}
    },
    updatedAt: {
      type: Date
    }
  },
  computed: {
    category() {
      let ret = (this.phase && this.type) ? `${this.phase} | ${this.type}` : (this.phase || this.type);
      if(this.env) {
        ret += ` (${this.env})`;
      }
      return ret;
    },
    isExternalLink() {
      return this.link.Type !== "INTERNAL";
    },
    lastUpdate() {
      if(this.updatedAt) {
        return `${this.updatedAt.getFullYear()} 年 ${this.updatedAt.getMonth()+1} 月 ${this.updatedAt.getDate()} 日`;
      } else {
        return "不明";
      }
    }
  }
};
</script>

<style scoped>
a {
  cursor: pointer;
}
.card {
  position: relative;
  width: 280px;
  min-height: 320px;
}
.container {
  position: absolute;
  border-top: 5px solid #232f3e;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  overflow: hidden;
  word-break: break-all;
  background-color: #fff;
  min-height: 100%;
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
}
.main .content {
  padding: 4px 0 32px;
}
.main .headline {
  overflow: hidden;
  line-height: 28px;
  max-height: 56px;
  margin: 0;
  font-size: 20px;
}
.main .subheadline {
  overflow: hidden;
  line-height: 18px;
  max-height: 18px;
  color: #677176;
  font-size: 12px;
}
.main .description {
  overflow: hidden;
  line-height: 24px;
  max-height: 144px;
  margin: 12px 0;
  font-size: 14px;
}
.container:hover {
  z-index: 1;
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
  border-top: 1px solid #cacdcd;
  color: #879196;
  padding: 8px 10px 0;
  height: 28px;
  font-size: 12px;
  width: 100%;
}
</style>
