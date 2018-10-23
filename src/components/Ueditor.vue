<script>
  import { getContentArr, getTree } from '@/components/common'
  export default {
    name: 'ueditor',
    data () {
      return {
        editor: null,
        config: {},
        titles: []
      }
    },
    mounted () {
      let self = this
      let UE = window.UE
      this.editor = UE.getEditor('editor', {
        initialFrameHeight: 500,
        initialFrameWidth: '100%'
      }, this.config)
      // 编辑器ready
      this.editor.addListener('ready', function () {
        UE.getEditor('editor').setHeight(500)
      })
      // 监听内容变化
      this.editor.addListener('contentChange', function () {
        var content = self.getUEContent()
        self.titles = getContentArr(content)
      })
      // 兼容IE11，只有11会出问题，edge不会有问题
      if (UE.browser.ie && UE.browser.version === 11) {
        setTimeout(() => {
          let self = this
          UE.dom.domUtils.on(this.editor.document, 'mousedown', function (e) {
            if (e.target.tagName === 'HTML') {
              UE.dom.domUtils.preventDefault(e)
              return false
            }
            if (e.target.tagName !== 'IMG') self.IE11scroll(e.target)
          })
        }, 1000)
      }
    },
    watch: {
      // 如果不是标题改变，则不进行树结构转换 -lbc-2018-10-19
      titles (newVal, oldVal) {
        let isChange = false
        if (oldVal.length > 0) {
          isChange = newVal.some((item, index) => {
            if (item !== oldVal[index]) return true
          })
        } else {
          isChange = true
        }
        if (isChange) {
          let tree = getTree(newVal)
          this.$emit('titlesChange', tree)
        }
      }
    },
    methods: {
      // ueditor在IE11, 失焦状态下滑动鼠标滚轮, 再聚焦到editor会回到滚动前的聚焦点。
      // 暂时不知道怎么把选中的选区变成光标闪烁 -lbc-2018-10-19
      IE11scroll (el) {
        let s = this.editor.selection.getNative()
        let range = this.editor.selection.getRange()
        if (s.rangeCount > 0) s.removeAllRanges()
        range.selectNode(el.lastChild).select()
      },
      getUEContent () {
        return this.editor.getContent()
      },
      anchor (tag, index) {
        let el = this.editor.document.getElementsByTagName(tag)[index]
        el.scrollIntoView()
        // 兼容ie11，内容超宽情况下，跳转锚点会横向移动滚动条 -lbc-2018-10-19
        this.editor.document.documentElement.scrollLeft = 0
      }
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>

<template>
  <div id="editor"></div>
</template>
