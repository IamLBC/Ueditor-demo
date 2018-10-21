export function getContentArr (content) {
  let arr = content.match(/<h[1-6].*?>.*?<\/h[1-6]>/g) || []
  /*eslint no-return-assign: "off"*/
  /*eslint spaced-comment : "off"*/
  return arr.map(item => item = item.replace(/<\/?(small|cite|ins|del|pre|span|a|hr|font|p|div|strike|u|address|center|pre|abbr|blockquote|dir|ul|ol|dl|li|ins|strong|em|sub|sup|b|s|i).*?>|<br\/?>/g, '').replace(/style=".*?"/g, ''))
}
//  创建树结构
export function getTree (titles) {
  // 找上一级
  function findParent (tag, arr) {
    return arr.filter(item => {
      return item.tag === tag
    }).slice(-1)[0].pid
  }
  return titles.map((item, index, self) => { // 初始化结构
    let obj = {
      label: item,
      id: index + 1,
      tag: 'h' + item[2],
      rank: item[2] * 1
    }
    if (item[2] !== self[0][2]) {
      obj = Object.assign(obj, { pid: 1 })
    }
    return obj
  })
    .map((item, index, self) => {
      if (item.pid) {
        if (item.rank > self[index - 1].rank) {
          item.pid = self[index - 1].id
        } else if (item.rank === self[index - 1].rank) {
          item.pid = self[index - 1].pid
        } else {
          var temp = self.slice(0, index)
          item.pid = findParent(item.tag, temp)
        }
      }
      return item
    })
    .filter((father, i, self) => {
      father.label = father.label.replace(/<h[1-6].*?>|<\/h[1-6]>/g, '').replace(/&nbsp;/g, ' ')
      let branchArr = self.filter(child => {
        return father.id === child.pid
      })
      if (branchArr.length > 0) {
        father.children = branchArr
      }
      return !father.pid
    })
}
//  深度展开array
export function deepOpenArray (arr) {
  var temp = []
  arr.forEach(item => {
    temp.push({
      tag: item.tag,
      label: item.label,
      id: item.id
    })
    if (item.children && item.children.length > 0) {
      temp = temp.concat(deepOpenArray(item.children))
    }
  })
  return temp
}
