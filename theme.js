// Apply theme as early as possible
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.classList.add(savedTheme);
}

document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;
    // Set initial button state
    const savedTheme = localStorage.getItem("theme");
    themeToggle.textContent = savedTheme === "dark-theme" ? "☀️" : "🌙";
    themeToggle.addEventListener("click", () => {
        if (document.documentElement.classList.contains("dark-theme")) {
            document.documentElement.classList.remove("dark-theme");
            themeToggle.textContent = "🌙";
            localStorage.setItem("theme", "light-theme");
        } else {
            document.documentElement.classList.add("dark-theme");
            themeToggle.textContent = "☀️";
            localStorage.setItem("theme", "dark-theme");
        }
    });
}); 