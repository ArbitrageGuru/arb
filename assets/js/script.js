// Make closePopup globally available
function closePopup() {
  const popup = document.getElementById('welcomePopup');
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 300);
}

// Make these functions globally available (move them outside DOMContentLoaded)
function showNewTabPopup() {
    const popup = document.getElementById('newTabPopup');
    popup.style.display = 'flex';
    popup.style.opacity = '1';
    document.getElementById('tokenAddressInput').value = '';
}

function closeNewTabPopup() {
    const popup = document.getElementById('newTabPopup');
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300);
}

// Add these at the top level of the file
let currentMode = 'SOL'; // Default to SOL mode

function toggleMode() {
    currentMode = currentMode === 'SOL' ? 'ABSTRACT' : 'SOL';
    const toggleButton = document.getElementById('mode-toggle');
    
    // Update button state
    toggleButton.setAttribute('data-mode', currentMode);
    
    // Update theme
    document.body.setAttribute('data-theme', currentMode.toLowerCase());
    
    // Update bookmark buttons based on mode
    const solButtons = ['BULLX', 'RAYDIUM', 'JUPITER'];
    const abstractButtons = ['PUMP.EVM', 'DEFINED'];
    
    // Get all bookmark buttons
    const bookmarkButtons = document.querySelectorAll('.bookmark-pair-button');
    bookmarkButtons.forEach(button => {
        const pair = button.getAttribute('data-pair');
        if (currentMode === 'SOL') {
            button.style.display = solButtons.includes(pair) ? 'inline-block' : 'none';
        } else {
            button.style.display = abstractButtons.includes(pair) ? 'inline-block' : 'none';
        }
    });
    
    // Update the home pages based on current mode
    if (currentMode === 'SOL') {
        homePage = 'https://raydium.io/swap/?inputMint=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN&outputMint=sol';
        jupiterPage = 'https://jup.ag/swap/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN-SOL';
    } else {
        homePage = 'https://www.abstract.pumpevm.com/';
    }

    // Close all existing tabs
    while (tabs.length > 0) {
        closeTab(0);
    }
    
    // Open default page(s) for current mode
    if (currentMode === 'SOL') {
        openNewTab(homePage);
        openNewTab(jupiterPage);
    } else {
        openNewTab(homePage);
    }
}

// Modify the handleTokenAddressSubmit function
function handleTokenAddressSubmit() {
    const tokenAddress = document.getElementById('tokenAddressInput').value.trim();
    if (tokenAddress) {
        if (currentMode === 'SOL') {
            // Existing SOL behavior
            const raydiumUrl = `https://raydium.io/swap/?inputMint=sol&outputMint=${tokenAddress}`;
            const jupiterUrl = `https://jup.ag/swap/SOL-${tokenAddress}`;
            openNewTab(raydiumUrl);
            openNewTab(jupiterUrl);
        } else {
            // ABSTRACT behavior
            const abstractUrl = `https://www.abstract.pumpevm.com/trade/${tokenAddress}`;
            openNewTab(abstractUrl);
        }
        closeNewTabPopup();
    }
}

// Add these new functions at the top level (outside DOMContentLoaded)
function showUrlInputPopup() {
    const popup = document.getElementById('urlInputPopup');
    popup.style.display = 'flex';
    popup.style.opacity = '1';
    document.getElementById('newTabUrlInput').value = '';
    
    // Focus the input field
    setTimeout(() => {
        document.getElementById('newTabUrlInput').focus();
    }, 100);
}

function closeUrlInputPopup() {
    const popup = document.getElementById('urlInputPopup');
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300);
}

function handleUrlSubmit() {
    const url = document.getElementById('newTabUrlInput').value.trim();
    if (url) {
        window.openNewTab(url);
        closeUrlInputPopup();
    }
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM references
  const pullTab         = document.getElementById('pull-tab');
  const headerContainer = document.getElementById('header-container');
  const tabsContainer   = document.getElementById('tabs-container');
  const browserBar      = document.getElementById('browser-bar');
  const tabsBar         = document.getElementById('tabs-bar');

  // Controls
  const urlInput      = document.getElementById('url-input');
  const goButton      = document.getElementById('go-button');
  const refreshButton = document.getElementById('refresh-button');
  const homeButton    = document.getElementById('home-button');
  const newTabButton  = document.getElementById('new-tab-button');
  const bookmarkButtons = document.querySelectorAll('.bookmark-pair-button');

  // Updated Constants with Specific URLs
  const homePage      = 'https://raydium.io/swap/?inputMint=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN&outputMint=sol';
  const jupiterPage   = 'https://jup.ag/swap/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN-SOL';

  // Preset Bookmark Pairs
  const bookmarkPairs = {
    "TRUMP_SOL": [
      "https://raydium.io/swap/?inputMint=sol&outputMint=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
      "https://jup.ag/swap/SOL-6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
    ],
    "STONKS_SOL": [
      "https://raydium.io/swap/?inputMint=sol&outputMint=6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump",
      "https://jup.ag/swap/SOL-6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump"
    ],
    "VINE_SOL": [
      "https://raydium.io/swap/?inputMint=sol&outputMint=6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump",
      "https://jup.ag/swap/SOL-6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump"
    ],
    "MELANIA_SOL": [
      "https://raydium.io/swap/?inputMint=sol&outputMint=FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P",
      "https://jup.ag/swap/SOL-FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P"
    ],
    "BULLX": [
      "https://bullx.io/login"
    ],
    "RAYDIUM": [
      "https://raydium.io/"
    ],
    "JUPITER": [
      "https://jup.ag/"
    ],
    "PUMP.EVM": ["https://www.abstract.pumpevm.com/"],
    "DEFINED": ["https://www.defined.fi/"]
  };

  // Tabs => { iframe, tabElement, url, isMaximized }
  let tabs = [];
  let currentTabIndex = 0;
  let headerHidden = false;

  // Show or hide the header by toggling transform
  function updateHeaderPosition() {
    if (headerHidden) {
      // Slide up
      const h = headerContainer.offsetHeight;
      headerContainer.style.transform = `translateY(-${h}px)`;
      tabsContainer.style.marginTop = '0';
      pullTab.innerHTML = '<i class="fas fa-chevron-down"></i> Show Menu';
    } else {
      // Slide down
      headerContainer.style.transform = 'translateY(0)';
      const h = headerContainer.offsetHeight;
      tabsContainer.style.marginTop = h + 'px';
      pullTab.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Menu';
    }
  }

  // Toggling from the pull tab
  if (pullTab) {
    pullTab.addEventListener('click', () => {
      headerHidden = !headerHidden;
      updateHeaderPosition();
    });
  } else {
    console.error('pullTab element not found');
  }

  window.addEventListener('resize', updateHeaderPosition);

  // Domain parser
  function getDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname || url;
    } catch {
      return url;
    }
  }

  // Function to set iframe source
  function setIframeSrc(iframe, url) {
    iframe.src = url;
  }

  // Function to create a tab element
  function createTabElement(url) {
    const tabDiv = document.createElement('div');
    tabDiv.classList.add('tab');

    const maximizeIcon = document.createElement('span');
    maximizeIcon.classList.add('maximize-icon');
    maximizeIcon.textContent = '⎕';

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('tab-title');
    titleSpan.textContent = (url === 'about:blank') ? 'New Tab' : getDomain(url);

    const closeIcon = document.createElement('span');
    closeIcon.classList.add('close-icon');
    closeIcon.textContent = 'X';

    tabDiv.appendChild(maximizeIcon);
    tabDiv.appendChild(titleSpan);
    tabDiv.appendChild(closeIcon);
    return tabDiv;
  }

  // Function to update the layout based on maximized tabs
  function updateLayout() {
    const maxiTab = tabs.find(t => t.isMaximized);
    if (maxiTab) {
      tabs.forEach((tab) => {
        if (tab === maxiTab) {
          tab.iframe.style.display = 'block';
          tab.iframe.style.flex = '1';
        } else {
          tab.iframe.style.display = 'none';
          tab.iframe.style.flex = '0';
        }
      });
    } else {
      tabs.forEach((tab) => {
        tab.iframe.style.display = 'block';
        tab.iframe.style.flex = '1';
      });
    }
  }

  // Function to save the current state to localStorage
  function saveState() {
    const state = tabs.map(tab => ({
      url: tab.url,
      isMaximized: tab.isMaximized
    }));
    localStorage.setItem('arbitrageGuruTabs', JSON.stringify(state));
  }

  // Function to load the state from localStorage
  function loadState() {
    const state = JSON.parse(localStorage.getItem('arbitrageGuruTabs'));
    if (state && Array.isArray(state) && state.length > 0) {
      state.forEach(tabState => {
        openNewTab(tabState.url, tabState.isMaximized, false);
      });
    } else {
      // If no saved state, open default tabs
      openNewTab(homePage);
      openNewTab(jupiterPage);
    }
  }

  // Function to open a new tab
  function openNewTab(url='about:blank', isMaximized=false, save=true) {
    // Hide the empty state when opening a new tab
    const emptyState = document.getElementById('empty-state');
    emptyState.style.display = 'none';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
    tabsContainer.appendChild(iframe);

    const tabElem = createTabElement(url);
    tabsBar.appendChild(tabElem);

    const tabObj = { iframe, tabElement: tabElem, url, isMaximized };
    tabs.push(tabObj);
    const newIndex = tabs.length - 1;
    currentTabIndex = newIndex;

    // Tab main click => switch
    tabElem.addEventListener('click', (e) => {
      if (e.target.classList.contains('maximize-icon') ||
          e.target.classList.contains('close-icon')) {
        return;
      }
      currentTabIndex = newIndex;
      // If another tab was maximized, unmaximize
      const maxiIndex = tabs.findIndex(t => t.isMaximized);
      if (maxiIndex !== -1 && maxiIndex !== newIndex) {
        tabs.forEach(t => t.isMaximized = false);
        updateLayout();
      }
      urlInput.value = tabObj.url;
    });

    // Maximize
    const maximizeIcon = tabElem.querySelector('.maximize-icon');
    maximizeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      tabObj.isMaximized = !tabObj.isMaximized;
      if (tabObj.isMaximized) {
        tabs.forEach(t => { if (t !== tabObj) t.isMaximized = false; });
      }
      updateLayout();
      saveState(); // Save state after maximization change
    });

    // Close
    const closeIcon = tabElem.querySelector('.close-icon');
    closeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      closeTab(tabs.indexOf(tabObj)); // Use current index instead of stored index
    });

    navigateTo(url, newIndex);
    updateLayout();

    if (save) {
      saveState();
    }
  }

  // Function to navigate to a URL in a specific tab
  function navigateTo(url, tabIndex = currentTabIndex) {
    if (!url.startsWith('http://') && !url.startsWith('https://') && url !== 'about:blank') {
      url = 'https://' + url;
    }
    const tab = tabs[tabIndex];
    tab.url = url;

    const titleSpan = tab.tabElement.querySelector('.tab-title');
    titleSpan.textContent = (url === 'about:blank') ? 'New Tab' : getDomain(url);

    setIframeSrc(tab.iframe, url);

    if (tabIndex === currentTabIndex) {
      urlInput.value = url;
    }

    saveState(); // Save state after navigation
  }

  // Function to close a tab
  function closeTab(index) {
    const tab = tabs[index];
    if (!tab) return;
    tabsContainer.removeChild(tab.iframe);
    tab.tabElement.remove();
    tabs.splice(index, 1);

    if (tabs.length === 0) {
        currentTabIndex = -1; // No tabs open
        urlInput.value = ''; // Clear URL input
        
        // Show the empty state with logo
        const emptyState = document.getElementById('empty-state');
        emptyState.style.display = 'flex';
    } else {
        if (currentTabIndex === index) {
            currentTabIndex = Math.min(index, tabs.length - 1);
        } else if (currentTabIndex > index) {
            currentTabIndex--;
        }
        updateLayout();
        urlInput.value = tabs[currentTabIndex].url;
    }

    saveState(); // Save state after closing a tab
  }

  // Function to handle bookmark pair button clicks
  function handleBookmarkButtonClick(pairKey) {
    const urls = bookmarkPairs[pairKey];
    if (urls && Array.isArray(urls)) {
      urls.forEach(url => openNewTab(url));
    } else {
      console.error(`No URLs found for bookmark pair: ${pairKey}`);
    }
  }

  // Event listeners for bookmark pair buttons
  bookmarkButtons.forEach(button => {
    const pairKey = button.getAttribute('data-pair');
    button.addEventListener('click', () => {
      handleBookmarkButtonClick(pairKey);
    });
  });

  // Modify the goButton click handler
  goButton.addEventListener('click', () => {
    const input = urlInput.value.trim();
    
    // Check if input looks like a token address
    const isTokenAddress = /^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(input) || // SOL address format
                         /^0x[a-fA-F0-9]{40}$/.test(input);               // ETH address format
    
    if (isTokenAddress) {
        if (currentMode === 'SOL') {
            // Existing SOL behavior
            const raydiumUrl = `https://raydium.io/swap/?inputMint=sol&outputMint=${input}`;
            const jupiterUrl = `https://jup.ag/swap/SOL-${input}`;
            openNewTab(raydiumUrl);
            openNewTab(jupiterUrl);
        } else {
            // ABSTRACT behavior
            const abstractUrl = `https://www.abstract.pumpevm.com/trade/${input}`;
            openNewTab(abstractUrl);
        }
    } else {
        // Treat as regular URL
        let url = input;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        openNewTab(url);
    }
  });
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      goButton.click(); // Trigger the same behavior as clicking Go
    }
  });
  refreshButton.textContent = 'Home'; // Change button text
  refreshButton.addEventListener('click', () => {
    // Close all existing tabs
    while (tabs.length > 0) {
      closeTab(0);
    }
    
    // Open default homepage tabs
    openNewTab(homePage);
    openNewTab(jupiterPage);
  });
  homeButton.addEventListener('click', () => {
    // Close all existing tabs
    while (tabs.length > 0) {
      closeTab(0);
    }
    // Empty state will be automatically shown when all tabs are closed
  });

  // New Tab Button
  newTabButton.addEventListener('click', () => {
    showUrlInputPopup();
  });

  // Add event listener for Enter key in the URL input
  document.getElementById('newTabUrlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  });

  // Make openNewTab globally available
  window.openNewTab = openNewTab;

  // Initialize: Load saved state or open default tabs on load
  loadState();
  updateHeaderPosition(); // set initial margin

  // Replace the existing URL input event listeners with these:
  urlInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  urlInput.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
});


function initCustomScrollbar() {
  const scrollbar = document.getElementById('custom-scrollbar');
  const thumb = document.getElementById('scroll-thumb');
  const container = document.getElementById('tabs-container');
  let isDragging = false;

  // Prevent events from propagating through the scrollbar
  scrollbar.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Calculate new thumb position based on click
      const scrollbarRect = scrollbar.getBoundingClientRect();
      const thumbWidth = thumb.offsetWidth;
      let newLeft = e.clientX - scrollbarRect.left - (thumbWidth / 2);
      
      // Constrain thumb position
      newLeft = Math.max(0, Math.min(newLeft, scrollbar.offsetWidth - thumbWidth));
      
      // Update thumb position
      thumb.style.left = `${newLeft}px`;
      
      // Calculate and set container scroll position
      const scrollPercentage = newLeft / (scrollbar.offsetWidth - thumbWidth);
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = scrollPercentage * maxScroll;
      
      // Start dragging from this position
      isDragging = true;
      thumb.style.background = 'rgba(58, 132, 255, 0.6)';
  });

  document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const scrollbarRect = scrollbar.getBoundingClientRect();
      const thumbWidth = thumb.offsetWidth;
      let newLeft = e.clientX - scrollbarRect.left - (thumbWidth / 2);
      
      // Constrain thumb position
      newLeft = Math.max(0, Math.min(newLeft, scrollbar.offsetWidth - thumbWidth));
      
      // Update thumb position
      thumb.style.left = `${newLeft}px`;
      
      // Calculate and set container scroll position
      const scrollPercentage = newLeft / (scrollbar.offsetWidth - thumbWidth);
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = scrollPercentage * maxScroll;
  });

  document.addEventListener('mouseup', () => {
      if (isDragging) {
          isDragging = false;
          thumb.style.background = 'rgba(58, 132, 255, 0.4)';
      }
  });

  // Update thumb position and width when scrolling
  function updateThumb() {
      if (!isDragging) {
          const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth);
          const maxLeft = scrollbar.offsetWidth - thumb.offsetWidth;
          thumb.style.left = `${scrollPercentage * maxLeft}px`;
      }
      
      // Update thumb width based on content
      const thumbWidth = Math.max(100, (container.clientWidth / container.scrollWidth) * scrollbar.offsetWidth);
      thumb.style.width = `${thumbWidth}px`;
  }

  container.addEventListener('scroll', updateThumb);
  window.addEventListener('resize', updateThumb);
  
  // Initial update
  updateThumb();
}

// Call this function after the DOM is loaded
document.addEventListener('DOMContentLoaded', initCustomScrollbar);

// Add these functions to your existing JavaScript
function showAiAgentPopup() {
  const popup = document.getElementById('aiAgentPopup');
  popup.style.display = 'flex';
  popup.style.opacity = '1';
}

function closeAiAgentPopup() {
  const popup = document.getElementById('aiAgentPopup');
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
      popup.style.display = 'none';
  }, 300);
}

// Add this to your DOMContentLoaded event listener
document.getElementById('ai-agent-button').addEventListener('click', showAiAgentPopup);
