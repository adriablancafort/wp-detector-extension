document.addEventListener("DOMContentLoaded", () => {
  const outputContainer = document.getElementById("outputContainer");

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const currentUrl = tabs[0].url;

    apiRequest(currentUrl, "wp").then((data) => {
      outputContainer.innerHTML += data.wp ? "Wordpress" : "Not Wordpress";
    });
  });
});

// Functions

const apiRequest = (inputUrl, type) => {
  return fetch(
    `https://wp-detector.000webhostapp.com?url=${inputUrl}&type=${type}`,
    { mode: "no-cors" }
  ).then((response) => response.json());
};