const express = require("express");
const app= express();
const port = process.env.PORT || 8080;

app.get("/", (req,res) => {
    res.send("Hello get data..................");
});

app.get("/a1", (req,res) => {
    res.send("get data..................");
});


app.listen(port, () => {
    console.log("Server started on port 8080");
});