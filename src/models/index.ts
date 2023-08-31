// 数据结构类型的定义
/**
 * constructor中的props数据赋值给对应类中的同名属性
 * */ 
function assignPropsToTarget(props: Record<string, any>, target: Record<string, any>){
  if(!props) return;
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if(props[key]){
        target[key] = props[key];
      }
    }
  }
}

export {
  assignPropsToTarget,
}