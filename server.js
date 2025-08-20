import express from 'express';
import connectToDatabase from './db.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: "https://todo-app-frontend-9487.onrender.com"
}));

let db;

app.listen(port, async () => {
    console.log(`Server started at port ${port}`);
    db = await connectToDatabase('todo-db');
});

app.get('/test', (req, res) => {
    res.send("API is working");
});

app.post('/create-todo', async (req, res) => {
    try {
        const task = req.body;
        console.log(`Request received: ${JSON.stringify(task)}`);
        await db.collection('todo').insertOne(task);
        res.status(201).json({ msg: "Task created successfully" });
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
});

app.get('/read-all-todo', async (req, res) => {
    try {
        const allTasks = await db.collection('todo').find().toArray();
        res.status(200).json(allTasks);
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
});

app.get('/read-single-todo', async (req, res) => {
    try {
        const todoId = req.query.todoId;
        const result = await db.collection('todo').findOne({ todoId });
        if (!result) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
});

app.patch('/update-todo', async (req, res) => {
    try {
        const todoId = req.query.todoId;
        const updatedData = req.body;
        const result = await db.collection('todo').updateOne({ todoId }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.status(200).json({ msg: 'Todo updated successfully' });
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
});

app.delete('/delete-todo', async (req, res) => {
    try {
        const todoId = req.query.todoId;
        const result = await db.collection('todo').deleteOne({ todoId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(200).json({ msg: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
});
