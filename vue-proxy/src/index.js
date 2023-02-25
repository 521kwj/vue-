let weakMap = new WeakMap();
let dependFn = null
function generationProxy(target){
  return new Proxy(target,{
    get:function(target,key,receiver){
      let depend = getDepend(target,key)
      depend.appendDependency()
      return Reflect.get(target,key,receiver)
    },
    set:function(target,key,newValue,receiver){
      Reflect.set(target,key,newValue,receiver)
     let depend =  getDepend(target,key);
     depend.notify()
    }
  })
}
class Depend{
  constructor(){
    this.dependencies = new Set()
  }
  appendDependency(){
    if(dependFn){
      this.dependencies.add(dependFn)
    }
    
  }
  notify(){
    if(this.dependencies.size){
      this.dependencies.forEach(fn => fn())
    }
  }
}
function getDepend(target,key){
  let map = weakMap.get(target);
  if(!map){
    map = new Map();
    weakMap.set(target,map)
  }
  let depend = map.get(key);
  if(!depend){
    depend = new Depend();
    map.set(key,depend)
  }
  return depend
}
function watchFn(fn){
  dependFn = fn
  fn();
  dependFn = null
}

let obj = {
  name:'pst',
  age:18
}

let proxyObj = generationProxy(obj)
const foo = function(){
  console.log(proxyObj.age)
  console.log(proxyObj.name)
}

watchFn(foo)
proxyObj.name = 'lalalal'
proxyObj.name = '3333'