// Returns true if wp-content is found in the current page html
const findWpContent = () => {
  const currentHost = window.location.host;
  const elementsWithUrls = document.querySelectorAll("a[href], img[src], link[href], script[src], iframe[src]");

  for (const element of elementsWithUrls) {
    let link;
    switch (element.tagName) {
      case "A":
      case "LINK":
        link = element.getAttribute("href");
        break;
      case "IMG":
      case "SCRIPT":
      case "IFRAME":
        link = element.getAttribute("src");
        break;
    }
    
    if (link && link.includes("/wp-content/")) {
      const linkHost = new URL(link, window.location.origin).host; // Get origin host in case of relative URLs
      if (linkHost === currentHost) {
        return true;
      }
    }
  }
  return false;
};

// Listen for a message from the service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "wp_detected") {
    sendResponse({ detected: findWpContent() });
  }
});