// Change the color of the browser extension badge
const set_badge_color = (wp) => {
  green = [2, 217, 88, 255];
  red = [255, 40, 83, 255];
  let color = wp ? green : red;
  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeText({ text: " " });
  pageRequests[details.tabId] = [];
};

// Set the color badge to false by default
chrome.tabs.onActivated.addListener(() => {
  set_badge_color(false);
});

// Change the color badge if a page request contains /wp-content/
chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (details.url.includes("/wp-content/")) {
            set_badge_color(true);
        }
    },
    { urls: ["<all_urls>"] }
);