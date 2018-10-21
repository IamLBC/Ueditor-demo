<script>
  import Ueditor from '@/components/Ueditor'
  import { deepOpenArray } from '@/components/common'
  export default {
    name: 'showueditor',
    components: {
      Ueditor
    },
    data () {
      return {
        dirTree: []
      }
    },
    methods: {
      handleNodeClick (data) {
        let i
        deepOpenArray(this.dirTree).filter(item => {
          return item.tag === data.tag
        }).forEach((item, index) => {
          if (item.id === data.id) i = index
        })
        this.$refs.ue.anchor(data.tag, i)
      }
    }
  }
</script>

<template>
 <div class='ueditor-demo'>
   <div class="treeBox">
      <el-tree
        :data="dirTree"
        :props="{children: 'children', label: 'label'}"
        :accordion="false"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick">
      </el-tree>
   </div>
   <div class="ueditor">
     <ueditor ref="ue" @titlesChange="val => dirTree = val"/>
   </div>
 </div>
</template>

<style lang='scss'>
.ueditor-demo {
  display: flex;
  padding: 10px;
  text-align: left;
  .treeBox {
    width: 25%;
    height: 610px;
    overflow: auto;
    margin-right: 20px;
    border: 1px solid #ccc;
    .el-tree {
      border: 0;
    }
  }
  .ueditor {
    flex: 1;
  }
}
</style>
