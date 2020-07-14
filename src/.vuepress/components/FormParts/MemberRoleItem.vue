<template>
  <div id="MemberRoleItem">
    <el-row :gutter="4">
      <el-col :span="9">
        <el-input 
          type="text"
          placeholder="Eメールアドレスを入力してください"
          v-model="email"
        ></el-input>
      </el-col>  
      <el-col :span="6">
        {{name}}
      </el-col>  
      <el-col :span="8">
        <el-select 
          v-model="role" 
          placeholder="役割を選択してください。"
        >
          <el-option label="プロジェクト責任者" value="ProjectManager"></el-option>
          <el-option label="ゲスト" value="Guest"></el-option>
        </el-select>
      </el-col>  
      <el-col :span="1">
        <el-button 
          size="mini"
          type="danger" 
          icon="el-icon-minus" circle
          @click="onClickDelete()"
        ></el-button>
      </el-col>  
    </el-row>
  </div>
</template>

<script>
export default {
  name : "MemberRoleItem",
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    email: {
      get(){ return this.$store.state.a.members[this.index].email },
      set(value){ this.$store.commit('setMemberRoleInfo', {
          index: this.index,
          type: "email",
          value: value
        })
      }
    },
    role: {
      get(){ return this.$store.state.p.members[this.index].role },
      set(value){ this.$store.commit('setMemberInfo', {
          index: this.index,
          type: "role",
          value: value
        })
      }
    },
    name() {
      return "未実装";
    }
  },
  methods: {
    onClickDelete(){
      this.$store.commit('deleteMemberRole', this.index);
    } 
  }
}
</script>
