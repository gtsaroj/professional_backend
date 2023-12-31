import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";
  

dotenv.config({
  path: "./.env",
});

connectDB();

app.listen(process.env.PORT, (req, res) => {
  console.log(`server running : ${process.env.PORT}`)
})


