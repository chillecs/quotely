const quote = document.getElementById("quote");
const author = document.getElementById("author");
const authorName = document.getElementById("author-name");
const newQuoteButton = document.getElementById("new-quote");

let currentAuthor = null;
let authorQuotes = [];

// Create quote counter element
const quoteCounter = document.createElement("div");
quoteCounter.className = "quote-counter";
document.querySelector('.container').appendChild(quoteCounter);

// Get author name from URL
function getAuthorFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('author');
}

// Fetch all quotes and get author's quotes
async function initializeAuthorQuotes() {
    try {
        const author = getAuthorFromUrl();
        if (!author) {
            window.location.href = 'authors.html';
            return;
        }

        currentAuthor = decodeURIComponent(author);
        authorName.textContent = `${currentAuthor}'s Quotes`;

        const response = await fetch('https://chillecs.github.io/quotes-api/quotes.json');
        if (!response.ok) {
            throw new Error('Failed to fetch quotes');
        }

        const data = await response.json();
        if (!data || !data.quotes || !Array.isArray(data.quotes)) {
            throw new Error('Invalid data format');
        }

        // Find the author's quotes
        const authorData = data.quotes.find(a => a.author === currentAuthor);
        if (!authorData || !authorData.quotes || !Array.isArray(authorData.quotes)) {
            throw new Error('No quotes found for this author');
        }

        // Store quotes for this author
        authorQuotes = authorData.quotes;
        
        // Update quote counter
        quoteCounter.textContent = `${authorQuotes.length} quotes available in collection from this author`;
        
        // Display first quote
        getAuthorQuote();
    } catch (error) {
        console.error("Error loading quotes:", error);
        quote.textContent = "Failed to load quotes. Please try again later.";
        author.textContent = "";
        newQuoteButton.style.display = 'none';
        quoteCounter.textContent = "";
    }
}

// Get random quote from author
function getAuthorQuote() {
    if (!currentAuthor || authorQuotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * authorQuotes.length);
    const selectedQuote = authorQuotes[randomIndex];
    
    quote.textContent = `"${selectedQuote}"`;
    author.textContent = `— ${currentAuthor}`;
    copyButton.style.display = 'inline-flex';
}

// Create copy button
const copyButton = document.createElement("button");
copyButton.id = "copy-button";
const copyIcon = document.createElement("img");
copyIcon.src = "copy.png";
copyIcon.alt = "Copy";
copyButton.appendChild(copyIcon);
copyButton.style.display = 'none';
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

// Event listener for new quote button
newQuoteButton.addEventListener("click", () => {
    getAuthorQuote();
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    initializeAuthorQuotes();
});