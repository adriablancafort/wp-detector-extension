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
    if (chrome.runtime.lastError) {
      // Tab is not ready yet
      setTimeout(() => {
        sendMessageToTab(tabId);
      }, 100);
      return;
    }
    if (response && response.detected !== undefined) {
      set_badge_color(response.detected);
    }
  });
};

// Update the badge when the active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  sendMessageToTab(activeInfo.tabId);
});

// Update the badge when the page is refreshed / changed
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    sendMessageToTab(tabId);
  }
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "update_badge") {
    set_badge_color(message.detected);
  }
});

// Redirect to feedback page on uninstall
chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.setUninstallURL('https://wp-detector.com/extension-uninstall');
});