import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

app.use(express.json()); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "tasks_db",
  password: "Luis2010#4571",
  port: 5432,
});

const port = 3000;

db.connect();

app.get("/", async (req, res) => {
    res.render('index.ejs')
    
});

app.post("/tasks", async (req, res) => {
    const { title, description } = req.body;
    
    try {
        await db.query(
            "INSERT INTO tasks (title, description) VALUES ($1, $2)",
            [title, description]
        );
        res.json('Task added successfully, the title is settled as  (' + title + ") and the description as  (" + description + ')');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add task' });
    }
});


app.get("/tasks", async (req, res) => {
    try {
        const answer = await db.query(
            "SELECT * FROM tasks ORDER BY id ASC ",
        );
        res.json(answer.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

app.get("/tasks/:id", async (req, res) => {
    const {id} = req.params;
            const answer = await db.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );
        if (answer.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(answer.rows);

});

app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    
        const result = await db.query(
            "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *",
            [title, description, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
    
});

app.patch("/tasks/:id", async (req, res) => {
    const {id} = req.params;
    const {title, description} = req.body;
    const result = await db.query(
        "UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 RETURNING *",
        [title || null, description || null, id]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
});

app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    
    const result = await db.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        [id]
    );
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully', taaask: result.rows });
});

app.listen(port, () => {
    console.log('Server running on port ' + port)
    console.log('✓ Server started successfully')
});