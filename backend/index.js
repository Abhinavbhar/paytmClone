import express from 'express'
import cors from 'cors'
const port = 3000;
import allRoutes from './Routes/index.routes.js'
import { connection } from "./db.js";
const app = express();

app.use(express.json());
app.use(cors())

connection()
app.listen(port,()=>{
    console.log('server is ;istening on port 3000')
})
app.use('/api/v1',allRoutes)