document.addEventListener("DOMContentLoaded", (event) => {
  const inputForm = document.getElementById("inputForm");
  const outputContainer = document.getElementById("outputContainer");

  let oldUrl = "";

  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get the inputUrl url
    let inputUrl = document.getElementById("inputUrl").value;

    if (oldUrl !== inputUrl) {
      const websiteName = formatWebsiteName(inputUrl);

      // Wordpress Detected container
      outputContainer.innerHTML = "";
      const wpContainer = document.createElement("div");
      outputContainer.appendChild(wpContainer);
      wpContainer.innerHTML = analyzingResultsTitle(websiteName);
      wpContainer.innerHTML += detectWpSkeleton;

      // Themes Detected container
      const themesContainer = document.createElement("div");
      outputContainer.appendChild(themesContainer);
      themesContainer.innerHTML = analyzingThemesTitle(websiteName);
      themesContainer.innerHTML += detectThemesSkeleton;

      // Plugins Detected container
      const pluginsContainer = document.createElement("div");
      outputContainer.appendChild(pluginsContainer);
      pluginsContainer.innerHTML = analyzingPluginsTitle(websiteName);
      pluginsContainer.innerHTML += detectPluginsSkeleton;
      pluginsContainer.innerHTML += detectPluginsSkeleton;
      pluginsContainer.innerHTML += detectPluginsSkeleton;

      if (validateUrl(inputUrl)) {
        oldUrl = inputUrl;
        inputUrl = sanatizeUrl(inputUrl);

        apiRequest(inputUrl, "wp")
          .then((data) => {
            wpContainer.innerHTML = showingResultsTitle(websiteName);

            if (data.wp === true) {
              wpContainer.innerHTML += detectWpSuccess(websiteName);

              apiRequest(inputUrl, "themes").then((data) => {
                themesContainer.innerHTML = detectThemesTitle(websiteName);

                if (data.themes) {
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

              apiRequest(inputUrl, "plugins").then((data) => {
                pluginsContainer.innerHTML = detectPluginsTitle(websiteName);

                if (data.plugins) {
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
            } else if (data.wp === false) {
              wpContainer.innerHTML += detectWpFail(websiteName);

              apiRequest(inputUrl, "top-themes").then((data) => {
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
              });

              apiRequest(inputUrl, "top-plugins").then((data) => {
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
              });
            }
          })
          .catch(() => {
            outputContainer.innerHTML = showingResultsTitle(websiteName);
            outputContainer.innerHTML += htmlRetrieveError(websiteName);
          });
      } else {
        oldUrl = "";
        outputContainer.innerHTML = invalidUrl;
      }
    }
  });
});

// Functions

const formatWebsiteName = (url) => {
  url = url.replace(/^(https?:\/\/)?/, "");
  url = url.replace(/\/+$/, "");
  url = url.slice(0).toLowerCase();
  return url;
};

const validateUrl = (string) => {
  let pattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!pattern.test(string);
};

const sanatizeUrl = (url) => {
  url = url.replace(/\/+$/, ""); // Remove / at the end of the URL if needed
  if (!/^https?:\/\//i.test(url)) {
    // Add https:// if needed
    url = "https://" + url;
  }
  return url;
};

const apiRequest = (inputUrl, type) => {
  return fetch(
    `https://wp-detector.000webhostapp.com?url=${inputUrl}&type=${type}`,
    { mode: "no-cors" }
  ).then((response) => response.json());
};

// Elements

const invalidUrl = `
<p class="input--invalid-message">
  Invalid URL. Please enter a valid URL.
</p>`;

const analyzingResultsTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing <strong>${websiteName}</strong>
</h3>`;

const analyzingThemesTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing themes in <strong>${websiteName}</strong>
</h3>`;

const analyzingPluginsTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing plugins in <strong>${websiteName}</strong>
</h3>`;

const showingResultsTitle = (websiteName) => `
<h3 class="input--section-title">
  Showing results for <strong>${websiteName}</strong>:
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
  Top 5 most commonly detected <strong>themes</strong>:
</h3>`;

const topPluginsTitle = `
<h3 class="input--section-title">
  Top 5 most commonly detected <strong>plugins</strong>:
</h3>`;

const detectWpSuccess = (websiteName) => `
<div class="card card__wp border">
  <img src="/wordpress-detector-success.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__success">Hurray!</h4>
    <p><strong>${websiteName}</strong> is using WordPress!</p>
  </div>
</div>`;

const detectWpFail = (websiteName) => `
<div class="card card__wp border">
  <img src="/wordpress-detector-fail.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p><strong>${websiteName}</strong> is not using WordPress.</p>
  </div>
</div>`;

const htmlRetrieveError = (websiteName) => `
<div class="card card__wp border">
  <img src="/html-retrieve-error.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p> We could not retrieve the HTML from: <strong>${websiteName}</strong>.</p>
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
  <img src="${theme.banner}" alt="Theme Banner" class="card--banner" />
  <div class="card--info-container">
    <h4 class="card--title">${theme.title}</h4>
    <p>Author: <strong>${theme.author}</strong></p>
    <p>Version: <span class="badge">${theme.version}</span></p>
    <p>Website: <a href="${theme.website}" target="_blank">${
      theme.sanatizedWebsite
    }</a></p>
    <p>WordPress Version: <strong>${theme.reqWpVersion} or higher</strong></p>
    <p>Tested up To: <strong>${theme.testedWpVersion}</strong></p>
    <p>PHP Version: <strong>${theme.reqPhpVersion} or higher</strong></p>
    <p class="card--description">
      <strong>Description:</strong> ${theme.description}
    </p>
  </div>
  ${
    theme.link
      ? `
  <div class="cart--read-more--container">
    <span class="cart--read-more">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" >
        <path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" ></path>
      </svg>
      Read more
    </span>
  </div>`
      : ""
  }
</div>`;

const detectThemesSkeleton = `
<div class="card border">
  <div class="loading--image loading--skeleton"></div>
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
<div class="card border">
  <div class="loading--image loading--skeleton"></div>
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <div class="loading--icon card--icon loading--skeleton"></div>
      <h4 class="card--title">No themes detected in ${websiteName}</h4>
    </div>
  </div>
</div>`;

const detectPluginsCard = (plugin) => `
<div class="card card--hover border">
  <img src="${plugin.banner}" alt="Plugin Banner" class="card--banner" />
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <img src="${
        plugin.icon
      }" alt="Plugin Icon" class="card--icon" width="60px" height="60px" />
      <h4 class="card--title">${plugin.title}</h4>
    </div>
    <p>Author: <strong>${plugin.author}</strong></p>
    <p>Version: <span class="badge">${plugin.version}</span></p>
    <p>Website: <a href="${plugin.website}" target="_blank">${
      plugin.sanatizedWebsite
    }</a></p>
    <p>WordPress Version: <strong>${plugin.reqWpVersion} or higher</strong></p>
    <p>Tested up To: <strong>${plugin.testedWpVersion}</strong></p>
    <p>PHP Version: <strong>${plugin.reqPhpVersion} or higher</strong></p>
    <p class="card--description">
      <strong>Description:</strong> ${plugin.description}
    </p>
  </div>
  ${
    plugin.link
      ? `
  <div class="cart--read-more--container">
    <span class="cart--read-more">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" >
        <path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" ></path>
      </svg>
      Read more
    </span>
  </div>`
      : ""
  }
</div>`;

const detectPluginsSkeleton = `
<div class="card border">
  <div class="loading--image loading--skeleton"></div>
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <div class="loading--icon card--icon loading--skeleton"></div>
      <h4 class="card--title loading-title loading--skeleton"></h4>
    </div>
    <p class="loading-p loading--skeleton loading__30"></p>
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

const noPluginsDetected = (websiteName) => `
<div class="card border">
  <div class="loading--image loading--skeleton"></div>
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <div class="loading--icon card--icon loading--skeleton"></div>
      <h4 class="card--title">No plugins detected in ${websiteName}</h4>
    </div>
  </div>
</div>`;
