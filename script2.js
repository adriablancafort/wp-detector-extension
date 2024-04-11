// Returns true if wp-content is found in the current page html
const find_wp_content = () => {
  return document.documentElement.innerHTML.includes("wp-content");
};

// Listen for a message from the service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "wp_detected") {
    sendResponse({ detected: find_wp_content() });
  }
});