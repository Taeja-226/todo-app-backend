import express from 'express';
import connectToDatabase from './db.js';
import cors from 'cors';


const app = express();


const port = 3000;

app.use(express.json());
app.use(cors({
    origin :"http://localhost:3001"
}));

let db;

app.listen(port, async () => {
    console.log(`Server started at port ${[port]}`)
    db = await connectToDatabase('todo-db')

})


app.get('/test', (req, res) => {
    res.send("API is working")
})



app.post('/create-todo', async (request, response) => {
    try {
        let task = request.body
        console.log(`Request recieved at ${JSON.stringify(task)}`);
        await db.collection('todo').insertOne(task)
        response.status(201).json({
            msg: "Task created successfully"
        })
    } catch (error) {
        response.status(500).json({
            msg: "internal server error",
            error: error.message
        })
    }

})



app.get('/read-all-todo', async (request, response) => {
    try {
        let AllTasks = await db.collection('todo').find().toArray();
        response.status(200).json(AllTasks)
    } catch (error) {
        response.status(500).json({
            msg: "internal server error",
            error: error.message
        })
    }

})





app.get('/read-single-todo', async (req, res) => {
    try {
        let TodoId = req.query.todoId;
        let result = await db.collection('todo').findOne({ 'todoId': TodoId })
        if (result == null) {
            res.status(404).json({ msg: 'Todo not found' })
        } else
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            msg: "internal server error",
            error: error.message
        })
    }
})



app.patch('/update-todo', async (req, res) => {
    try {
        let Todo = req.query.todoId;
        let newTodo = req.body;
        let result = await db.collection('todo').updateOne({ "todoId": Todo }, { $set: newTodo })
        if (result.matchedCount === 0) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        else 
        res.status(201).json({ msg: 'Todo updated successfully' });

    } catch (error) {
        res.status(500).json({
            msg: "internal server error",
            error: error.message
        })
    }


})



            res.status(404).json({ msg: 'Task not found' })
        }
        else
        res.status(201).json({ msg: 'Task deleted successfully' })

app.delete('/delete-todo', async (req, res) => {
    try {
        let Todo = req.query.todoId;
        let result = await db.collection('todo').deleteOne({ "todoId": Todo })
        if (result.deletedCount === 0) {
    } catch (error) {
        res.status(500).json({
            msg: "internal server error",
            error: error.message
        })
    }
})


