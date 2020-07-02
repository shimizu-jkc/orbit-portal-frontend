<template>
  <div id="MemberItem">
    <el-row :gutter="4">
      <el-col :span="8">
        <el-input
          type="text"
          placeholder="所属部署名を入力してください"
          v-model="department"
        ></el-input>
      </el-col>  
      <el-col :span="6">
        <el-input 
          type="text"
          placeholder="名前を入力してください"
          v-model="name"
        ></el-input>
      </el-col>  
      <el-col :span="9">
        <el-input 
          type="text"
          placeholder="Eメールアドレスを入力してください"
          v-model="email"
        ></el-input>
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
  name : "MemberItem",
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    department: {
      get() { return this.$store.state.p.members[this.index].department },
      set(value){ this.$store.commit('setMemberInfo', {
          index: this.index,
          type: "department",
          value: value
        })
      }
    },
    name: {
      get() { return this.$store.state.p.members[this.index].name },
      set(value){ this.$store.commit('setMemberInfo', {
          index: this.index,
          type: "name",
          value: value
        })
      }
    },
    email: {
      get() { return this.$store.state.p.members[this.index].email },
      set(value){ this.$store.commit('setMemberInfo', {
          index: this.index,
          type: "email",
          value: value
        })
      }
    }
  },
  methods: {
    onClickDelete(){
      this.$store.commit('deleteMember', this.index);
    } 
  }
}
</script>
