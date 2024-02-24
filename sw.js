let pageRequests = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        // Reset the badge to red when a new page starts loading
        chrome.action.setBadgeBackgroundColor({ color: [255, 40, 83, 255] });
        chrome.action.setBadgeText({ text: ' ' });

        // Reset the requests for the tab
        pageRequests[tabId] = [];
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // Add the request to the tab's requests
        pageRequests[details.tabId].push(details.url);

        // Check if the URL contains '/wp-content/'
        if (details.url.includes('/wp-content/')) {
            // Set the badge to green and clear the tab's requests
            chrome.action.setBadgeBackgroundColor({ color: [2, 217, 88, 255] });
            chrome.action.setBadgeText({ text: ' ' });
            pageRequests[details.tabId] = [];
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // If the page has finished loading and '/wp-content/' was not found in any request, set the badge to red
        if (!pageRequests[tabId].some(url => url.includes('/wp-content/'))) {
            chrome.action.setBadgeBackgroundColor({ color: [255, 40, 83, 255] });
            chrome.action.setBadgeText({ text: ' ' });
        }

        // Clear the tab's requests
        pageRequests[tabId] = [];
    }
});