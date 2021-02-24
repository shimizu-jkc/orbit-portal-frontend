<template>
  <div id="ElementTest">
    <el-date-picker v-model="datetime" type="datetime" placeholder="日時を選択してください"></el-date-picker>
  </div>
</template>


<script>
export default {
  name: 'ElementTest',
  data () {
    return {datetime: ''}
  }
}
</script>