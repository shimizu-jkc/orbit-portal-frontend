<template>
  <div id="FormCreateProject">
    <el-form>
      <el-form-item label="登録する前の確認">
        <el-col>
          <el-checkbox 
            label="プロジェクトとしての体制が構築されている。" 
            v-model="check[0]"
          ></el-checkbox>
        </el-col>
        <el-col>
          <el-checkbox 
            label="クラウド利用料金の配賦先が明確になっている。" 
            v-model="check[1]"
          ></el-checkbox>
        </el-col>
      </el-form-item>
      <p-info operation="create" />
      <el-form-item>
        <el-button type="primary" @click="onClickCreate()">登録する</el-button>
      </el-form-item>
    </el-form>
    <loading :show="loading" message="登録中です"/>
    <notification ref="notification"/>
    <confirm
      :visible="dialog.visible" 
      :title="dialog.title"
      :message="dialog.message"
      @ok="dialog.visible=false; onEventOk()"
      @cancel="dialog.visible=false"
    />
  </div>
</template>

<script>
import Loading from './common/Loading.vue'
import Notification from './common/Notification.vue'
import Confirm from './common/Confirm.vue'
import ProjectInfo from './FormParts/ProjectInfo.vue'
  
export default {
  name: "FormCreateProject",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    "p-info": ProjectInfo
  },
  data(){
    return {
      loading: false,
      dialog: {
        visible: false,
        title: "登録の確認",
        message: "プロジェクトを登録します。よろしいですか？"
      },
      operation: "create",
      check: [false, false]
    }
  },
  methods: {
    onClickCreate() {
      this.dialog.visible = true;
    },
    onEventOk() {
      this.dialog.visible = false;
      this.loading = true;
      this.$store.dispatch("createProject");
      setTimeout(() => {
        this.loading = false;
        this.$refs.notification.notify({
          status: "success",
          title: "登録の完了",
          message: "プロジェクトを登録しました。"
        });
        this.$router.push("/request/show-project");
      }, 2000);
    }
  }
}
</script>