// news-loader.js - News API integration for South African Digital Pulse
// Student: Rofhiwa Sikhweni
// This handles news loading from multiple sources with search functionality

class NewsLoader {
    constructor() {
        // Store articles and DOM elements
        this.articles = [];
        this.newsContainer = document.getElementById('newsContainer');
        this.searchInput = document.getElementById('newsSearch');
        this.searchButton = document.getElementById('searchButton');
        this.apiKey = '36510100e3484ceb852b91d206dd4805'; // My NewsAPI key
        
        // Initialize when class is created
        this.init();
    }

    init() {
        // Start loading news and set up event listeners
        this.loadNewsFromMultipleSources();
        this.setupEventListeners();
        
        console.log('News loader initialized with API key');
    }

    async loadNewsFromMultipleSources() {
        // Show loading state while fetching news
        this.showLoadingState();
        
        try {
            // First try: NewsAPI with CORS proxy
            await this.tryNewsAPIWithProxy();
        } catch (firstError) {
            console.log('NewsAPI with proxy failed:', firstError);
            
            try {
                // Second try: Guardian API as backup
                await this.fetchGuardianNews();
            } catch (secondError) {
                console.log('Guardian API also failed:', secondError);
                // Final fallback: Curated South African content
                this.showFallbackContent();
            }
        }
    }

    async tryNewsAPIWithProxy() {
        // Try to use NewsAPI with a CORS proxy
        console.log('Attempting NewsAPI with CORS proxy...');
        
        // Search for South African digital and creative topics
        const query = 'South Africa digital technology arts creative innovation';
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=8&language=en&apiKey=${this.apiKey}`;
        
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
            // Process NewsAPI articles
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
            this.showStatusMessage('📡 Live South African news loaded successfully');
        } else {
            throw new Error('Invalid response from NewsAPI');
        }
    }

    async fetchGuardianNews() {
        // Backup news source: The Guardian API
        console.log('Trying Guardian API as backup...');
        
        const apiUrl = 'https://content.guardianapis.com/search?section=world&q=south%20africa&show-fields=thumbnail,trailText&page-size=6&api-key=test';
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Guardian API response not OK: ' + response.status);
        }
        
        const data = await response.json();
        
        if (data.response && data.response.results) {
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
            this.showStatusMessage('📰 South African news from The Guardian');
        } else {
            throw new Error('No articles found in Guardian API response');
        }
    }

    showFallbackContent() {
        // Curated fallback content about South African digital creativity
        console.log('Loading curated South African content');
        
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
            },
            {
                title: "Pretoria University Launches Africa's First Digital Arts Research Center",
                description: "New facility will focus on the intersection of African artistic traditions and emerging digital technologies, offering postgraduate programs.",
                source: { name: "Academic Innovation" },
                publishedAt: new Date(Date.now() - 345600000).toISOString(),
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop",
                author: "Education Affairs"
            },
            {
                title: "South African Game Developers Showcase at International Convention",
                description: "Local gaming studios present titles featuring African mythology and landscapes, attracting attention from major international publishers.",
                source: { name: "Gaming and Entertainment" },
                publishedAt: new Date(Date.now() - 432000000).toISOString(),
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop",
                author: "Entertainment Reporter"
            }
        ];
        
        this.articles = fallbackArticles;
        this.displayNews(fallbackArticles);
        
        this.showStatusMessage('🌟 Featured South African digital creativity stories');
    }

    displayNews(articles) {
        // Display articles in the news container with professional layout
        if (!this.newsContainer) {
            console.error('News container element not found');
            return;
        }
        
        // Create HTML for each news card
        const newsHTML = articles.map((article, index) => {
            // Format the date in South African style
            const date = new Date(article.publishedAt).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
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
                    <a href="${article.url}" target="_blank" rel="noopener" class="read-more-button">
                        Read Full Story ↗
                    </a>
                </div>
            </article>
            `;
        }).join('');

        // Update the news container
        this.newsContainer.innerHTML = newsHTML;
        
        // Animate the news cards with GSAP
        this.animateNewsCards();
    }

    getPlaceholderImage(index) {
        // High-quality placeholder images representing South Africa
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

    setupEventListeners() {
        // Set up comprehensive search functionality
        if (this.searchButton && this.searchInput) {
            // Search when button is clicked
            this.searchButton.addEventListener('click', () => {
                this.handleNewsSearch(this.searchInput.value);
            });
            
            // Search when Enter key is pressed
            this.searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.handleNewsSearch(this.searchInput.value);
                }
            });
            
            // Clear search when input is empty
            this.searchInput.addEventListener('input', (event) => {
                if (event.target.value === '') {
                    this.displayNews(this.articles);
                }
            });
        }
    }

    handleNewsSearch(searchQuery) {
        // Advanced search functionality across multiple article fields
        const query = searchQuery.trim().toLowerCase();
        
        // If search is empty, show all articles
        if (query === '') {
            this.displayNews(this.articles);
            return;
        }
        
        console.log('Performing search for: ' + query);
        
        // Filter articles based on comprehensive search
        const filteredArticles = this.articles.filter(article => {
            const searchableContent = `
                ${article.title} 
                ${article.description} 
                ${article.source.name}
                ${article.author}
            `.toLowerCase();

            return searchableContent.includes(query);
        });
        
        // Display appropriate search results
        this.displaySearchResults(filteredArticles, query);
    }

    displaySearchResults(filteredArticles, query) {
        if (!this.newsContainer) return;
        
        if (filteredArticles.length === 0) {
            // Show user-friendly no results message
            this.newsContainer.innerHTML = `
                <div class="search-results-container">
                    <div class="no-results-message">
                        <h3>No matching articles found</h3>
                        <p>Your search for "<strong>${query}</strong>" did not match any news articles.</p>
                        <p>Try different keywords or browse all articles below.</p>
                        <button class="primary-button" onclick="newsLoader.displayNews(newsLoader.articles)">
                            View All News Articles
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Show search results with highlighted terms
            const resultsHTML = `
                <div class="search-results-header">
                    <div class="results-count">
                        <h3>Search Results</h3>
                        <p>Found ${filteredArticles.length} articles matching "${query}"</p>
                    </div>
                    <button class="secondary-button" onclick="newsLoader.displayNews(newsLoader.articles)">
                        Clear Search Results
                    </button>
                </div>
                <div class="search-results-grid">
                    ${filteredArticles.map(article => `
                        <article class="news-card search-result-card">
                            <div class="news-content-wrapper">
                                <div class="search-match-indicator">🔍 Search Match</div>
                                <h3 class="news-title">${this.highlightSearchTerms(article.title, query)}</h3>
                                <p class="news-description">${this.highlightSearchTerms(article.description, query)}</p>
                                <div class="news-meta-info">
                                    <span class="news-source">Source: ${article.source.name}</span>
                                    <span class="publish-date">${new Date(article.publishedAt).toLocaleDateString('en-ZA')}</span>
                                </div>
                                <a href="${article.url}" target="_blank" class="read-more-button">
                                    Read Full Article ↗
                                </a>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;
            
            this.newsContainer.innerHTML = resultsHTML;
            this.animateNewsCards();
        }
    }

    highlightSearchTerms(text, query) {
        // Highlight search terms in the text for better visibility
        if (!text || !query) return text;
        
        try {
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            return text.replace(regex, '<mark class="search-term-highlight">$1</mark>');
        } catch (error) {
            console.log('Error highlighting search terms:', error);
            return text;
        }
    }

    escapeRegex(string) {
        // Escape special characters for regex search
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    animateNewsCards() {
        // Professional animation for news cards using GSAP
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.news-card', 
                { 
                    y: 40, 
                    opacity: 0,
                    scale: 0.95
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    duration: 0.7, 
                    stagger: 0.15, 
                    ease: "power2.out" 
                }
            );
        }
    }

    showLoadingState() {
        // Professional loading animation
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="news-loading-state">
                    <div class="loading-animation">
                        <div class="loading-spinner"></div>
                        <div class="loading-pulse"></div>
                    </div>
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
        // Show status message with smooth animation
        const existingMessage = this.newsContainer.querySelector('.news-status-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const statusElement = document.createElement('div');
        statusElement.className = 'news-status-message';
        statusElement.innerHTML = `
            <div class="status-content">
                <span class="status-icon">📰</span>
                <span class="status-text">${message}</span>
            </div>
        `;
        
        this.newsContainer.insertBefore(statusElement, this.newsContainer.firstChild);
        
        // Animate the status message
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(statusElement, 
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 }
            );
        }
    }

    // Public method to refresh news
    refreshNews() {
        console.log('Refreshing news articles...');
        this.loadNewsFromMultipleSources();
    }

    // Public method to filter by source
    filterBySource(sourceName) {
        const filtered = sourceName === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.source.name === sourceName);
        this.displayNews(filtered);
    }
}

// Enhanced CSS styles for professional appearance
const newsStyles = `
.news-loading-state {
    text-align: center;
    padding: 60px 30px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    margin: 25px 0;
    grid-column: 1 / -1;
}

.loading-animation {
    position: relative;
    margin: 0 auto 30px;
    width: 80px;
    height: 80px;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3C7F7F;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1.5s linear infinite;
    margin: 0 auto;
}

.loading-pulse {
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    border: 2px solid #7F3C3C;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
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

.search-results-container {
    grid-column: 1 / -1;
}

.no-results-message {
    text-align: center;
    padding: 50px 30px;
    background: #f8f9fa;
    border-radius: 16px;
    border: 2px dashed #dee2e6;
}

.no-results-message h3 {
    color: #7F3C3C;
    margin-bottom: 15px;
}

.primary-button {
    background: #7F3C3C;
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-top: 20px;
}

.primary-button:hover {
    background: #5FAFAF;
}

.search-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    background: #f8f9fa;
    border-radius: 12px;
    margin-bottom: 25px;
    grid-column: 1 / -1;
}

.results-count h3 {
    color: #3C7F7F;
    margin-bottom: 5px;
}

.secondary-button {
    background: transparent;
    color: #7F3C3C;
    border: 2px solid #7F3C3C;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.secondary-button:hover {
    background: #7F3C3C;
    color: white;
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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
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
}
`;

// Inject the enhanced styles
const styleElement = document.createElement('style');
styleElement.textContent = newsStyles;
document.head.appendChild(styleElement);

// Initialize news loader when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.newsLoader = new NewsLoader();
    
    // Log initialization for debugging
    console.log('South African Digital Pulse - Enhanced news system ready');
});