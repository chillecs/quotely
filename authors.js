const quote = document.getElementById("quote");
const author = document.getElementById("author");
const newQuoteButton = document.getElementById("new-quote");
const authorsList = document.getElementById("authors-list");

let currentAuthor = null;
let allQuotes = [];

// Fetch all quotes and populate authors list
async function initializeAuthors() {
    try {
        const response = await fetch('https://chillecs.github.io/quotes-api/quotes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            authorsList.innerHTML = "Error loading quotes data. Please try again later.";
            return;
        }

        if (!data || !data.quotes || !Array.isArray(data.quotes)) {
            throw new Error("Invalid data format");
        }

        // Store all quotes data
        allQuotes = data.quotes;
        
        // Get unique authors
        const authors = allQuotes.map(author => author.author);
        
        // Sort authors alphabetically
        authors.sort((a, b) => a.localeCompare(b));
        
        // Create author buttons
        authors.forEach(author => {
            const authorButton = document.createElement('button');
            authorButton.className = 'author-button';
            authorButton.textContent = author;
            authorButton.addEventListener('click', () => selectAuthor(author));
            authorsList.appendChild(authorButton);
        });
    } catch (error) {
        console.error("Error loading authors:", error);
        authorsList.innerHTML = "Failed to load authors. Please try again later.";
    }
}

// Select an author and show their quote
function selectAuthor(selectedAuthor) {
    // Properly encode the author name for the URL
    const encodedAuthor = encodeURIComponent(selectedAuthor.trim());
    window.location.href = `author-quotes.html?author=${encodedAuthor}`;
}

// Get random quote from selected author
function getAuthorQuote() {
    if (!currentAuthor) return;

    const authorData = allQuotes.find(a => a.author === currentAuthor);
    if (!authorData || !authorData.quotes || !Array.isArray(authorData.quotes)) return;

    const randomIndex = Math.floor(Math.random() * authorData.quotes.length);
    const selectedQuote = authorData.quotes[randomIndex];
    
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
    initializeAuthors();
    copyButton.style.display = 'none';
}); 