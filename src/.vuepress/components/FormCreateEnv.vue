<template>
  <el-form ref="form" :model="form" label-position="top" label-width="150px" >
    <el-form-item label="申請する前に">
      <el-col><el-checkbox label="個人目的ではなくプロジェクトでの利用である。" v-model="form.agreement1"></el-checkbox></el-col>
      <el-col><el-checkbox label="事業部にてクラウド利用に関する予算を確保済みである。" v-model="form.agreement2"></el-checkbox></el-col>
      <el-col><el-checkbox label="払い出しには審査があることを理化している。" v-model="form.agreement3"></el-checkbox></el-col>
      <el-col><el-checkbox label="払い出しまでに3営業日以上掛かることを理解している。" v-model="form.agreement4"></el-checkbox></el-col>
    </el-form-item>
    <el-form-item label="クラウドベンダ">
      <el-select v-model="form.vendor" placeholder="ベンダを選択してください">
        <el-option label="Amazon Web Service (AWS)" value="aws"></el-option>
        <el-option label="Google Cloud Platform (GCP)" value="gcp" :disabled=true></el-option>
        <el-option label="Azure" value="azure" :disabled=true></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="プロジェクト名">
      <el-input v-model="form.projectName"　placeholder="あなたのプロジェクトの名称を入力してください"></el-input>
    </el-form-item>
    <el-form-item label="利用目的">
      <el-row>
        <el-col :span="8">
          <el-select v-model="form.env" placeholder="用途を選択してください">
            <el-option label="本番環境" value="prd"></el-option>
            <el-option label="ステージング環境" value="stg"></el-option>
            <el-option label="開発環境" value="dev"></el-option>
            <el-option label="検討環境" value="poc"></el-option>
            <el-option label="その他" value="etc"></el-option>
          </el-select>
        </el-col>
        <el-col :span="16">
          <el-input v-model="form.envNote" placeholder="備考がある場合はこちらへ記載してください"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="配賦情報">
      <el-row>
        <el-col :span="8">
          <el-select v-model="form.billingOWDepartmentCode" placeholder="部門名を選択してください">
            <el-option label="(技開)クラウド基盤開発G" value="1740585"></el-option>
          </el-select> 
        </el-col>
        <el-col :span="8">
          <el-select v-model="form.billingOWUsageCode" placeholder="科目名を選択してください">
            <el-option label="通信費" value="43161"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="初期ユーザー登録">
      <el-row>
        <el-col :span="6">
          <el-input v-model="form.userGroup" placeholder="所属部署"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="form.userName" placeholder="氏名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="form.userMail" placeholder="Eメールアドレス"></el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="form.userRole" placeholder="役割">
            <el-option label="プロジェクト責任者" value="43161"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="danger" icon="el-icon-minus" circle></el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-plus" circle></el-button>
    </el-form-item>
    <el-form-item label="備考">
      <el-input type="textarea" v-model="form.desc" placeholder="備考がある場合はこちらへ記載してください"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="dialogVisible = true">申請する</el-button>
      <el-dialog title="申請の確認" :visible.sync="dialogVisible" width="30%">
        <span>クラウド環境の払い出しを申請します。よろしいですか？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">キャンセル</el-button>
          <el-button type="primary" @click="dialogVisible = false; onSubmit()">申請する</el-button>
        </span>
      </el-dialog>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        const loading = this.$loading({
          lock: true,
          text: '申請中です',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
          this.$notify({
            type: 'success',
            title: '申請が完了しました',
            message: '審査結果が出るまでお待ちください。',
        });
        }, 2000);
      }
    }
  }
</script>