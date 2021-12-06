export  const reserveTime=(time)=>{
  return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()
}
export const handleArray=  (levelIVDirectoryList)=>{
  levelIVDirectoryList.forEach((item)=>{
    if(item.children.length<=0){
      item.children=undefined
    }
    else {
      handleArray(item.children)
    }
  })
  return levelIVDirectoryList
}


// export const handleArra=  (levelIVDirectoryList)=>{
//   console.log("enter")
  //map递归
  // levelIVDirectoryList.map((item)=>{
  //   if(item.children.length<=0){
  //     return item.children=undefined
  //   }else{
  //     handleArra(item.children)
  //   }
  // })
  // return levelIVDirectoryList
  //reduce递归
//   levelIVDirectoryList.reduce((pre,item)=>{
//     if(item.children<=0){
//        item.children=undefined
//     }
//     else{
//       handleArra(item.children)
//     }
//
//   },[])
//   return levelIVDirectoryList
// }
