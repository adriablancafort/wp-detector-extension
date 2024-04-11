// Set the badge color
const set_badge_color = (detected) => {
  let green = [2, 217, 88, 255];
  let red = [255, 40, 83, 255];
  let color = detected ? green : red;
  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeText({ text: " " });
};

// Send a message to the content scripts to know if wp was detected
const sendMessageToTab = (tabId) => {
  chrome.tabs.sendMessage(tabId, { message: "wp_detected" }, (response) => {
      set_badge_color(response.detected);
  });
};

// Update the badge when the active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  sendMessageToTab(activeInfo.tabId);
});

// Update the badge when the page is refreshed / changed
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    sendMessageToTab(tabId);
  }
});