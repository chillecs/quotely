const quote = document.getElementById("quote");
const author = document.getElementById("author");
const countdown = document.getElementById("countdown");

// Show loading state
function showLoading() {
    quote.textContent = "Loading...";
    author.textContent = "";
    quote.classList.add("loading");
}

// Hide loading state
function hideLoading() {
    quote.classList.remove("loading");
}

// Get daily quote
async function getDailyQuote() {
    try {
        showLoading();

        const response = await fetch('/quotes-api/quotes.json');
        const data = await response.json();
        
        // Use the current date to select a quote
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const quoteIndex = dayOfYear % data.quotes.length;
        const selectedQuote = data.quotes[quoteIndex];
        
        quote.textContent = `"${selectedQuote.text}"`;
        author.textContent = `— ${selectedQuote.author}`;

        // Save the quote for daily use
        localStorage.setItem('dailyQuote', `"${selectedQuote.text}"`);
        localStorage.setItem('dailyAuthor', `— ${selectedQuote.author}`);
    } catch (error) {
        console.error("Error loading daily quote:", error);
        quote.textContent = "Failed to load quote.";
        author.textContent = "";
    } finally {
        hideLoading();
    }
}

// Check and load daily quote
async function checkAndLoadDailyQuote() {
    const lastQuoteDate = localStorage.getItem('lastQuoteDate');
    const today = new Date().toDateString();

    if (lastQuoteDate !== today) {
        await getDailyQuote();
        localStorage.setItem('lastQuoteDate', today);
    } else {
        const savedQuote = localStorage.getItem('dailyQuote');
        const savedAuthor = localStorage.getItem('dailyAuthor');
        if (savedQuote && savedAuthor) {
            quote.textContent = savedQuote;
            author.textContent = savedAuthor;
        } else {
            await getDailyQuote();
        }
    }
}

// Update countdown timer
function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeLeft = tomorrow - now;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    checkAndLoadDailyQuote();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    setInterval(checkAndLoadDailyQuote, 60000); // Check every minute
});

// Create copy button
const copyButton = document.createElement("button");
copyButton.id = "copy-button";
const copyIcon = document.createElement("img");
copyIcon.src = "copy.png";
copyIcon.alt = "Copy";
copyButton.appendChild(copyIcon);
quote.appendChild(copyButton);

copyButton.addEventListener("click", () => {
    const quoteText = quote.textContent;
    navigator.clipboard.writeText(quoteText);
    
    // Show toast
    const toast = document.createElement("div");
    toast.textContent = "Copied to clipboard!";
    toast.className = "toast";
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}); 
