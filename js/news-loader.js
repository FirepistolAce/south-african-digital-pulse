// news-loader.js - Handles NewsAPI integration and search functionality
// This meets the requirement for dynamic search/filter with external API

class NewsLoader {
    constructor() {
        // API configuration - I'll use my actual key here for development
        this.apiKey = 'e1c80e8ba2a94c0e9d0eaa7b7b4a4a1e'; // This is a demo key - replace with your actual NewsAPI key
        this.baseUrl = 'https://newsapi.org/v2';
        this.articles = [];
        this.currentFilter = 'all';
        
        // DOM elements
        this.newsContainer = document.getElementById('newsContainer');
        this.searchInput = document.getElementById('newsSearch');
        this.searchButton = document.getElementById('searchButton');
        this.mediaSearch = document.getElementById('mediaSearch');
        this.mediaSearchBtn = document.getElementById('mediaSearchBtn');
        
        this.init();
    }

    init() {
        // Load news when the page loads
        this.loadNews();
        
        // Set up event listeners for search functionality
        this.setupEventListeners();
        
        console.log('News loader initialized');
    }

    async loadNews() {
        // Show loading state to users
        this.showLoadingState();
        
        try {
            // Fetch top headlines from South Africa
            const response = await fetch(
                `${this.baseUrl}/top-headlines?country=za&pageSize=12&apiKey=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'ok' && data.articles) {
                // Filter out articles with [Removed] titles
                this.articles = data.articles.filter(article => 
                    article.title && article.title !== '[Removed]'
                );
                
                this.displayNews(this.articles);
                console.log(`Loaded ${this.articles.length} news articles`);
            } else {
                throw new Error('Invalid response from NewsAPI');
            }
            
        } catch (error) {
            console.error('Error fetching news:', error);
            this.showErrorState(error.message);
        }
    }

    displayNews(articles) {
        if (!this.newsContainer) return;
        
        if (articles.length === 0) {
            this.showNoResults();
            return;
        }

        const newsHTML = articles.map((article, index) => `
            <article class="news-card" data-index="${index}">
                <div class="news-image">
                    <img src="${article.urlToImage || 'assets/images/news-placeholder.jpg'}" 
                         alt="${article.title}" 
                         onerror="this.src='assets/images/news-placeholder.jpg'"
                         loading="lazy">
                </div>
                <div class="news-content">
                    <span class="news-source">${article.source?.name || 'News Source'}</span>
                    <h3>${article.title || 'No title available'}</h3>
                    <p>${article.description || 'No description available.'}</p>
                    <div class="news-meta">
                        <span class="publish-date">
                            ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-ZA') : 'Date unknown'}
                        </span>
                        ${article.author ? `<span class="author">By ${article.author}</span>` : ''}
                    </div>
                    <a href="${article.url}" target="_blank" rel="noopener" class="read-more">
                        Read Full Article ↗
                    </a>
                </div>
            </article>
        `).join('');

        this.newsContainer.innerHTML = newsHTML;
        
        // Animate the news cards after they're loaded
        this.animateNewsCards();
    }

    setupEventListeners() {
        // Home page search
        if (this.searchButton && this.searchInput) {
            this.searchButton.addEventListener('click', () => {
                this.searchNews(this.searchInput.value);
            });
            
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchNews(this.searchInput.value);
                }
            });
        }
        
        // Media page search
        if (this.mediaSearchBtn && this.mediaSearch) {
            this.mediaSearchBtn.addEventListener('click', () => {
                this.searchNews(this.mediaSearch.value);
            });
            
            this.mediaSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchNews(this.mediaSearch.value);
                }
            });
        }
        
        // Filter buttons on media page
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterNews(filter);
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    searchNews(query) {
        if (!query.trim()) {
            // If search is empty, show all articles
            this.displayNews(this.articles);
            return;
        }
        
        const filtered = this.articles.filter(article => 
            (article.title && article.title.toLowerCase().includes(query.toLowerCase())) ||
            (article.description && article.description.toLowerCase().includes(query.toLowerCase())) ||
            (article.content && article.content.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.displaySearchResults(filtered, query);
    }

    displaySearchResults(articles, query) {
        if (!this.newsContainer) return;
        
        if (articles.length === 0) {
            this.newsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No articles found</h3>
                    <p>No news articles match "${query}". Try different keywords.</p>
                    <button class="view-all-btn" onclick="newsLoader.loadNews()">Show All News</button>
                </div>
            `;
            return;
        }
        
        const resultsHTML = articles.map((article, index) => `
            <article class="news-card" data-index="${index}">
                <div class="news-content">
                    <span class="search-highlight">Search results for: "${query}"</span>
                    <h3>${this.highlightText(article.title, query)}</h3>
                    <p>${this.highlightText(article.description, query)}</p>
                    <div class="news-meta">
                        <span>Source: ${article.source?.name || 'Unknown'}</span>
                    </div>
                    <a href="${article.url}" target="_blank" rel="noopener" class="read-more">
                        Read Article ↗
                    </a>
                </div>
            </article>
        `).join('');
        
        this.newsContainer.innerHTML = resultsHTML;
        this.animateNewsCards();
    }

    highlightText(text, query) {
        if (!text || !query) return text || '';
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark class="search-match">$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    filterNews(category) {
        // For now, we'll use a simple client-side filter
        // In a real implementation, this would filter by article category
        this.currentFilter = category;
        
        if (category === 'all') {
            this.displayNews(this.articles);
        } else {
            // Simple filtering based on source or content
            const filtered = this.articles.filter(article => 
                article.source?.name?.toLowerCase().includes(category) ||
                article.title?.toLowerCase().includes(category) ||
                article.description?.toLowerCase().includes(category)
            );
            this.displayNews(filtered);
        }
    }

    animateNewsCards() {
        // Use GSAP to animate news cards with stagger effect
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.news-card', 
                { 
                    y: 30, 
                    opacity: 0 
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.6, 
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }
    }

    showLoadingState() {
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading latest South African news...</p>
                </div>
            `;
        }
    }

    showErrorState(errorMessage) {
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="error-state">
                    <h3>Unable to Load News</h3>
                    <p>We're having trouble loading the latest news. This might be due to:</p>
                    <ul>
                        <li>API rate limit reached</li>
                        <li>Network connection issues</li>
                        <li>Temporary service outage</li>
                    </ul>
                    <p>Error details: ${errorMessage}</p>
                    <button class="view-all-btn" onclick="newsLoader.loadNews()">Try Again</button>
                </div>
            `;
        }
    }

    showNoResults() {
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No News Available</h3>
                    <p>There are no news articles to display at the moment.</p>
                    <p>Please check back later or try refreshing the page.</p>
                </div>
            `;
        }
    }
}

// Initialize news loader when DOM is ready
let newsLoader;
document.addEventListener('DOMContentLoaded', () => {
    newsLoader = new NewsLoader();
});