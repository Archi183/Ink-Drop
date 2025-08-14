import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsFilePath = path.join(__dirname, "posts.json");

function loadPosts() {
  if (fs.existsSync(postsFilePath)) {
    const data = fs.readFileSync(postsFilePath, "utf-8");
    return JSON.parse(data);
  }
  return [];
}

function savePosts(posts) {
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

let posts = loadPosts();

export function getPosts() {
  return posts;
}

export function addPost(newPost) {
  posts.unshift(newPost);
  savePosts(posts);
}

export function getFeatured() {
  return [
    {
      title: "Welcome to My Blog!",
      content:
        "Hey there! This is my personal blog app built with Node.js and Express. I created this space to share my journey, thoughts, and mini-projects. Whether you're a fellow dev or just curious, feel free to read through my posts. More features will be added soon!",
      image: "/images/WelcomeToBlog.jpg", // Placeholder for an image
    },
    {
      title: "How to Use This Blog",
      content:
        "To read posts, just scroll through the homepage.\nWant to read a post in full? Click read more!\nIf you're seeing the 'Compose' button, that means you can add more posts — feel free to add your own post and test how things work. This is still a solo project right now, but ideas are welcome!",
      image: "/images/HowToUse.jpg", // Placeholder for an image
    },
    {
      title: "Features (So Far)",
      content:
        " Create new posts via the Compose page\n View individual posts with custom URLs\n Responsive design with clean UI\n (Soon) Comments, delete, edit, dark mode, and more!\n\nIf you're curious about how it works under the hood, check out my other post titled 'How I Built My First Blog App'.",
      image: "/images/Features.jpg", // Placeholder for an image
    },
  ];
}
