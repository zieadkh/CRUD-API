const API = "http://localhost:4000/api/v1/posts";

const token = localStorage.getItem("accessToken");
if (!token) {
  window.location.href = "/";
}

const postsContainer = document.getElementById("posts");
const message = document.getElementById("message");

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/";
});

async function loadPosts() {
  try {
    const res = await fetch(`${API}/getPosts`);
    const posts = await res.json();

    if (!res.ok) throw new Error(posts.message || "Failed to load posts");
    if (posts.length === 0) {
      postsContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    postsContainer.innerHTML = posts
      .map(
        (post) => `
        <div class="post-card">
          <h3>${post.name}</h3>
          <p>${post.description}</p>
          <p class="age">Age: ${post.age}</p>
        </div>`
      )
      .join("");
  } catch (err) {
    message.textContent = err.message;
  }
}

loadPosts();
