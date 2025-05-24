const quote = document.getElementById("quote");
const author = document.getElementById("author");
const newQuoteButton = document.getElementById("new-quote");

// Get random AI-generated quote
async function getRandomQuote() {
    try {
        quote.textContent = "Loading...";
        author.textContent = "";
        quote.classList.add("loading");

        const response = await fetch('https://chillecs.github.io/quotes-api/AIquotes.json');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        const selectedQuote = data.quotes[randomIndex];
        
        quote.textContent = `"${selectedQuote.text}"`;
        author.textContent = `— ${selectedQuote.author}`;
    } catch (error) {
        console.error("Error loading quote:", error);
        quote.textContent = "Failed to load quote.";
        author.textContent = "";
    } finally {
        quote.classList.remove("loading");
    }
}

// Initial quote load
document.addEventListener("DOMContentLoaded", () => {
    getRandomQuote();
});

// Event listener for new quote button
newQuoteButton.addEventListener("click", () => {
    getRandomQuote();
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

// Back button event listener
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'index.html';
}); 