const API = "http://localhost:4000/api/v1/users";

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");
const message = document.getElementById("message");

function renderToggle(isLogin) {
  toggleText.innerHTML = isLogin
    ? 'Don\'t have an account? <a href="#" id="toggle-link">Sign up</a>'
    : 'Already have an account? <a href="#" id="toggle-link">Login</a>';
  document.getElementById("toggle-link").addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    message.textContent = "";
    loginForm.style.display = isLogin ? "block" : "none";
    signupForm.style.display = isLogin ? "none" : "block";
    formTitle.textContent = isLogin ? "Login" : "Sign Up";
    renderToggle(isLogin);
  });
}

renderToggle(true);

async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const data = await login(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    window.location.href = "/posts";
  } catch (err) {
    message.textContent = err.message;
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Sign up failed");

    // auto-login after signup
    const loginData = await login(email, password);
    localStorage.setItem("accessToken", loginData.accessToken);
    window.location.href = "/posts";
  } catch (err) {
    message.textContent = err.message;
  }
});
