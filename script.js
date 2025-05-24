const quote = document.getElementById("quote");
const author = document.getElementById("author");
const newQuoteButton = document.getElementById("new-quote");

// Get random quote
async function getRandomQuote() {
    try {
        quote.textContent = "Loading...";
        author.textContent = "";
        quote.classList.add("loading");
        copyButton.style.display = 'none';  // Hide button while loading

        const response = await fetch('https://chillecs.github.io/quotes-api/quotes.json');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        const selectedAuthor = data.quotes[randomIndex];
        
        // Get a random quote from the author's quotes array
        const quoteIndex = Math.floor(Math.random() * selectedAuthor.quotes.length);
        const selectedQuote = selectedAuthor.quotes[quoteIndex];
        
        // Create a span for the quote text and append the copy button after it
        const quoteText = document.createElement('span');
        quoteText.textContent = `"${selectedQuote}"`;
        quote.innerHTML = '';  // Clear the quote element
        quote.appendChild(quoteText);
        quote.appendChild(copyButton);
        copyButton.style.display = 'inline-flex';  // Show button after quote is loaded
        
        author.textContent = `— ${selectedAuthor.author}`;
    } catch (error) {
        console.error("Error loading quote:", error);
        quote.textContent = "Failed to load quote.";
        author.textContent = "";
        copyButton.style.display = 'none';  // Hide button on error
    } finally {
        quote.classList.remove("loading");
    }
}

// Initial quote load directly when page loads
document.addEventListener("DOMContentLoaded", () => {
    getRandomQuote();
});

// Event listener for new quote button -- when clicked get a new random quote
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
copyButton.style.display = 'none';  // Initially hidden
copyButton.style.marginLeft = '10px';  // Add some space between quote and button
copyButton.style.verticalAlign = 'middle';  // Align with quote text
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
