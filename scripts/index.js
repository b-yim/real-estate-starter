// Dark mode toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "dark-mode");
  } else {
    localStorage.setItem("mode", "light-mode");
  }
}

// Save the theme
if (localStorage.getItem("mode") === "dark-mode") {
  document.body.classList.add("dark-mode");
}






// navbar scrolled
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar-content");
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
