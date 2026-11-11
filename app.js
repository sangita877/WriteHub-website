
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Serve CSS files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Temporary storage
let posts = [];
let nextId = 1;

// HOME PAGE
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// CREATE PAGE
app.get("/create", (req, res) => {
    res.render("create");
});

// CREATE POST
app.post("/create", (req, res) => {
    const { title, content } = req.body;


    if (!title || !title.trim() || !content || !content.trim()) {
        return res.status(400).send("Please fill in all fields.");
    }

    const newPost = {
        id: nextId++,
        title: title.trim(),
        content: content.trim(),
        date: new Date().toLocaleDateString()
    };

    posts.unshift(newPost);

    res.redirect("/");
});

// EDIT PAGE
app.get("/edit/:id", (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found.");
    }

    res.render("edit", { post });
});

// UPDATE POST
app.post("/edit/:id", (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found.");
    }

    const { title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
        return res.status(400).send("Please fill in all fields.");
    }

    post.title = title.trim();
    post.content = content.trim();

    res.redirect("/");
});

// DELETE POST
app.post("/delete/:id", (req, res) => {
    const id = Number(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        return res.status(404).send("Post not found.");
    }

    posts.splice(postIndex, 1);

    res.redirect("/");
});

// START SERVER
app.listen(PORT, () => {
    console.log(`WriteHub is running at http://localhost:${PORT}`);
});
