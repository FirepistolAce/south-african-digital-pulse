// news-loader.js - Fixed NewsAPI integration with CORS proxy and fallbacks
// Using Rofhiwa's API key with proper error handling

class NewsLoader {
    constructor() {
        this.apiKey = '36510100e3484ceb852b91d206dd4805';
        this.articles = [];
        
        // DOM elements
        this.newsContainer = document.getElementById('newsContainer');
        this.searchInput = document.getElementById('newsSearch');
        this.searchButton = document.getElementById('searchButton');
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing News Loader...');
        this.loadNews();
        this.setupEventListeners();
    }

    async loadNews() {
        this.showLoadingState();
        
        try {
            // Try direct NewsAPI first
            await this.fetchNewsDirect();
        } catch (error) {
            console.log('Direct API failed, trying CORS proxy...', error);
            try {
                // Try with CORS proxy
                await this.fetchNewsWithProxy();
            } catch (proxyError) {
                console.log('CORS proxy also failed, using demo content...', proxyError);
                // Fallback to demo content
                this.showDemoContent();
            }
        }
    }

    async fetchNewsDirect() {
        console.log('📡 Attempting direct NewsAPI call...');
        
        const url = `https://newsapi.org/v2/top-headlines?country=za&pageSize=8&apiKey=${this.apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
            this.articles = data.articles.filter(article => 
                article.title && article.title !== '[Removed]'
            );
            
            if (this.articles.length > 0) {
                console.log(`✅ Loaded ${this.articles.length} real articles`);
                this.displayNews(this.articles);
            } else {
                throw new Error('No valid articles found');
            }
        } else {
            throw new Error(data.message || 'Invalid API response');
        }
    }

    async fetchNewsWithProxy() {
        console.log('🔧 Trying CORS proxy approach...');
        
        // Using a CORS proxy to avoid browser restrictions
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `https://newsapi.org/v2/top-headlines?country=za&pageSize=6&apiKey=${this.apiKey}`;
        
        const response = await fetch(proxyUrl + targetUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Proxy fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
            this.articles = data.articles.filter(article => 
                article.title && article.title !== '[Removed]'
            );
            
            if (this.articles.length > 0) {
                console.log(`✅ Loaded ${this.articles.length} articles via proxy`);
                this.displayNews(this.articles);
            } else {
                throw new Error('No articles via proxy');
            }
        } else {
            throw new Error('Proxy response invalid');
        }
    }

    displayNews(articles) {
        if (!this.newsContainer) return;
        
        console.log('🎨 Displaying news articles...');
        
        const newsHTML = articles.map((article, index) => {
            // Safe data handling
            const imageUrl = article.urlToImage || this.getPlaceholderImage(index);
            const title = article.title || 'Interesting News Story';
            const description = article.description || 'Read more about this developing story...';
            const source = article.source?.name || 'News Source';
            const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) : 'Recent';
            
            return `
            <div class="news-card">
                <div class="news-image">
                    <img src="${imageUrl}" 
                         alt="${title}"
                         loading="lazy"
                         onerror="this.src='${this.getPlaceholderImage(index)}'">
                </div>
                <div class="news-content">
                    <div class="news-source">${source}</div>
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="news-meta">
                        <span class="news-date">${date}</span>
                        ${article.author ? `<span class="news-author">By ${article.author}</span>` : ''}
                    </div>
                    <a href="${article.url || '#'}" target="_blank" rel="noopener" class="read-more">
                        Read Full Story ↗
                    </a>
                </div>
            </div>
            `;
        }).join('');

        this.newsContainer.innerHTML = newsHTML;
        this.animateNewsCards();
    }

    getPlaceholderImage(index) {
        // Different placeholder images based on index
        const colors = ['7F3C3C', '3C7F7F', '5FAFAF', '2C5530', 'F2C94C'];
        const color = colors[index % colors.length];
        return `https://via.placeholder.com/400x200/${color}/FFFFFF?text=South+African+News`;
    }

    showDemoContent() {
        console.log('📋 Showing demo content...');
        
        const demoArticles = [
            {
                title: "South African Digital Arts Festival 2025 Announced",
                description: "Johannesburg to host the largest gathering of digital artists in Southern Africa, featuring workshops and exhibitions.",
                source: { name: "Arts Council SA" },
                publishedAt: new Date().toISOString(),
                url: "#",
                author: "Cultural Reporter",
                urlToImage: this.getPlaceholderImage(0)
            },
            {
                title: "Cape Town Tech Startups Secure Major Funding",
                description: "Local technology companies receive investment to expand digital innovation across the continent.",
                source: { name: "Tech Innovation ZA" },
                publishedAt: new Date().toISOString(),
                url: "#",
                author: "Business Correspondent",
                urlToImage: this.getPlaceholderImage(1)
            },
            {
                title: "New Digital Museum Showcases African Heritage",
                description: "Interactive museum in Pretoria uses VR and AR to bring South African history to life for visitors.",
                source: { name: "Heritage News" },
                publishedAt: new Date().toISOString(),
                url: "#",
                author: "Education Desk",
                urlToImage: this.getPlaceholderImage(2)
            },
            {
                title: "Young Coders Compete in National Hackathon",
                description: "Students from across South Africa develop solutions to local challenges using technology.",
                source: { name: "Youth Tech" },
                publishedAt: new Date().toISOString(),
                url: "#",
                author: "Student Reporter",
                urlToImage: this.getPlaceholderImage(3)
            },
            {
                title: "SA Film Industry Embraces Digital Innovation",
                description: "Local filmmakers adopt new digital techniques to tell authentic South African stories.",
                source: { name: "Creative Industries" },
                publishedAt: new Date().toISOString(),
                url: "#",
                author: "Entertainment Editor",
                urlToImage: this.getPlaceholderImage(4)
            },
            {
                title: "Digital Literacy Program Expands to Rural Areas",
                description: "Initiative brings technology education and resources to underserved communities nationwide.",
                source: { name: "Community Development" },
                publishedAt: new Date().toISOString(),
                url: "#",
                author: "Social Affairs",
                urlToImage: this.getPlaceholderImage(5)
            }
        ];
        
        this.articles = demoArticles;
        this.displayNews(demoArticles);
        
        // Add demo notice
        const demoNotice = document.createElement('div');
        demoNotice.className = 'demo-notice';
        demoNotice.innerHTML = `
            <p>💡 <strong>Demo Mode:</strong> Showing sample South African news content.</p>
            <p>Real news will load automatically when the API connection is available.</p>
        `;
        this.newsContainer.insertBefore(demoNotice, this.newsContainer.firstChild);
    }

    setupEventListeners() {
        // Search functionality
        if (this.searchButton && this.searchInput) {
            this.searchButton.addEventListener('click', () => {
                this.handleSearch(this.searchInput.value);
            });
            
            this.searchInput.addEventListener('input', (e) => {
                if (e.target.value === '') {
                    this.displayNews(this.articles);
                }
            });
            
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(this.searchInput.value);
                }
            });
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.displayNews(this.articles);
            return;
        }
        
        const searchTerm = query.trim().toLowerCase();
        const filtered = this.articles.filter(article => {
            const searchableText = `
                ${article.title || ''} 
                ${article.description || ''} 
                ${article.source?.name || ''}
            `.toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
        
        this.displaySearchResults(filtered, searchTerm);
    }

    displaySearchResults(articles, query) {
        if (!this.newsContainer) return;
        
        if (articles.length === 0) {
            this.newsContainer.innerHTML = `
                <div class="search-results-message">
                    <h3>🔍 No matches found</h3>
                    <p>No articles found for "<strong>${query}</strong>"</p>
                    <button class="retry-btn" onclick="newsLoader.displayNews(newsLoader.articles)">
                        Show All Articles
                    </button>
                </div>
            `;
            return;
        }
        
        const resultsHTML = `
            <div class="search-results-header">
                <h3>🔍 Search Results</h3>
                <p>Found ${articles.length} articles for "${query}"</p>
                <button class="retry-btn" onclick="newsLoader.displayNews(newsLoader.articles)">
                    Clear Search
                </button>
            </div>
            ${articles.map(article => `
                <div class="news-card">
                    <div class="news-content">
                        <h3>${this.highlightText(article.title, query)}</h3>
                        <p>${this.highlightText(article.description, query)}</p>
                        <div class="news-meta">
                            <span>Source: ${article.source?.name}</span>
                        </div>
                        <a href="${article.url || '#'}" target="_blank" class="read-more">
                            Read Article ↗
                        </a>
                    </div>
                </div>
            `).join('')}
        `;
        
        this.newsContainer.innerHTML = resultsHTML;
        this.animateNewsCards();
    }

    highlightText(text, query) {
        if (!text || !query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    animateNewsCards() {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.news-card', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
            );
        }
    }

    showLoadingState() {
        if (this.newsContainer) {
            this.newsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <h3>Loading South African News</h3>
                    <p>Fetching the latest stories from across the country...</p>
                    <div class="loading-steps">
                        <span class="loading-step">🔌 Connecting to news source...</span>
                        <span class="loading-step">📡 Retrieving latest headlines...</span>
                        <span class="loading-step">🎨 Preparing your news feed...</span>
                    </div>
                </div>
            `;
        }
    }
}

// Add enhanced styles
const enhancedStyles = `
.loading-state {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(135deg, #7F3C3C10 0%, #3C7F7F10 100%);
    border-radius: 12px;
    margin: 20px 0;
}

.loading-spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3C7F7F;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 25px;
}

.loading-steps {
    margin-top: 25px;
}

.loading-step {
    display: block;
    margin: 8px 0;
    color: #666;
    font-size: 0.95rem;
}

.demo-notice {
    background: linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%);
    border: 2px solid #F2C94C;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 25px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(242, 201, 76, 0.2);
}

.demo-notice p {
    margin: 8px 0;
}

.search-results-message, .search-results-header {
    text-align: center;
    padding: 30px 20px;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 25px;
    grid-column: 1 / -1;
}

.retry-btn {
    background: #3C7F7F;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    transition: background 0.3s ease;
}

.retry-btn:hover {
    background: #5FAFAF;
}

.search-highlight {
    background: #FFF3CD;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
}

.news-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
}

.news-source {
    background: #7F3C3C;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 12px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = enhancedStyles;
document.head.appendChild(styleElement);

// Initialize
let newsLoader;
document.addEventListener('DOMContentLoaded', () => {
    newsLoader = new NewsLoader();
    window.newsLoader = newsLoader;
});

console.log('✅ News Loader script loaded successfully');