// Returns true if wp-content is found in the current page html
const find_wp_content = () => {
  return document.documentElement.innerHTML.includes("wp-content");
};

// Stores a Key-Value pair in the local storage
const setStorage = async (key, value) => {
  await chrome.storage.local.set({ [key]: value });
}

// Gets the url of the current tab
const getCurrentTabUrl = async () => {
  let [tab] = await chrome.tabs.queryActiveTab();
  return tab.url;
};

// Stores if the website is using WordPress or not
getCurrentTabUrl().then((url) => {
  setStorage(url, find_wp_content());
});