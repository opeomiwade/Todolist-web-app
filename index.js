import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let full_Date;
var todayTasks = [];
var workTasks = [];

function getFullDate(req ,res, next){
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    full_Date = currentDate.toLocaleDateString('en-US', options);
    next();
}

app.use(getFullDate);

app.use(express.static("public")); // for static stuff like images and css

app.use(bodyParser.urlencoded({ extended: true }));



app.get("/" , (req ,res ) =>{
    let route = "/";
    res.render("index.ejs" , {year : new Date().getFullYear() , header: full_Date , tasks: todayTasks, action: route});
})

app.get("/work" , (req ,res ) =>{
    let route = "/work";
    res.render("index.ejs" , {year : new Date().getFullYear(), tasks: workTasks, action: route});
})

app.post("/" , (req ,res) =>{
    let route = "/";
    if(req.body.task === "" | req.body.task.trim().length === 0 ){
        console.log("empty");
    }

    else{
        console.log(req.body.task);
        todayTasks.unshift(req.body.task);
        res.render("index.ejs" , {tasks: todayTasks , year: new Date().getFullYear() , header: full_Date , action: route});
    }
    
})

app.post("/work" , (req , res) =>{
    let route = "/work";
    if(req.body.task === "" ||  req.body.task.trim().length === 0 ){
        console.log("empty");
    }

    else{
        console.log(req.body.task);
        workTasks.unshift(req.body.task);
        res.render("index.ejs" , {tasks: workTasks , year: new Date().getFullYear() , action: route});
    }

})



app.listen(port , ()=>{
    console.log(`server listening on port ${port}`);
})