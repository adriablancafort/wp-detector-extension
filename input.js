document.addEventListener("DOMContentLoaded", () => {
  const wpContainer = document.getElementById("wpContainer");
  const themesContainer = document.getElementById("themesContainer");
  const pluginsContainer = document.getElementById("pluginsContainer");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url.replace(/\/$/, "");
    const websiteName = formatWebsiteName(currentUrl);

    // Wordpress Detected container
    wpContainer.innerHTML = detectWpSkeleton;

    // Themes Detected container
    themesContainer.innerHTML = analyzingThemesTitle(websiteName);
    themesContainer.innerHTML += detectThemesSkeleton;

    // Plugins Detected container
    pluginsContainer.innerHTML = analyzingPluginsTitle(websiteName);
    pluginsContainer.innerHTML += detectPluginsSkeleton;
    pluginsContainer.innerHTML += detectPluginsSkeleton;
    pluginsContainer.innerHTML += detectPluginsSkeleton;

    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "wp_detected" },
      function (response) {
        if (response && response.detected !== undefined) {
          if (response.detected) {
            wpContainer.innerHTML = detectWpSuccess(websiteName);

            apiRequest("themes", currentUrl, null, null).then((data) => {
              themesContainer.innerHTML = detectThemesTitle(websiteName);

              if (data.themes.length) {
                data.themes.forEach((theme) => {
                  const themeCard = document.createElement("div");
                  themeCard.innerHTML = detectThemesCard(theme);
                  if (theme.link) {
                    themeCard.addEventListener("click", () => {
                      window.open(theme.link, "_blank");
                    });
                  }
                  themesContainer.appendChild(themeCard);
                });
              } else {
                themesContainer.innerHTML += noThemesDetected(websiteName);
              }
            });

            apiRequest("plugins", currentUrl, null, null).then((data) => {
              pluginsContainer.innerHTML = detectPluginsTitle(websiteName);

              if (data.plugins.length) {
                data.plugins.forEach((plugin) => {
                  const pluginCard = document.createElement("div");
                  pluginCard.innerHTML = detectPluginsCard(plugin);
                  if (plugin.link) {
                    pluginCard.addEventListener("click", () => {
                      window.open(plugin.link, "_blank");
                    });
                  }
                  pluginsContainer.appendChild(pluginCard);
                });
              } else {
                pluginsContainer.innerHTML += noPluginsDetected(websiteName);
              }
            });
          } else {
            wpContainer.innerHTML = detectWpFail(websiteName);
            themesContainer.innerHTML = topThemesTitle;
            themesContainer.innerHTML += detectThemesSkeleton;
            pluginsContainer.innerHTML = topPluginsTitle;
            pluginsContainer.innerHTML += detectPluginsSkeleton;
            pluginsContainer.innerHTML += detectPluginsSkeleton;
            pluginsContainer.innerHTML += detectPluginsSkeleton;

            apiRequest("top-themes", null, 3, 1).then((data) => {
              themesContainer.innerHTML = topThemesTitle;
              data.themes.forEach((theme) => {
                const themeCard = document.createElement("div");
                themeCard.innerHTML = detectThemesCard(theme);
                if (theme.link) {
                  themeCard.addEventListener("click", () => {
                    window.open(theme.link, "_blank");
                  });
                }
                themesContainer.appendChild(themeCard);
              });
              themesContainer.innerHTML += Button("View all Most Detected Themes", "https://wp-detector.com/top-themes");
            });

            apiRequest("top-plugins", null, 3, 1).then((data) => {
              pluginsContainer.innerHTML = topPluginsTitle;
              data.plugins.forEach((plugin) => {
                const pluginCard = document.createElement("div");
                pluginCard.innerHTML = detectPluginsCard(plugin);
                if (plugin.link) {
                  pluginCard.addEventListener("click", () => {
                    window.open(plugin.link, "_blank");
                  });
                }
                pluginsContainer.appendChild(pluginCard);
              });
              pluginsContainer.innerHTML += Button("View all Most Detected Plugins", "https://wp-detector.com/top-plugins");
            });
          }
        }
      }
    );
  });
});

// Functions

const formatWebsiteName = (url) => {
  url = url.replace(/^(https?:\/\/)?/, "");
  url = url.replace(/^(.*?\.)?(.*?\..*?)\/.*$/, "$2");
  url = url.toLowerCase();
  return url;
};

const apiRequest = (type, currentUrl, quantity, page) => {
  return fetch(
    `https://api.wp-detector.com?type=${type}&url=${currentUrl}&quantity=${quantity}&page=${page}`
  ).then((response) => response.json());
};

// Elements

const Button = (text, link) => `
<div class="button-container">
  <a href="${link}" target="_blank">
    <button>${text}</button>
  </a>
</div>`;

const analyzingThemesTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing themes in <strong>${websiteName}</strong>
</h3>`;

const analyzingPluginsTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing plugins in <strong>${websiteName}</strong>
</h3>`;

const detectThemesTitle = (websiteName) => `
<h3 class="input--section-title">
  Detected <strong>theme</strong> in ${websiteName}:
</h3>`;

const detectPluginsTitle = (websiteName) => `
<h3 class="input--section-title">
  Detected <strong>plugins</strong> in ${websiteName}:
</h3>`;

const topThemesTitle = `
<h3 class="input--section-title">
  Top 3 most commonly detected <strong>themes</strong>:
</h3>`;

const topPluginsTitle = `
<h3 class="input--section-title">
  Top 3 most commonly detected <strong>plugins</strong>:
</h3>`;

const detectWpSuccess = (websiteName) => `
<div class="card card__wp border">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.785 32.418" class="card--icon" width="66" height="54">
      <path fill="#464342" d="M2.304 16.208c0 5.504 3.199 10.26 7.837 12.515L3.508 10.549a13.852 13.852 0 0 0-1.204 5.66zm23.292-.701c0-1.719-.617-2.909-1.147-3.835-.705-1.146-1.365-2.116-1.365-3.26 0-1.28.969-2.469 2.335-2.469.061 0 .12.008.18.011a13.854 13.854 0 0 0-9.39-3.65c-4.858 0-9.132 2.492-11.618 6.267.326.01.634.017.895.017 1.454 0 3.706-.176 3.706-.176.75-.045.838 1.056.089 1.145 0 0-.753.089-1.592.133l5.064 15.061 3.043-9.126-2.167-5.936a25.336 25.336 0 0 1-1.458-.133c-.749-.043-.661-1.19.088-1.145 0 0 2.297.177 3.663.177 1.454 0 3.706-.177 3.706-.177.75-.044.838 1.057.089 1.145 0 0-.755.09-1.592.133l5.025 14.947 1.387-4.634c.601-1.924 1.059-3.305 1.059-4.495z M16.453 17.425 12.28 29.548a13.904 13.904 0 0 0 8.545-.222 1.221 1.221 0 0 1-.099-.192zM28.41 9.537c.06.443.094.919.094 1.43 0 1.411-.264 2.997-1.058 4.98L23.2 28.227c4.134-2.41 6.914-6.889 6.914-12.018 0-2.418-.617-4.691-1.703-6.672z M16.209 0C7.272 0 0 7.271 0 16.208c0 8.939 7.272 16.21 16.209 16.21s16.21-7.271 16.21-16.21C32.419 7.271 25.146 0 16.209 0Zm0 31.675C7.68 31.675.743 24.736.743 16.208.743 7.681 7.681.743 16.21.743c8.527 0 15.465 6.938 15.465 15.465 0 8.528-6.938 15.467-15.465 15.467z"/>
    <circle cx="32.836" cy="23.094" r="5.117" fill="#fff" paint-order="markers stroke fill"/>
    <path fill="#02d957" d="M38.785 23.42a6.068 6.068 0 1 1-6.068-6.067 6.067 6.067 0 0 1 6.068 6.067zm-3.146-3.447a.606.606 0 0 0-.83.222l-2.933 5.082-1.328-1.594a.607.607 0 1 0-.932.777l1.884 2.262a.607.607 0 0 0 .466.219.636.636 0 0 0 .052-.002.606.606 0 0 0 .474-.301l3.368-5.836a.606.606 0 0 0-.222-.829z"/>
  </svg>
  <div>
    <h4 class="card--title cart--title__success">Hurray!</h4>
    <p><strong>${websiteName}</strong> is using WordPress!</p>
  </div>
</div>`;

const detectWpFail = (websiteName) => `
<div class="card card__wp border">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.734 32.418" class="card--icon" width="66" height="54">
      <path fill="#464342" d="M2.304 16.208c0 5.504 3.199 10.26 7.837 12.515L3.508 10.549a13.852 13.852 0 0 0-1.204 5.66zm23.292-.701c0-1.719-.617-2.909-1.147-3.835-.705-1.146-1.365-2.116-1.365-3.26 0-1.28.969-2.469 2.335-2.469.061 0 .12.008.18.011a13.854 13.854 0 0 0-9.39-3.65c-4.858 0-9.132 2.492-11.618 6.267.326.01.634.017.895.017 1.454 0 3.706-.176 3.706-.176.75-.045.838 1.056.089 1.145 0 0-.753.089-1.592.133l5.064 15.061 3.043-9.126-2.167-5.936a25.336 25.336 0 0 1-1.458-.133c-.749-.043-.661-1.19.088-1.145 0 0 2.297.177 3.663.177 1.454 0 3.706-.177 3.706-.177.75-.044.838 1.057.089 1.145 0 0-.755.09-1.592.133l5.025 14.947 1.387-4.634c.601-1.924 1.059-3.305 1.059-4.495z M16.453 17.425 12.28 29.548a13.904 13.904 0 0 0 8.545-.222 1.221 1.221 0 0 1-.099-.192zM28.41 9.537c.06.443.094.919.094 1.43 0 1.411-.264 2.997-1.058 4.98L23.2 28.227c4.134-2.41 6.914-6.889 6.914-12.018 0-2.418-.617-4.691-1.703-6.672z M16.209 0C7.272 0 0 7.271 0 16.208c0 8.939 7.272 16.21 16.209 16.21s16.21-7.271 16.21-16.21C32.419 7.271 25.146 0 16.209 0Zm0 31.675C7.68 31.675.743 24.736.743 16.208.743 7.681 7.681.743 16.21.743c8.527 0 15.465 6.938 15.465 15.465 0 8.528-6.938 15.467-15.465 15.467z"/>
      <circle cx="32.836" cy="23.094" r="5.117" fill="#fff" paint-order="markers stroke fill"/>
      <path fill="#ff2854" d="M38.734 23.348a6.008 6.008 0 1 1-6.008-6.008 6.007 6.007 0 0 1 6.008 6.008zm-5.163.008 2.3-2.302a.601.601 0 0 0-.85-.85l-2.3 2.302-2.302-2.301a.601.601 0 0 0-.85.85l2.303 2.301-2.302 2.301a.601.601 0 0 0 .85.85l2.3-2.302 2.302 2.302a.601.601 0 0 0 .85-.85z"/>
  </svg>
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p><strong>${websiteName}</strong> is not using WordPress.</p>
  </div>
</div>`;

const detectWpSkeleton = `
<div class="card card__wp border">
  <div class="loading--icon card--icon loading--skeleton"></div>
  <div class="loading__80">
    <h4 class="card--title loading-title loading--skeleton"></h4>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;

const detectThemesCard = (theme) => `
<div class="card card--hover border">
  <img src="${theme.screenshot}" alt="Theme Screenshot" class="card--banner card--banner__theme loading--skeleton" />
  <div class="card--info-container">
    <h4 class="card--title">${theme.title}</h4>
    ${theme.author ? `<p>Author: <strong>${theme.author}</strong></p>` : ""}
    ${theme.version ? `<p>Version: <span class="badge">${theme.version}</span></p>` : ""}
    ${theme.website && theme.sanatizedWebsite ? `<p>Website: <a href="${theme.website}" target="_blank">${theme.sanatizedWebsite}</a></p>` : ""}
    ${theme.lastUpdated ? `<p>Last Updated: <strong>${theme.lastUpdated}</strong></p>` : ""}
    ${theme.activeInstallations ? `<p>Active Installations: <strong>${theme.activeInstallations}</strong></p>` : ""}
    ${theme.reqWpVersion ? `<p>WordPress Version: <strong>${theme.reqWpVersion}</strong></p>` : ""}
    ${theme.testedWpVersion ? `<p>Tested up To: <strong>${theme.testedWpVersion}</strong></p>` : ""}
    ${theme.reqPhpVersion ? `<p>PHP Version: <strong>${theme.reqPhpVersion}</strong></p>` : ""}
    ${theme.description ? `<p class="card--description"><strong>Description:</strong> ${theme.description}</p>` : ""}
  </div>
  ${theme.link? `
  <div class="cart--read-more--container">
    <span class="cart--read-more">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" >
        <path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" ></path>
      </svg>
      Read more
    </span>
  </div>`: ""}
</div>`;

const detectThemesSkeleton = `
<div class="card border">
  <div class="card--banner card--banner__theme loading--skeleton"></div>
  <div class="card--info-container">
    <h4 class="card--title loading-title loading--skeleton"></h4>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;

const noThemesDetected = (websiteName) => `
<div class="card card__wp border">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="card--icon" width="66" height="54">
    <path fill="#464342" stroke-width="1.5" fill-rule="evenodd"  d="M426.67 213.33V128H274.7l-53.96-42.67H42.67v341.34h372.58L480 213.33h-53.33ZM85.33 338.77V128h120.59l53.96 42.67H384v42.66H124.69L85.33 338.77ZM383.63 384H115.85l40.17-128h266.44l-38.83 128Z"/>
  </svg>
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p>No theme detected in <strong>${websiteName}</strong>.</p>
  </div>
</div>`;

const detectPluginsCard = (plugin) => `
<div class="card card--hover border">
  <img src="${plugin.banner}" alt="Plugin Banner" class="card--banner card--banner__plugin loading--skeleton" />
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <img src="${plugin.icon}" alt="Plugin Icon" class="card--icon" width="60px" height="60px" />
      <h4 class="card--title">${plugin.title}</h4>
    </div>
    ${plugin.contributors ? `<p>Contributors: <strong>${plugin.contributors}</strong></p>` : ""}
    ${plugin.version ? `<p>Version: <span class="badge">${plugin.version}</span></p>` : ""}
    ${plugin.website && plugin.sanatizedWebsite ? `<p>Website: <a href="${plugin.website}" target="_blank">${plugin.sanatizedWebsite}</a></p>` : ""}
    ${plugin.lastUpdated ? `<p>Last Updated: <strong>${plugin.lastUpdated}</strong></p>` : ""}
    ${plugin.activeInstallations ? `<p>Active Installations: <strong>${plugin.activeInstallations}</strong></p>` : ""}
    ${plugin.reqWpVersion ? `<p>WordPress Version: <strong>${plugin.reqWpVersion}</strong></p>` : ""}
    ${plugin.testedWpVersion ? `<p>Tested up To: <strong>${plugin.testedWpVersion}</strong></p>` : ""}
    ${plugin.reqPhpVersion ? `<p>PHP Version: <strong>${plugin.reqPhpVersion}</strong></p>` : ""}
    ${plugin.description ? `<p class="card--description"><strong>Description:</strong> ${plugin.description}</p>` : ""}
  </div>
  ${plugin.link? `
  <div class="cart--read-more--container">
    <span class="cart--read-more">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" >
        <path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" ></path>
      </svg>
      Read more
    </span>
  </div>`: ""}
</div>`;

const detectPluginsSkeleton = `
<div class="card border">
  <div class="card--banner card--banner__plugin loading--skeleton"></div>
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <div class="loading--icon card--icon loading--skeleton"></div>
      <h4 class="card--title loading-title loading--skeleton"></h4>
    </div>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;

const noPluginsDetected = (websiteName) => `
<div class="card card__wp border">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="card--icon" width="66" height="54">
    <path stroke="#464342" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9v3a5 5 0 0 1-5 5M7 9v3a5 5 0 0 0 5 5m0 0v4M8 3v3m8-3v3M5 9h14"/>
  </svg>
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p>No plugins detected in <strong>${websiteName}</strong>.</p>
  </div>
</div>`;