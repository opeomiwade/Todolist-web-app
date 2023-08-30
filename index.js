import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import url from "url"
import _ from "lodash";

const app = express();
const port = 3000;
let full_Date;
var todayTasks;
var customListTasks;

function getFullDate(req ,res, next){
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    full_Date = currentDate.toLocaleDateString('en-US', options);
    next();
}

app.use(getFullDate);

app.use(express.static("public")); // for static stuff like images and css

app.use(bodyParser.urlencoded({ extended: true }));



await mongoose.connect("mongodb://localhost:27017/todolistDB").catch(error => console.log(error));

const taskSchema = {
    taskName: {
        type: String,
        required: true
    }
}

const task = mongoose.model("task" , taskSchema);

const workSchema = {
    listName: {
        type: String,
        required: true,
        unique: true
    },
    tasks: [taskSchema]
}

const workTasks = mongoose.model("work" , workSchema);

app.get("/" , async (req ,res ) =>{
    let route = "/";
    todayTasks = await task.find().catch(error => console.log(error)) || []
    res.render("index.ejs" , {year : new Date().getFullYear() , header: full_Date , tasks: todayTasks, action: route});
})


app.get("/:list" , async (req , res) => {
    let route = `/${req.params.list}`
    customListTasks = await workTasks.findOne({listName: req.params.list}).exec() || [];
    res.render("index.ejs" , {year : new Date().getFullYear() , header: _.capitalize(req.params.list), tasks: customListTasks.tasks, action: route});
})



app.post("/" , async (req ,res) =>{
    if(req.body.task === "" | req.body.task.trim().length === 0 ){
        console.log("empty");
    }

    else{
        const newTask = new task({
            taskName: req.body.task
        })
        await newTask.save().catch(error => console.log(error));
        todayTasks = await task.find();
        res.redirect("/");
    }
    
})

app.post("/delete" , async (req , res) => {
    const source = url.parse(req.get('Referer')).pathname;
  
    if(source == "/"){
        await task.findByIdAndRemove(req.body.id).catch(error => console.log(error));
        // todayTasks = await task.find();
        setTimeout(() => {
            res.redirect("/");
        } , 1000);

    }


    else{
        let name = source.replace(/^\// , '');
        await workTasks.findOneAndUpdate({listName: name} , {$pull: {tasks: {_id: req.body.id}}});
        const result = await workTasks.findOne({listName: name});
        // customListTasks = result.tasks;
        setTimeout(() => {
            res.redirect(source);
        } , 1000);
    }
})

app.post("/:list" , async (req , res) =>{
    if(req.body.task === "" | req.body.task.trim().length === 0 ){
        console.log("empty");
    }

    else{
        const list = await workTasks.findOne({listName: req.params.list}).exec();
        if(list){
            //list exists
            const newtask = new task({
                taskName: req.body.task
            })
            list.tasks.push(newtask);

            await list.save().catch(error => console.log(error));
            res.redirect("/" + req.params.list); 

        }

        else{
            const newtask = new task({
                taskName: req.body.task
            });

            const newList = new workTasks({
                listName : req.params.list,
                tasks: newtask
            });
            await newList.save().catch((error) => console.log(error));
            res.redirect("/" + req.params.list); 
        }

       

    }
    
    
})

app.listen(port , ()=>{
    console.log(`server listening on port ${port}`);
})