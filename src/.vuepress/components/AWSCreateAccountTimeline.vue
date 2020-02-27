// .vuepress/components/sample-timeline.vue
<template>
  <timeline timeline-theme="lightblue">
    <timeline-item>
      <img src="/img/hito.jpg" slot="others">
      <p>AWSアカウントの払い出し申請</p>
      <p class="append">xxx</p>
    </timeline-item>
    <timeline-item>
      <img src="/img/logo.jpg" slot="others">
      <p>審査</p>
      <p class="append">xxx</p>
    </timeline-item>
    <timeline-item  icon-size="small">
      <p class="append">当日～1営業日</p>
    </timeline-item>
    <timeline-item>
      <img src="/img/logo.jpg" slot="others">
      <p>審査結果の連絡</p>
      <p class="append">xxx</p>
    </timeline-item>
    <timeline-item>
      <img src="/img/logo.jpg" slot="others">
      <p>AWSアカウントの払い出し作業</p>
      <p class="append">1. メーリングリストの申請</p>
    </timeline-item>
    <timeline-item  icon-size="small">
      <p class="append">2～3営業日</p>
    </timeline-item>
    <timeline-item>
      <img src="/img/logo.jpg" slot="others">
      <p>AWSアカウントの払い出し完了連絡</p>
    </timeline-item>    
    <timeline-item>
      <img src="/img/hito.jpg" slot="others">
      <p>AWSの利用開始</p>
      <p class="append">Eメールアドレスに連絡します。</p>
    </timeline-item>
  </timeline>
</template>
<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
 
export default {
  name: 'AWSCreateAccountTimeline',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle,
  }
}
</script>
<style>
  .append {
    font-size: .8em;
    margin-top: 3px;
    color: #646C7C;
  }
</style>