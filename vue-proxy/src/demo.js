let obj = {
  name:'pst',
  age:18
}
let weakMap = new WeakMap();
let dependFn = null
const generationProxy = function(target){
  return new Proxy(target,{
    get:function(target,name,receiver){
      let depend = getDepend(target,name)
      depend.add()
      return Reflect.get(target,name,receiver)
    },
    set:function(target,name,newValue,receiver){
      Reflect.set(target,name,newValue,receiver)
      let depend = getDepend(target,name)
      depend.notify()
      
    }
  })
}
class Depend{
  constructor(){
    this.dependencies = new Set();

  }
  add(){
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
function getDepend(target,name){
  let map = weakMap.get(target);
  if(!map){
    map = new Map()
    weakMap.set(target,map)
  }
  let depend = map.get(name);
  if(!depend){
    depend = new Depend()
    map.set(name,depend)
  }
  return depend
}
function watchFn(fn){
  dependFn = fn;
  fn()
  dependFn = null
}

const proxyObj = generationProxy(obj)
function foo(){
  console.log(proxyObj.name);
  console.log(proxyObj.age);
}
watchFn(foo)
proxyObj.name = '彭思涛'