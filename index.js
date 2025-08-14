import express from "express";
import bodyParser from "body-parser";
import { getPosts, getFeatured, addPost } from "./functions.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { get } from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const featured = getFeatured();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const posts = getPosts();
  res.render("./home.ejs", {
    posts: posts,
    featured: featured,
  });
});
app.get("/compose", (req, res) => {
  const posts = getPosts();
  res.render("./compose.ejs", {
    posts: posts,
    featured: featured,
  });
});

app.get("/all-posts", (req, res) => {
  const postsPerPage = 5;

  // sanitize page param
  const pageParam = parseInt(req.query.page, 10);
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // get all posts from your JSON/functions.js
  const allPosts = getPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  // clamp page to range
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // only send this page's posts to the template
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  res.render("./all.ejs", {
    posts: paginatedPosts,
    success: req.query.success,
    currentPage,
    totalPages,
    startIndex, // pass this so EJS can compute a global id
  });
});

app.get("/posts/:id/:slug", (req, res) => {
  const posts = getPosts();
  const rawId = req.params.id;
  const id = parseInt(rawId.replace("f", "")) - 1;

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

app.get("/posts.json", (req, res) => {
  res.sendFile(path.join(path.resolve(), "posts.json"));
});

app.listen(port, () => {
  console.log(`Server is online at ${port}!`);
});
