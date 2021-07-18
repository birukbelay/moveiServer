const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
var cors = require('cors');
const socket = require("socket.io");



dotenv.config();
const app = express();

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    allowed: "*",
  },
});

const userRouter = require("./packages/user/router_user");
const movieRouter = require('./movies/router.movie');


if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
app.use(cors())
// app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
//
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');

/**
  * Connection to the database
  */
 var mongoDB = process.env.DATABASE_STRING||'mongodb://127.0.0.1/movies';

 mongoose
 .connect(
  mongoDB, 
   {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
 }).then(() => {
      console.log("Connected to the database successfuly");
    });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
 


 app.use("/api/v1/movies", movieRouter);
 app.use("/api/v1/users", userRouter);

 app.get('/', (req,res)=> { //get method
  res.send('Hello World') //send response
})
/**
 * Socket
 */

io.on("connection", (socket) => {
  socket.on("join", (id) => {
    socket.join(id);
    socket.on("send-change", (data) => {
      socket.broadcast.to(id).emit("receive-change", data);
    });
  });
});


{
  // const options ={
  //   definition:{
  //     openapi:"3.0.0",
  //     info:{
  //       title:"Library API",
  //       version:"1.0.0",
  //       description:"A simple express Library API"
  //     },
  //     servers:[
  //       {
  //         url:"http://localhost:3000/api/v1"
  //       }
  //     ]
  //   },
  //   apis:["./routes/*.js"]
  // }
  // const specs = swaggerJsDoc(options)
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

 app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `The requested url ${req.originalUrl} doesnot exist`,
  });
});


const port = process.env.PORT || 4001;
server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});