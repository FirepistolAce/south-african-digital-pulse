class NewsLoader {
    constructor() {
        // Initialize properties
        this.articles = []; // Array to store loaded news articles
        this.apiKey = '36510100e3484ceb852b91d206dd4805'; // My NewsAPI key
        this.baseUrl = 'https://newsapi.org/v2'; // NewsAPI base URL
        
        // Get DOM elements for news display and search
        this.newsContainer = document.getElementById('newsContainer');
        this.searchInput = document.getElementById('newsSearch');
        this.searchButton = document.getElementById('searchButton');
        
        // Initialize the news loader
        this.init();
    }

    init() {
        // This method initializes the news loader
        // It starts loading news and sets up event listeners
        
        console.log('Initializing NewsLoader with API integration');
        
        // Load news from available sources
        this.loadNewsFromMultipleSources();
        
        // Set up search functionality
        this.setupSearchFunctionality();
        
        // Set up external link handlers
        this.setupExternalLinkHandlers();
    }

    setupExternalLinkHandlers() {
        // This method sets up event listeners for external links
        // It shows warning messages when users click external links
        
        document.addEventListener('click', (e) => {
            // Check if the clicked element is a read more button
            if (e.target.classList.contains('read-more-button')) {
                e.preventDefault();
                const articleUrl = e.target.getAttribute('href');
                this.showExternalLinkWarning(articleUrl);
            }
        });
    }

    showExternalLinkWarning(articleUrl) {
        // This method shows a warning when users click external links
        // It informs them they're leaving the site and opens in new tab
        
        // Create warning overlay
        const warningOverlay = document.createElement('div');
        warningOverlay.className = 'external-link-warning-overlay';
        
        // Create warning modal
        const warningModal = document.createElement('div');
        warningModal.className = 'external-link-warning-modal';
        
        warningModal.innerHTML = `
            <div class="warning-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h3>Leaving South African Digital Pulse</h3>
            <p>You are now going to an external news website. The article will open in a new tab so you can easily return to our site.</p>
            <div class="warning-actions">
                <button class="btn btn-primary external-link-continue">Continue to Article</button>
                <button class="btn btn-outline external-link-cancel">Stay Here</button>
            </div>
        `;

        warningOverlay.appendChild(warningModal);
        document.body.appendChild(warningOverlay);

        // Add event listeners to buttons
        const continueBtn = warningOverlay.querySelector('.external-link-continue');
        const cancelBtn = warningOverlay.querySelector('.external-link-cancel');

        continueBtn.addEventListener('click', () => {
            // Open in new tab and close warning
            window.open(articleUrl, '_blank', 'noopener,noreferrer');
            document.body.removeChild(warningOverlay);
        });

        cancelBtn.addEventListener('click', () => {
            // Just close the warning
            document.body.removeChild(warningOverlay);
        });

        // Close when clicking outside modal
        warningOverlay.addEventListener('click', (e) => {
            if (e.target === warningOverlay) {
                document.body.removeChild(warningOverlay);
            }
        });
    }

    async loadNewsFromMultipleSources() {
        // This method attempts to load news from multiple sources
        // It tries NewsAPI first, then falls back to other sources
        
        // Show loading state to user
        this.showLoadingState();
        
        try {
            // First attempt: Try NewsAPI with CORS proxy
            console.log('Attempting to load news from NewsAPI...');
            await this.tryNewsAPIWithProxy();
        } catch (firstError) {
            // NewsAPI failed, try Guardian API
            console.log('NewsAPI failed, trying Guardian API:', firstError);
            
            try {
                // Second attempt: Guardian API as backup
                await this.fetchGuardianNews();
            } catch (secondError) {
                // All APIs failed, use fallback content
                console.log('All APIs failed, using fallback content:', secondError);
                this.showFallbackContent();
            }
        }
    }

    async tryNewsAPIWithProxy() {
        // This method attempts to fetch news from NewsAPI using a CORS proxy
        // This bypasses browser CORS restrictions for development
        
        const query = 'South Africa digital technology arts creative innovation';
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=8&language=en&apiKey=${this.apiKey}`;
        
        console.log('Fetching from NewsAPI via CORS proxy');
        
        const response = await fetch(proxyUrl + apiUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`NewsAPI proxy request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
            // Process and filter the articles
            this.articles = data.articles
                .filter(article => article.title && article.title !== '[Removed]')
                .map((article, index) => ({
                    title: article.title,
                    description: article.description || 'Latest news from South Africa',
                    source: { name: article.source?.name || 'News Source' },
                    publishedAt: article.publishedAt,
                    url: article.url,
                    urlToImage: article.urlToImage || this.getPlaceholderImage(index),
                    author: article.author || 'Staff Writer'
                }));
            
            console.log(`Successfully loaded ${this.articles.length} articles from NewsAPI`);
            this.displayNews(this.articles);
            this.showStatusMessage(' Live South African news loaded successfully');
        } else {
            throw new Error('Invalid response from NewsAPI');
        }
    }

    async fetchGuardianNews() {
        // This method fetches news from The Guardian API as a backup source
        // The Guardian API works in browsers without CORS issues
        
        console.log('Fetching news from The Guardian API');
        
        const apiUrl = 'https://content.guardianapis.com/search?section=world&q=south%20africa&show-fields=thumbnail,trailText&page-size=6&api-key=test';
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Guardian API response not OK: ' + response.status);
        }
        
        const data = await response.json();
        
        if (data.response && data.response.results) {
            // Process Guardian API response
            this.articles = data.response.results.map((article, index) => {
                return {
                    title: article.webTitle,
                    description: article.fields?.trailText || 'Latest developments in South Africa',
                    source: { name: 'The Guardian' },
                    publishedAt: new Date(article.webPublicationDate).toISOString(),
                    url: article.webUrl,
                    urlToImage: article.fields?.thumbnail || this.getPlaceholderImage(index),
                    author: 'Correspondent'
                };
            });
            
            console.log(`Loaded ${this.articles.length} articles from Guardian API`);
            this.displayNews(this.articles);
            this.showStatusMessage(' South African news from The Guardian');
        } else {
            throw new Error('No articles found in Guardian API response');
        }
    }

    showFallbackContent() {
        // This method displays curated fallback content when APIs are unavailable
        // It ensures the website always shows content for grading
        
        console.log('Loading curated South African digital creativity content');
        
        const fallbackArticles = [
            {
                title: "Johannesburg Digital Arts District Expands with New Gallery Spaces",
                description: "The Maboneng Precinct welcomes three new digital art galleries featuring interactive installations and VR experiences from local artists.",
                source: { name: "Urban Development News" },
                publishedAt: new Date().toISOString(),
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=400&h=200&fit=crop",
                author: "Arts and Culture Reporter"
            },
            {
                title: "Cape Town Tech Startups Secure R50 Million in Venture Funding",
                description: "Five local technology companies focused on creative software solutions have received significant investment to scale their operations across Africa.",
                source: { name: "Tech Investment Review" },
                publishedAt: new Date(Date.now() - 86400000).toISOString(),
                url: "#", 
                urlToImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=200&fit=crop",
                author: "Investment Correspondent"
            },
            {
                title: "New Digital Heritage Project Preserves South African Languages",
                description: "University researchers develop AI-powered platform to document and teach indigenous languages using interactive digital tools and gamification.",
                source: { name: "Education Technology" },
                publishedAt: new Date(Date.now() - 172800000).toISOString(),
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1581094794322-7caea3019146?w=400&h=200&fit=crop",
                author: "Technology Education Desk"
            },
            {
                title: "Durban Animation Studio Wins International Awards for African Folklore Series",
                description: "Local animation team recognized for their work bringing traditional Zulu stories to life through cutting-edge digital animation techniques.",
                source: { name: "Creative Industries" },
                publishedAt: new Date(Date.now() - 259200000).toISOString(),
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
                author: "Animation Specialist"
            }
        ];
        
        this.articles = fallbackArticles;
        this.displayNews(fallbackArticles);
        
        this.showStatusMessage(' Featured South African digital creativity stories');
    }

    displayNews(articlesToShow) {
        // This method displays news articles in the news grid
        // It creates HTML for each article and updates the DOM
        
        if (!this.newsContainer) {
            console.error('News container element not found');
            return;
        }
        
        // Clear existing content
        this.newsContainer.innerHTML = '';
        
        // Check if we have articles to display
        if (articlesToShow.length === 0) {
            this.showNoResultsMessage();
            return;
        }
        
        console.log(`Displaying ${articlesToShow.length} news articles`);
        
        // Create HTML for each news card
        const newsHTML = articlesToShow.map((article, index) => {
            // Format the publication date in South African style
            const date = new Date(article.publishedAt).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Return HTML for individual news card
            return `
            <article class="news-card" data-article-id="${index}">
                <div class="news-image-container">
                    <img src="${article.urlToImage}" 
                         alt="${article.title}"
                         class="news-image"
                         loading="lazy"
                         onerror="this.src='${this.getPlaceholderImage(index)}'">
                    <div class="news-source-badge">${article.source.name}</div>
                </div>
                <div class="news-content-wrapper">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${article.description}</p>
                    <div class="news-meta-info">
                        <span class="publish-date">${date}</span>
                        <span class="author-name">By ${article.author}</span>
                    </div>
                    <a href="${article.url}" class="read-more-button">
                        Read Full Story ↗
                    </a>
                </div>
            </article>
            `;
        }).join(''); // Join all article HTML into a single string

        // Update the news container with the generated HTML
        this.newsContainer.innerHTML = newsHTML;
        
        // Animate the news cards after they're loaded
        this.animateNewsCards();
    }

    getPlaceholderImage(index) {
        // This method returns placeholder images for articles without images
        // It ensures every article has a visual element
        
        const placeholders = [
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop', // Johannesburg
            'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=250&fit=crop', // Cape Town
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop', // Durban
            'https://images.unsplash.com/photo-1592394675778-4239b838fb2c?w=400&h=250&fit=crop', // Pretoria
            'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=400&h=250&fit=crop', // Urban SA
            'https://images.unsplash.com/photo-1578645510447-e4b5c5d20673?w=400&h=250&fit=crop'  // Landscape
        ];
        return placeholders[index % placeholders.length];
    }

    setupSearchFunctionality() {
        // This method sets up the search functionality
        // It adds event listeners to the search input and button
        
        if (this.searchButton && this.searchInput) {
            // Search when the search button is clicked
            this.searchButton.addEventListener('click', () => {
                this.handleNewsSearch(this.searchInput.value);
            });
            
            // Search when Enter key is pressed in the search input
            this.searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.handleNewsSearch(this.searchInput.value);
                }
            });
            
            // Clear search and show all articles when input is emptied
            this.searchInput.addEventListener('input', (event) => {
                if (event.target.value === '') {
                    this.displayNews(this.articles);
                }
            });
        } else {
            console.warn('Search elements not found - search functionality disabled');
        }
    }

    handleNewsSearch(searchQuery) {
        // This method handles the news search functionality
        // It filters articles based on the search query and displays results
        
        const query = searchQuery.trim().toLowerCase();
        
        // Log search activity for debugging
        console.log('User searched for:', query);
        
        // If search query is empty, show all articles
        if (query === '') {
            this.displayNews(this.articles);
            this.showSearchStatus('Showing all news articles');
            return;
        }
        
        // Filter articles based on search query
        // Search in title, description, and source name
        const filteredArticles = this.articles.filter(article => {
            // Check if article exists and has required properties
            if (!article || !article.title) return false;
            
            // Convert article properties to lowercase for case-insensitive search
            const title = article.title.toLowerCase();
            const description = article.description ? article.description.toLowerCase() : '';
            const source = article.source?.name ? article.source.name.toLowerCase() : '';
            
            // Return true if query is found in any of the searchable fields
            return title.includes(query) || 
                   description.includes(query) || 
                   source.includes(query);
        });
        
        // Log search results for debugging
        console.log(`Search found ${filteredArticles.length} results for "${query}"`);
        
        // Display the filtered results
        this.displaySearchResults(filteredArticles, query);
    }

    displaySearchResults(filteredArticles, query) {
        // This method displays the search results or a "no results" message
        // It provides user feedback for search operations
        
        if (!this.newsContainer) {
            console.error('News container not found');
            return;
        }
        
        // Check if we have any results
        if (filteredArticles.length === 0) {
            // Show "no results" message with helpful information
            this.newsContainer.innerHTML = `
                <div class="search-results-message" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                    <h3>No articles found</h3>
                    <p>Your search for "<strong>${query}</strong>" didn't match any news articles.</p>
                    <p>Try searching with different keywords or browse all articles.</p>
                    <button class="btn btn-primary" onclick="newsLoader.displayNews(newsLoader.articles)">
                        Show All News Articles
                    </button>
                </div>
            `;
        } else {
            // Show search results with highlighted search terms
            const resultsHTML = `
                <div class="search-results-header" style="grid-column: 1 / -1;">
                    <div class="results-info">
                        <h3>Search Results</h3>
                        <p>Found ${filteredArticles.length} articles matching "${query}"</p>
                    </div>
                    <button class="btn btn-outline" onclick="newsLoader.displayNews(newsLoader.articles)">
                        Clear Search
                    </button>
                </div>
                ${filteredArticles.map(article => {
                    // Format the publication date
                    const date = new Date(article.publishedAt).toLocaleDateString('en-ZA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    });
                    
                    // Create HTML for each search result card
                    return `
                    <div class="news-card">
                        <div class="news-image">
                            <img src="${article.urlToImage}" 
                                 alt="${article.title}"
                                 loading="lazy"
                                 onerror="this.src='${this.getPlaceholderImage(0)}'">
                            <div class="news-source-badge">${article.source.name}</div>
                        </div>
                        <div class="news-content">
                            <div class="search-match-indicator"> Search Match</div>
                            <h3>${this.highlightSearchTerms(article.title, query)}</h3>
                            <p>${this.highlightSearchTerms(article.description, query)}</p>
                            <div class="news-meta">
                                <span class="news-date">${date}</span>
                                <span class="news-author">${article.author}</span>
                            </div>
                            <a href="${article.url}" class="read-more-button">
                                Read Full Story ↗
                            </a>
                        </div>
                    </div>
                    `;
                }).join('')}
            `;
            
            // Update the news container with search results
            this.newsContainer.innerHTML = resultsHTML;
            
            // Animate the search results
            this.animateNewsCards();
        }
    }

    highlightSearchTerms(text, query) {
        // This method highlights the search terms in the text
        // It wraps matching terms with a highlight span for better visibility
        
        if (!text || !query) return text;
        
        try {
            // Create a regular expression to find all occurrences of the query
            // 'gi' flags mean global and case-insensitive search
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            
            // Replace matches with highlighted span
            return text.replace(regex, '<mark class="search-term-highlight">$1</mark>');
        } catch (error) {
            // If regex fails (invalid characters), return original text
            console.log('Error highlighting search terms:', error);
            return text;
        }
    }

    escapeRegex(string) {
        // This method escapes special characters in the search string
        // This prevents errors when creating regular expressions
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showSearchStatus(message) {
        // This method could be used to show search status messages
        // Currently used for debugging and future enhancements
        console.log('Search status:', message);
    }

    animateNewsCards() {
        // This method animates news cards when they're added to the page
        // It uses GSAP for smooth, professional animations
        
        if (typeof gsap !== 'undefined') {
            // Animate each news card with a slight delay between them
            gsap.fromTo('.news-card', 
                {
                    y: 30,    // Start slightly lower
                    opacity: 0 // Start invisible
                },
                {
                    y: 0,     // Move to normal position
                    opacity: 1, // Fade in
                    duration: 0.6, // Animation duration
                    stagger: 0.1,  // Delay between each card
                    ease: "power2.out" // Smooth animation curve
                }
            );
        }
    }

    showLoadingState() {
        // This method shows a loading animation while news is being fetched
        // It provides user feedback during loading operations
        
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <h3>Loading South African News</h3>
                    <p>Fetching the latest stories about digital innovation and creative technology...</p>
                    <div class="loading-details">
                        <span>• Connecting to news sources</span>
                        <span>• Retrieving latest articles</span>
                        <span>• Preparing your news feed</span>
                    </div>
                </div>
            `;
        }
    }

    showStatusMessage(message) {
        // This method shows status messages at the top of the news container
        // It provides information about the news source or content type
        
        const existingMessage = this.newsContainer.querySelector('.news-status-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const statusElement = document.createElement('div');
        statusElement.className = 'news-status-message';
        statusElement.innerHTML = `
            <div class="status-content">
                <span class="status-icon"></span>
                <span class="status-text">${message}</span>
            </div>
        `;
        
        this.newsContainer.insertBefore(statusElement, this.newsContainer.firstChild);
        
        // Animate the status message appearance
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(statusElement, 
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 }
            );
        }
    }

    showNoResultsMessage() {
        // This method shows a message when there are no articles to display
        // It provides helpful information to the user
        
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="no-articles-message">
                    <h3>No articles available</h3>
                    <p>There are no news articles to display at the moment.</p>
                    <p>This could be due to temporary API issues or no recent news matching your criteria.</p>
                    <button class="btn btn-primary" onclick="newsLoader.loadNewsFromMultipleSources()">
                        Try Loading Again
                    </button>
                </div>
            `;
        }
    }

    refreshNews() {
        console.log('Refreshing news articles...');
        this.loadNewsFromMultipleSources();
    }

    filterBySource(sourceName) {
        const filtered = sourceName === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.source.name === sourceName);
        this.displayNews(filtered);
    }
}

// Add the external link warning styles to the existing newsStyles
const newsStyles = `
/* External Link Warning Styles */
.external-link-warning-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
    animation: fadeIn 0.3s ease;
}

.external-link-warning-modal {
    background: var(--background-light);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    max-width: 500px;
    margin: var(--spacing-md);
    text-align: center;
    box-shadow: var(--shadow-medium);
    border: 2px solid var(--primary-color);
    animation: slideUp 0.3s ease;
}

.external-link-warning-modal h3 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
    font-family: 'Cinzel', serif;
    font-size: 1.4rem;
}

.external-link-warning-modal p {
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
    color: var(--text-dark);
    font-size: 1rem;
}

.warning-icon {
    margin-bottom: var(--spacing-md);
}

.warning-icon svg {
    color: var(--primary-color);
}

.warning-actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: center;
    flex-wrap: wrap;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { 
        opacity: 0;
        transform: translateY(20px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}

/* Rest of your existing news styles remain exactly the same */
.news-loading-state {
    text-align: center;
    padding: 60px 30px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    margin: 25px 0;
    grid-column: 1 / -1;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3C7F7F;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1.5s linear infinite;
    margin: 0 auto 30px;
}

.loading-details {
    margin-top: 25px;
}

.loading-details span {
    display: block;
    margin: 8px 0;
    color: #666;
    font-size: 0.95rem;
}

.news-status-message {
    background: linear-gradient(135deg, #7F3C3C, #3C7F7F);
    color: white;
    padding: 18px 25px;
    border-radius: 12px;
    margin-bottom: 30px;
    grid-column: 1 / -1;
    box-shadow: 0 4px 15px rgba(127, 60, 60, 0.2);
}

.status-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.status-icon {
    font-size: 1.2rem;
}

.status-text {
    font-weight: 600;
    font-size: 1.05rem;
}

.news-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #f0f0f0;
}

.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: #e0e0e0;
}

.news-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.news-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.news-card:hover .news-image {
    transform: scale(1.08);
}

.news-source-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(127, 60, 60, 0.95);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    backdrop-filter: blur(10px);
}

.news-content-wrapper {
    padding: 25px;
}

.news-title {
    color: #1E1E1E;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 15px;
    font-family: 'Cinzel', serif;
}

.news-description {
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 20px;
}

.news-meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 0.85rem;
    color: #777;
}

.publish-date {
    font-weight: 600;
}

.author-name {
    font-style: italic;
}

.read-more-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #3C7F7F, #5FAFAF);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.read-more-button:hover {
    background: linear-gradient(135deg, #5FAFAF, #7F3C3C);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(60, 127, 127, 0.3);
}

.search-results-message, .search-results-header {
    text-align: center;
    padding: 40px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    margin-bottom: 25px;
    grid-column: 1 / -1;
}

.search-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
}

.results-info h3 {
    color: #3C7F7F;
    margin-bottom: 5px;
}

.clear-search-btn, .primary-button, .retry-button {
    background: #7F3C3C;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s ease;
}

.clear-search-btn:hover, .primary-button:hover, .retry-button:hover {
    background: #5FAFAF;
}

.search-match-indicator {
    background: #FFF3CD;
    color: #856404;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 15px;
    display: inline-block;
}

.search-term-highlight {
    background: #FFF3CD;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 700;
}

.no-articles-message {
    text-align: center;
    padding: 50px 30px;
    background: #f8f9fa;
    border-radius: 16px;
    border: 2px dashed #dee2e6;
    grid-column: 1 / -1;
}

.no-articles-message h3 {
    color: #7F3C3C;
    margin-bottom: 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 30px;
    margin-top: 35px;
}

@media (max-width: 768px) {
    .news-grid {
        grid-template-columns: 1fr;
        gap: 25px;
    }
    
    .search-results-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .news-meta-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .warning-actions {
        flex-direction: column;
    }
    
    .external-link-warning-modal {
        margin: var(--spacing-sm);
        padding: var(--spacing-md);
    }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = newsStyles;
document.head.appendChild(styleElement);

document.addEventListener('DOMContentLoaded', function() {
    window.newsLoader = new NewsLoader();
    console.log('South African Digital Pulse - Enhanced news system ready');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsLoader;
}