const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + "/date.js")
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"))
// const items = ["buying fruits"]; --v1
// const works = ["complete homework"] --v1
//const listsNames = []
mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    }
})

const listsSchema = mongoose.Schema({
    name : String,
    items : [itemsSchema]
})

const listNameSchema = mongoose.Schema({
    name : {
        type : String ,
        required : true
    }
})

const Item = mongoose.model("Item" , itemsSchema)

const List = mongoose.model("List" , listsSchema)

const ListNames = mongoose.model("Listname" , listNameSchema)

const item1 = new Item({
    name : "Create your custom lists and add tasks"
})
const item2 = new Item({
    name : "Delete tasks by checking checkbox"
})
const item3 = new Item({
    name : "Delete custom lists by delete button"
})
const defaultItems = [item1 ,item2 ,item3]

//-----------------------------------DataBase ends here ------------------------------------
let day = date.getDate();
var nameOfList ;



app.get("/" , (req , res) => {

    ListNames.find((err , listsNames) => {
    if(!err){  
        Item.find((err , foundItems) => {
            if(err){
                console.log(err);
            }
            else{
                if(foundItems.length === 0){
                    Item.insertMany(defaultItems , (err) => {
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log("Default Items inserted successfully to DB!")
                        }
                    })
                    res.redirect("/")
                }
                else{
                    res.render("list" , {kindofList: "Today" , newListItems: foundItems ,listsNames : listsNames})
                }
                
                
            }
        })

    }
        
            
    })
    
})



// app.get("/work" , (req , res) => {
//     res.render("list" , {kindofList: "Work" , newListItems : works})   ---v1
// })

app.get("/about" , (req,res) => {
    ListNames.find((err , listsNames) => {
        if(!err){
            res.render("about" , {kindofList : "About" , listsNames : listsNames})
        }
    })
})



app.get("/:key" , (req , res) => {
    const requestedList = _.capitalize(req.params.key)
    //console.log(requestedList);
    ListNames.find((err , listsNames) => {
       if(!err){
        List.findOne({name : requestedList} , (err , foundList) => {
            if(err){
                console.log(err);
            }
            else{
                if(!foundList){
                    //create a new list
                    if(requestedList === "Today"){
                        res.redirect("/")
                    }else{
                        if(requestedList !== "Favicon.ico"){
                            console.log("List NOT found");
                            const list = new List({
                                name : requestedList,
                                items : defaultItems
                            })
                        list.save()
                        res.redirect("/" + requestedList) 
                        }
                    }    
                }
                else{
                    //show the existing list 
                    //console.log(foundList);
                    if(requestedList === "about"){
                        res.redirect("/about")
                    }
                    else{
                        res.render("list" , {kindofList : requestedList , newListItems : foundList.items , listsNames : listsNames })
                        
                    }
                    
                    
                }
                
            }
        })
       } 
    })

    

        
    
})

//<----------------POST requests starts here ------------------->

app.post("/addlist" , (req , res) => {
    nameOfList = _.capitalize(req.body.addlist)
    //console.log(nameOfList)
    // if(listsNames.includes(nameOfList)){
    //     console.log("List already exists , opening the list")
    //     res.redirect("/" + nameOfList)
    // }
    // else{
    //     listsNames.push(nameOfList)
    //     res.redirect("/" + nameOfList)
    // }



    ListNames.findOne( {name : nameOfList} , (err , listsNames) => {
        if(nameOfList === "Today"){
            res.redirect("/")
        }else{
            if(!err){
                if(!listsNames){
                    const listx = new ListNames({
                        name : nameOfList
                    })
                    listx.save()
                    res.redirect("/" + nameOfList)
                }
                else{
                    res.redirect("/" + nameOfList)
                }
            } 
        }
    })

    
    
})


app.post("/" , (req ,res) => {
    const itemName = req.body.newItem;
    const requestedList = _.capitalize(req.body.button)
    //console.log(day)
    console.log(requestedList)
    const itemx = new Item({
        name : itemName
    })
    if(requestedList === "Today"){    
        itemx.save()
        res.redirect("/")
    }
    else{
        List.findOne({name : requestedList} , (err , foundList) => {
            if(err){
                console.log(err)
            }
            else{
                foundList.items.push(itemx)
                foundList.save()
                
            }
        })
        res.redirect("/" + requestedList)
    }










    //<-----------v1--------------->
    //console.log(req.body.button)
    // const item = req.body.newItem;
    // const work = req.body.newItem
    // if(item !== "" && req.body.button !== "Work"){
    //     items.push(item)
    //     res.redirect("/");
    // }
    // else if(work !== "" && req.body.button === "Work"){
    //     works.push(work)
    //     res.redirect("/work")
    //}
    //console.log(works);
    //console.log(items);
    //<------------v1-------------->
})

app.post("/deletelist" , (req , res) => {
    
    const toDeleteList = req.body.deleteListButton
    console.log(toDeleteList)
    
    ListNames.deleteOne({name : toDeleteList} , (err) => {
        if(!err){
            console.log(toDeleteList + " deleted successfully")
        }
    })

    List.deleteOne({name : toDeleteList} , (err) => {
        if(!err){
            console.log("List deleted ")
        }
    })


    res.redirect("/")
})

app.post("/delete" , (req , res) => {
    //console.log(req.body.checkbox)
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today"){
        Item.deleteOne({_id : checkedItemId} , (err) => {
        if(err){
            log(err)
        }
        else{
            console.log("Item deleted successfully")
        }
        res.redirect("/")
    })
    }
    else{
        List.findOneAndUpdate({name : listName} , {$pull : {items : {_id : checkedItemId}}} , (err , results) => {
            if(err){
                console.log(err)
            }
            else{
                console.log("Item deleted successfully")
                res.redirect("/" + listName)
            }
        })
    }
    
    
})







app.listen(3000 , () => {
    console.log("server has started at port 3000");
})