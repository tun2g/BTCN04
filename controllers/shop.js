const { as } = require("pg-promise");
const pgProduct = require("../models/pgProduct")
const LocalStorage= require("node-localstorage").LocalStorage
const localStorage = new LocalStorage('./scratch');
const shopController={
    renderCart:async(req,res,next)=>{
        list=localStorage.getItem("list").split("|")
        listProduct=[]
        for(let i=0;i<list.length;i++){
            const pr=await pgProduct.findProduct(list[i])
            listProduct.push({"number":1,...pr})
        } 
        console.log("aaa")  
        res.render("cart",{listProduct})
    },
    renderChat:async(req,res,next)=>{
        res.render("chat")
    }
    ,
    render:async(req,res,next)=>{
        const cates=await pgProduct.allCategories()
        let listProduct=[]
        for(let i=0;i<cates.length;i++){
            let list=await pgProduct.getProduct(cates[i].CategoryID)
            listProduct.push(...list)
        }
        const number= localStorage.getItem("list").split("|").length
        res.render("home",{cates,listProduct,number})
    }
    ,
    renderCate:async(req,res,next)=>{
        const cates=await pgProduct.allCategories()
        let listProduct=[]
        for(let i=0;i<cates.length;i++){
            if(i+1===parseInt(req.params.id)) {
                let list=await pgProduct.getProduct(cates[i].CategoryID)
                listProduct.push(...list)
            }
        }
        const number= localStorage.getItem("list").split("|").length

        res.render("home",{cates,listProduct,number})
    }
    ,
    addCart:async(req,res,next)=>{
        const id=req.params.id
        let list= localStorage.getItem("list")
        if(!list){
            list =id
        }
        else        
        list=list + '|'+id
        console.log(list)
        localStorage.setItem("list",list.toString())
        const number= list.split("|").length
        console.log(number)
    },
    
}

module.exports=shopController