// 提示
export function message(type, text) {
  return this.$message({
    type: type,
    message: text
  })
}

// 数组去重
export function uniq(array) {
  var temp = []
  for (var i = 0; i < array.length; i++) {
    // if (temp.indexOf(array[i]) == -1) {
    //   temp.push(array[i])
    // }
  }
  return temp
}
// 模糊查询
export function search(str, list) {
  var newList = []
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf(str) >= 0) {
      newList.push(list[i])
    }
  }
  return newList
}
// 判断两次输入是否一致
export function isSame(new1, new2) {
  if (new1 === new2) {
    return true
  } else {
    return false
  }
}

