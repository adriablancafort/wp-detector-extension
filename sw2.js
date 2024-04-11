

// Listen for tab activation (user switches tabs) - Necessari?
chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.sendMessage({ message: "run" });
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "set_badge_color") {
        set_badge_color(request.detected);
    }
});

// Change the color of the browser extension badge
const set_badge_color = (detected) => {
  let green = [2, 217, 88, 255];
  let red = [255, 40, 83, 255];
  let color = detected ? green : red;
  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeText({ text: " " });
};