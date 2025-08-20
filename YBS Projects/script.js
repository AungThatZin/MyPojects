// Main App Controller
 
class YBSAssistant {
  constructor() {
    // State
    this.state = {
      currentTab: 'route',
      currentLanguage: 'en',
      recentSearches: [],
      currentRoute: null,
      map: null,
      markers: [],
      polyline: null
    };

    // DOM Elements
    this.elements = {
      tabs: document.querySelectorAll('.tab'),
      tabContents: document.querySelectorAll('.tab-content'),
      languageBtns: document.querySelectorAll('.language-btn'),
      chatInput: document.querySelector('.chat-input'),
      sendBtn: document.querySelector('.send-btn'),
      chatMessages: document.querySelector('.chat-messages'),
      fromInput: document.getElementById('from'),
      toInput: document.getElementById('to'),
      searchBtn: document.querySelector('.btn-primary'),
      etaDisplay: document.querySelector('.eta-value'),
      stopDisplay: document.querySelector('.eta-label'),
      recentSearchesList: document.querySelector('.recent-searches'),
      clearHistoryBtn: document.querySelector('.clear-history'),
      mapContainer: document.querySelector('.map-container'),
      timezoneDisplay: document.querySelector('.timezone')
    };

    // Translations
    this.translations = {
      en: {
        fromPlaceholder: "Current location",
        toPlaceholder: "Destination",
        searchBtn: "Find Routes",
        fastestRoute: "Fastest Route",
        cheapest: "Cheapest",
        walking: "Walking",
        etaPrefix: "ETA",
        clearHistory: "Clear History"
      },
      mm: {
        fromPlaceholder: "လက်ရှိတည်နေရာ",
        toPlaceholder: "သွားလိုသည့်နေရာ",
        searchBtn: "လမ်းကြောင်းရှာမည်",
        fastestRoute: "အမြန်ဆုံးလမ်းကြောင်း",
        cheapest: "ဈေးအသက်သာဆုံး",
        walking: "လမ်းလျှောက်",
        etaPrefix: "ခန့်မှန်းချိန်",
        clearHistory: "ရှာဖွေမှုမှတ်တမ်းဖျက်မည်"
      }
    };

    // Initialize
    this.init();
  }

  // Initialize all components
  init() {
    this.initTabs();
    this.initChat();
    this.initSearch();
    this.initRecentSearches();
    this.initLanguageSwitch();
    this.initTimezone();
    this.loadRecentSearches();
    this.initMap();
  }


  
  // Tab Switching
  initTabs() {
    this.elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        this.switchTab(tabId);
      });
    });
  }

initMap() {
    // Yangon coordinates [latitude, longitude]
    const yangonCoords = [16.8409, 96.1735];
    
    // Create map
    this.state.map = L.map('map').setView(yangonCoords, 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.state.map);
    
    // Add a marker for Yangon
    L.marker(yangonCoords)
        .addTo(this.state.map)
        .bindPopup('Yangon, Myanmar')
        .openPopup();
    
    // Add some sample bus stops (hypothetical coordinates)
    const busStops = [
        {name: "Hledan Junction", coords: [16.8200, 96.1345]},
        {name: "Shwedagon Pagoda", coords: [16.7983, 96.1494]},
        {name: "Downtown", coords: [16.7800, 96.1600]},
        {name: "Insein", coords: [16.9000, 96.1200]},
        {name: "Myaynigone", coords: [16.8250, 96.1290]}
    ];
    
    // Add markers for bus stops
    busStops.forEach(stop => {
        const marker = L.marker(stop.coords)
            .addTo(this.state.map)
            .bindPopup(`<b>${stop.name}</b><br>Bus Stop`);
        this.state.markers.push(marker);
    });
    
    // Add a sample route line (hypothetical)
    const routePoints = [
        [16.8200, 96.1345], // Hledan
        [16.8150, 96.1380],
        [16.8100, 96.1400],
        [16.8050, 96.1420],
        [16.8000, 96.1450],
        [16.7983, 96.1494]  // Shwedagon
    ];
    
    // Draw the route line
    this.state.polyline = L.polyline(routePoints, {color: '#3a86ff', weight: 5}).addTo(this.state.map);
    
    // Fit map to show the route
    this.state.map.fitBounds(this.state.polyline.getBounds());
  }


  
  switchTab(tabId) {
    // Update active tab
    this.elements.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Show corresponding content
    this.elements.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `${tabId}-content`);
    });

    this.state.currentTab = tabId;
  }

  // Chat Functionality
  initChat() {
    this.elements.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserMessage();
      }
    });

    this.elements.sendBtn.addEventListener('click', () => {
      this.handleUserMessage();
    });
  }

  async handleUserMessage() {
    const message = this.elements.chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    this.addMessage('user', message);
    this.elements.chatInput.value = '';

    // Show loading indicator
    const loadingId = this.showLoading();

    try {
      // Simulate API call
      const response = await this.mockAIResponse(message);
      
      // Remove loading and add response
      this.removeLoading(loadingId);
      this.addMessage('assistant', response);

      // Extract and update ETA if found
      this.updateETAFromMessage(response);

      // Update map if route information is available
      this.updateMapFromMessage(response);
    } catch (error) {
      this.removeLoading(loadingId);
      this.addMessage('assistant', "Sorry, I encountered an error. Please try again.");
      console.error("AI Error:", error);
    }
  }

  showLoading() {
    const id = `loading-${Date.now()}`;
    const loadingElement = document.createElement('div');
    loadingElement.id = id;
    loadingElement.className = 'message assistant-message';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>';
    this.elements.chatMessages.appendChild(loadingElement);
    this.scrollChatToBottom();
    return id;
  }

  removeLoading(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
  }

  addMessage(type, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message fade-in`;
    
    // Highlight bus numbers in the message
    messageElement.innerHTML = this.highlightBusNumbers(text);
    
    this.elements.chatMessages.appendChild(messageElement);
    this.scrollChatToBottom();
  }

  scrollChatToBottom() {
    this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
  }

  highlightBusNumbers(text) {
    // Replace YBS 12 or similar with styled chips
    return text.replace(/(YBS[- ]?\d+)/g, '<span class="chip bus">$1</span>');
  }

  // Mock AI Response
  async mockAIResponse(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple pattern matching for demo purposes
    if (message.toLowerCase().includes('hledan') && message.toLowerCase().includes('sule')) {
      return "From Hledan to Sule Pagoda, take YBS 45. ETA: 25 minutes with 5 stops. Alternative options: YBS 61 (35 minutes) or YBS-12 (40 minutes).";
    } else if (message.toLowerCase().includes('shwedagon')) {
      return "To Shwedagon Pagoda, recommended buses: YBS 45 (25 min), YBS 61 (35 min), or YBS-12 (40 min). The fastest option is YBS 45.";
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello')) {
      return "I'm the YBS AI Assistant. Ask me about bus routes, schedules, or fares between locations in Yangon. For example: 'Which bus goes from Hledan to Downtown?'";
    } else {
      return "I found 3 route options for your query. 1) YBS 65: ETA 40 minutes, 5 stops. 2) YBS 72: ETA 50 minutes, 7 stops. 3) YBS-12: ETA 45 minutes, 6 stops. The fastest option is YBS 65.";
    }
  }

  // Search Functionality
  initSearch() {
    this.elements.searchBtn.addEventListener('click', () => {
      this.handleSearch();
    });
  }

  async handleSearch() {
    const from = this.elements.fromInput.value.trim();
    const to = this.elements.toInput.value.trim();

    if (!from || !to) {
      this.addMessage('assistant', "Please enter both starting point and destination.");
      return;
    }

    // Create search query
    const query = `${from} → ${to}`;
    const message = `What's the best route from ${from} to ${to}?`;

    // Add to chat
    this.addMessage('user', message);

    // Show loading
    const loadingId = this.showLoading();

    try {
      // Simulate API call
      const response = await this.mockAIResponse(message);
      
      // Remove loading and add response
      this.removeLoading(loadingId);
      this.addMessage('assistant', response);

      // Save to recent searches
      this.saveRecentSearch(query);

      // Extract and update ETA if found
      this.updateETAFromMessage(response);

      // Update map if route information is available
      this.updateMapFromMessage(response);
    } catch (error) {
      this.removeLoading(loadingId);
      this.addMessage('assistant', "Sorry, I couldn't find routes for those locations. Please try different names.");
      console.error("Search Error:", error);
    }
  }

  // ETA Updates
  updateETAFromMessage(message) {
    // Extract ETA information from message (simplified for demo)
    const etaMatch = message.match(/ETA:? (\d+) minutes?/i);
    const stopsMatch = message.match(/(\d+) stops?/i);
    const busMatch = message.match(/(YBS[- ]?\d+)/i);

    if (etaMatch) {
      this.elements.etaDisplay.textContent = `${etaMatch[1]} min`;
    } else {
      this.elements.etaDisplay.textContent = "--";
    }

    if (busMatch && stopsMatch) {
      this.elements.stopDisplay.textContent = `${busMatch[1]} • ${stopsMatch[1]} stops`;
    } else {
      this.elements.stopDisplay.textContent = "No route details";
    }
  }

  // Map Integration
  

  // Recent Searches
  initRecentSearches() {
    this.elements.clearHistoryBtn.addEventListener('click', () => {
      this.clearRecentSearches();
    });
  }

  loadRecentSearches() {
    const savedSearches = localStorage.getItem('ybsRecentSearches');
    this.state.recentSearches = savedSearches ? JSON.parse(savedSearches) : [];
    this.renderRecentSearches();
  }

  saveRecentSearch(query) {
    const timestamp = new Date().toLocaleString();
    const searchItem = { query, timestamp };

    // Add to beginning of array
    this.state.recentSearches.unshift(searchItem);

    // Keep only last 10 items
    if (this.state.recentSearches.length > 10) {
      this.state.recentSearches = this.state.recentSearches.slice(0, 10);
    }

    // Save to localStorage
    localStorage.setItem('ybsRecentSearches', JSON.stringify(this.state.recentSearches));

    // Update UI
    this.renderRecentSearches();
  }

  renderRecentSearches() {
    this.elements.recentSearchesList.innerHTML = '';

    this.state.recentSearches.forEach(item => {
      const li = document.createElement('li');
      li.className = 'search-item';
      
      li.innerHTML = `
        <span>${item.query}</span>
        <span class="text-muted">${item.timestamp}</span>
      `;
      
      li.addEventListener('click', () => {
        this.loadRecentSearch(item.query);
      });
      
      this.elements.recentSearchesList.appendChild(li);
    });
  }

  loadRecentSearch(query) {
    // Extract locations from "From → To" format
    const [from, to] = query.split('→').map(s => s.trim());
    
    // Fill inputs
    this.elements.fromInput.value = from;
    this.elements.toInput.value = to;
    
    // Trigger search
    this.handleSearch();
  }

  clearRecentSearches() {
    this.state.recentSearches = [];
    localStorage.removeItem('ybsRecentSearches');
    this.renderRecentSearches();
  }

  // Language Switch
  initLanguageSwitch() {
    this.elements.languageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.textContent.toLowerCase();
        this.switchLanguage(lang);
      });
    });
  }

  switchLanguage(lang) {
    this.state.currentLanguage = lang;
    
    // Update active button
    this.elements.languageBtns.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
    });
    
    // Update UI texts
    const texts = this.translations[lang];
    this.elements.fromInput.placeholder = texts.fromPlaceholder;
    this.elements.toInput.placeholder = texts.toPlaceholder;
    this.elements.searchBtn.textContent = texts.searchBtn;
    
    // Update other elements as needed
    document.querySelectorAll('.eta-label').forEach((el, index) => {
      if (index === 0) el.textContent = texts.fastestRoute;
      else if (index === 1) el.textContent = texts.cheapest;
      else if (index === 2) el.textContent = texts.walking;
    });
    
    this.elements.clearHistoryBtn.textContent = texts.clearHistory;
  }

  // Timezone Display
  initTimezone() {
    this.updateTimezone();
    setInterval(() => this.updateTimezone(), 60000); // Update every minute
  }

  updateTimezone() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (this.state.currentLanguage === 'en') {
      this.elements.timezoneDisplay.textContent = `Yangon Time (GMT+6:30) • ${timeString}`;
    } else {
      this.elements.timezoneDisplay.textContent = `ရန်ကုန်အချိန် (GMT+6:30) • ${timeString}`;
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new YBSAssistant();
});

// For development purposes
window.YBSAssistant = YBSAssistant;