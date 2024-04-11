// Returns true if wp-content is found in the current page html
const find_wp_content = () => {
  return document.documentElement.innerHTML.includes("wp-content");
};

// Sends a message to the service worker to change the color of the browser extension badge
const set_badge_color = (detected) => {
    chrome.runtime.sendMessage({ message: "set_badge_color", detected: detected });
};

// Runs the function that detects wordpress on the page laod
let wp_detected = find_wp_content();

set_badge_color(wp_detected);

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "run") {
    set_badge_color(wp_detected);
  }
});