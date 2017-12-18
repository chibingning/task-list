//存取localstorage中数据
var store = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));//数组 转换成字符串
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key))||[];
    }
}

// var list =[
//     {
//         title:"吃饭睡觉打豆豆",
//         isCheacked:false,
//     },
//     {
//         title:"吃饭睡觉打豆豆",
//         isCheacked:true,
//     }
// ];

var list = store.fetch("note");

var vm = new Vue({
    el: "#app",
    data: {
        list:list,
        todo:"",//记录输入的数据
        editTodo:"",//记录正在编辑的数据
        beforeTitle:"",//记录正在编辑的数据title
        visibility:"all",
    },
    watch:{
        // list:function(){//监控list这个属性，当这个属性对应的值发生变化就会执行函数
        //     store.save("note",this.list)
        // }
        list:{
            handler:function(){
                store.save("note",this.list) 
            },
            deep:true
        }
    },
    computed:{
        noCheckedLength:function(){
           return this.list.filter(function(item){ //filter过滤
               return !item.isCheacked
            }).length
        },
        filterlist:function(){
            var filter ={
                all:function(list){
                    return list;
                },
                fished:function(list){
                    return list.filter(function(item){
                        return item.isCheacked;
                    })
                },
                ufished:function(list){
                    return list.filter(function(item){
                        return !item.isCheacked;
                    })
                }

            }
            return filter[this.visibility](list)? filter[this.visibility](list):list;
        }
    },
    methods:{
        // 时间处理函数集中管理
        addTodo(){ //ev 事件对象
            //向list中添加一项任务
            //thiS事件处理函数中的this指向的是，当前这个根实例
                this.list.push({
                    title:this.todo,
                    isCheacked:false
                })
            todo = ""; //添加完成清空
        },
        deleteTodo(todo){
            var index = this.list.indexOf(todo);
            this.list.splice(index,1);
        },
        editing(todo){
            //编辑任务的时候，记录一下编辑这条任务的title，
            //方便在取消编辑的时候重新给之前的title
            this.beforeTitle = todo.title;
            this.editTodo = todo;
        },
        editTodoend(todo){
            this.editTodo ='';
        },
        cancelTodo(todo){
            todo.title = this.beforeTitle;
            this.editTodo ='';//让input隐藏
        }
    },
    directives:{//自定义指令
        focus:{ //钩子
            update(el,binding){//1.el当前绑定的元素 
                if(binding.value){
                    el.focus();
                }
            }
        }
    }
});


function watchHash(){
    var hash = window.location.hash.slice(1);
     vm.visibility = hash;

}

window.addEventListener("hashchange",watchHash);
