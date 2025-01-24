
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

    function handleTokenAddressSubmit() {
        const tokenAddress = document.getElementById('tokenAddressInput').value.trim();
        if (tokenAddress) {
            // Construct URLs with the token address
            const raydiumUrl = `https://raydium.io/swap/?inputMint=${tokenAddress}&outputMint=sol`;
            const jupiterUrl = `https://jup.ag/swap/${tokenAddress}-SOL`;
            
            // Open new tabs with these URLs
            window.openNewTab(raydiumUrl);
            window.openNewTab(jupiterUrl);
            
            // Close the popup
            closeNewTabPopup();
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
          "https://raydium.io/swap/?inputMint=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN&outputMint=sol",
          "https://jup.ag/swap/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN-SOL"
        ],
        "STONKS_SOL": [
          "https://raydium.io/swap/?inputMint=6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump&outputMint=sol",
          "https://jup.ag/swap/6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump-SOL"
        ],
        "VINE_SOL": [
          "https://raydium.io/swap/?inputMint=6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump&outputMint=sol",
          "https://jup.ag/swap/6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump-SOL"
        ],
        "MELANIA_SOL": [
          "https://raydium.io/swap/?inputMint=FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P&outputMint=sol",
          "https://jup.ag/swap/FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P-SOL"
        ]
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

      // Function to open a new tab
      function openNewTab(url='about:blank') {
        // Hide the empty state when opening a new tab
        const emptyState = document.getElementById('empty-state');
        emptyState.style.display = 'none';

        const iframe = document.createElement('iframe');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
        tabsContainer.appendChild(iframe);

        const tabElem = createTabElement(url);
        tabsBar.appendChild(tabElem);

        const tabObj = { iframe, tabElement: tabElem, url, isMaximized: false };
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

      // Basic Navigation Controls
      goButton.addEventListener('click', () => {
        navigateTo(urlInput.value.trim());
      });
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          navigateTo(urlInput.value.trim());
        }
      });
      refreshButton.addEventListener('click', () => {
        const curr = tabs[currentTabIndex]?.iframe.src;
        if (curr) {
          tabs[currentTabIndex].iframe.src = curr;
        }
      });
      homeButton.addEventListener('click', () => {
        // Open both Raydium and Jupiter as home pages
        openNewTab(homePage);
        openNewTab(jupiterPage);
      });

      // New Tab Button
      newTabButton.addEventListener('click', () => {
        showNewTabPopup();
      });

      // Make openNewTab globally available
      window.openNewTab = openNewTab;

      // Initialize: Open two tabs on load: Raydium and Jupiter
      openNewTab(homePage);
      openNewTab(jupiterPage);
      updateHeaderPosition(); // set initial margin
    });