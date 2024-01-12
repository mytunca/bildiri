class Language {
  static select(lang) {
    const path = window.location.pathname;
    const pageName = path.slice(1).split(".")[0] || "index";

    fetch(`assets/i18n/${lang}.json`)
      .then((response) => response.json())
      .then((json) => {
        for (const [componentSelector, componentNodes] of Object.entries(json.components)) {
          const component = document.querySelector(componentSelector);
          for (const [selector, nodesToChange] of Object.entries(componentNodes)) {
            const element = component.querySelector(selector);
            if (element) {
              for (const [prop, value] of Object.entries(nodesToChange)) {
                element[prop] = value;
              }
            }
          }
        }

        const node = json.pages[pageName];

        for (const [selector, nodesToChange] of Object.entries(node)) {
          const element = document.querySelector(selector);
          if (element) {
            for (const [prop, value] of Object.entries(nodesToChange)) {
              element[prop] = value;
            }
          }
        }

        //Her sayfada Content class'ı bulunmalıdır.
        Content.instance.onLanguageChange(lang);

        if (localStorage) localStorage.setItem("selectedLanguage", lang);
      });
  }
}

class LanguageSection {
  static availableLanguages = [
    { label: "Türkçe", abbrv: "tr" },
    { label: "English", abbrv: "en" },
  ];

  static instance = new LanguageSection();

  createLangDiv() {
    const langDiv = document.createElement("div");
    langDiv.id = "langDiv";

    const iconDiv = document.createElement("div");
    iconDiv.id = "iconDiv";
    iconDiv.innerHTML = '<a class="icon solid fa-globe"><span></span></a>';
    iconDiv.onclick = () => this.toggleOptionsDiv();

    const optionsDiv = document.createElement("div");
    optionsDiv.id = "optionsDiv";

    LanguageSection.availableLanguages.forEach((language) => {
      const div = document.createElement("div");
      div.innerText = language.label;
      div.onclick = () => this.handleOptionClick(language.abbrv);
      optionsDiv.appendChild(div);
    });

    optionsDiv.style.display = "none";
    this.optionsDiv = optionsDiv;

    langDiv.append(iconDiv);
    langDiv.append(optionsDiv);

    const nav = document.querySelector("#nav");
    nav.insertBefore(langDiv, nav.children[0]);
  }

  toggleOptionsDiv() {
    if (this.optionsDiv.style.display === "none") {
      this.optionsDiv.style.display = "";
    } else {
      this.optionsDiv.style.display = "none";
    }
  }

  handleOptionClick(lang) {
    Language.select(lang);
    this.toggleOptionsDiv();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  LanguageSection.instance.createLangDiv();
  let lang = (navigator.language || navigator.userLanguage).split("-")[0];

  const availableLanguages = LanguageSection.availableLanguages;
  if (!availableLanguages.find((opt) => opt.abbrv == lang)) lang = "en";

  if (localStorage && localStorage.getItem("selectedLanguage"))
    lang = localStorage.getItem("selectedLanguage");

  Language.select(lang);
});
