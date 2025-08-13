import express from "express";
import bodyParser from "body-parser";
import { getPosts, getFeatured, addPost } from "./functions.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { get } from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const featured = getFeatured();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("./home.ejs", {
    posts: getPosts(),
    featured: featured,
  });
});
app.get("/compose", (req, res) => {
  res.render("./compose.ejs", {
    posts: getPosts(),
    featured: featured,
  });
});

app.get("/all-posts", (req, res) => {
  res.render("./all.ejs", { posts: getPosts(), success: req.query.success });
  console.log(req.query);
});

app.get("/posts/:id/:slug", (req, res) => {
  const rawId = req.params.id;
  const id = parseInt(rawId.replace("f", "")) - 1;

  const posts = getPosts(); // fetch fresh data

  if (id >= 0 && id < posts.length) {
    const post = posts[id];
    res.render("post.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});
app.get("/:id/:slug", (req, res) => {
  const rawId = req.params.id;
  const id = parseInt(rawId.replace("f", "")) - 1;

  const posts = getPosts();
  if (id >= 0 && id < posts.length) {
    const feat = featured[id];
    res.render("post.ejs", { post: feat });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/compose", (req, res) => {
  const post = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image || "/images/default.jpg",
  };
  addPost(post);
  res.redirect("/all-posts?success=true");
});

app.listen(port, () => {
  console.log(`Server is online at ${port}!`);
});
