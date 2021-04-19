let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let mongoose = require("mongoose");
let port = 9090;
let url = "mongodb://localhost:27017/meanstack";
let mongooseDbOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

mongoose.connect(url, mongooseDbOption);
let db = mongoose.connection;
db.on("error", (err) => console.log("An error has occurred!\n" + err));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("Client connected to application...");

    socket.on('data', (data) => {
        db.once("open", () => {
            let ChatSchema = mongoose.Schema({
                name:String,
                msg:String
            });
            
            let ChatLog = mongoose.model("", ChatSchema, "ChatLogs");

            let chat1 = {
                name: data.name,
                msg: data.msg
            };
            ChatLog.insertMany(chat1, (err1, result) => {
                if(!err1) {
                    console.log("Chat Log successfully inserted in the database!");
                }
                else {
                    console.log("An error has occurred!\n" + err1);
                }
            });
        });
    });
});

app.listen(port, () => console.log(`Server is listening on Port Number: ${port}`));