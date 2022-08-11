const express = require('express');
const app = express();
const PORT = 5000;
const fs = require('fs');
app.use(express.json());
const { connection, moviesModel } = require("./mongoose");

const logger = (req, res, next) => {
    let method = (req.method);
    let url = (req.url);
    let userAgent = (req.headers['user-agent']);

    let logdata = `${method}, ${url}, ${userAgent}`;
    logdata += "\n";

    fs.appendFileSync("./logs.txt", logdata, "utf-8")
    next();
}

app.use(logger);

app.get("/movies", async (req, res) => {
    var data;
    let QueryObj = [];
    for (let key in req.query) {
        let temp = {};
        temp[key] = req.query[key];
        if (!temp["sortby"] && !temp["order"]) {
            if (temp["year"]) {
                temp["year"] = Number(temp["year"]);
            }
            QueryObj.push(temp);
        }
    }
    if (QueryObj.length > 0) {
        if (req.query.sortby && req.query.order) {
            let sortParam = {};
            let field = req.query.sortby;
            let order = req.query.order;
            sortParam[field] = order == "desc" ? -1 : 1;
        }
        data = await moviesModel.find({ $or: QueryObj });
    } else {
        data = await moviesModel.find();
    }
    if (req.query.sortby) {
        let sortParam = {};
        let field = req.query.sortby;
        let order = req.query.order;
        sortParam[field] = order == "desc" ? -1 : 1;
        data.sort((a, b) => {
            if (order == "asc") {
                if (a[field] < b[field]) {
                    return -1;
                } else if (a[field] > b[field]) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a[field] < b[field]) {
                    return 1;
                } else if (a[field] > b[field]) {
                    return -1;
                } else {
                    return 0;
                }
            }
        })
    }
    res.send(data);
})

app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Database connected");
    } catch (err) {
        console.log("some error occured : " + err);
    }
    console.log("server started on PORT : " + PORT);
})