document.addEventListener('DOMContentLoaded', function () {
  // Dil seçimini kontrol et
  const languageSelectors = document.querySelectorAll('.flag');
  languageSelectors.forEach(flag => {
    flag.addEventListener('click', e => {
      if (i18n.currentLanguage == flag.dataset.lang) return;

      i18n.currentLanguage = flag.dataset.lang;
    });
  });

  document.querySelector("#filter").addEventListener("input", e => {
    SignatureTable.filter = e.target.value;
  })

  //i18n.currentLanguage = "tr";

  SignatureTable.getData();
});

class SignatureTable {
  static el = document.querySelector('#signature-list');
  static data = [];

  static async getData() {
    const langData = await i18n.getData();
    const loading = langData["loading"];

    this.el.innerHTML = `<tr><td></td><td colspan="2" id="loading">${loading}</td></tr>`;
    const url = "https://script.google.com/macros/s/AKfycby8oix6aoonJOVvJNCqtARCzoTFltj6fhvGEHB361tqJEY5WWWqo-PsEXY3Lv8Rlx4E/exec";
    fetch(url)
      .then(x => x.json())
      .then(data => { this.data = data; this.render() })
      .catch(error => {
        console.error('Hata:', error);
      });
  }

  static render() {

    const dataToRender = this._filter
      ? this.data.filter(row => {
        return row.name
          .replaceAll(" ", "")
          .toLocaleLowerCase()
          .includes(this._filter.toLocaleLowerCase());
      })
      : this.data;

    this.el.innerHTML = dataToRender
      .map(row => {
        return `
          <tr>
            <td></td>
            <td>${row.name}</td>
            <td>${new Date(row.time).toLocaleString("tr-TR")}</td>
          </tr>
        `
      })
      .join("")
  }

  /**
   * @param {String} text
   */
  static set filter(text) {
    this._filter = text.replaceAll(" ", "");
    this.render();
  }

}

class Content {
  static declarationText = document.getElementById('declaration-text');

  static update() {
    // Önceki içerikleri temizle
    this.declarationText.innerHTML = '';

    // Metin dosyasını oku ve içeriği ekle
    fetch(`assets/content/${i18n.currentLanguage}.md`)
      .then(response => response.text())
      .then(data => {
        // Showdown.js'yi kullanarak Markdown içeriğini HTML'ye dönüştür
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(data);
        this.declarationText.innerHTML = htmlContent;
      })
      .catch(error => {
        console.error('Hata:', error);
      });
  }
}

class i18n {
  static _data = {};
  static _currentLanguage = 'tr';
  static elementsToUpdate = [
    {
      id: "navbar-title",
      toUpdate: "innerHTML"
    },
    {
      id: "th-name",
      toUpdate: "innerHTML"
    },
    {
      id: "th-signature-date",
      toUpdate: "innerHTML"
    },
    {
      id: "signature-list-caption",
      toUpdate: "innerHTML"
    },
    {
      id: "filter",
      toUpdate: "placeholder"
    },
    {
      id: "loading",
      toUpdate: "innerHTML"
    },
  ];

  /**
   * @param {String} lang
   */
  static set currentLanguage(lang) {
    this._currentLanguage = lang;
    document.documentElement.lang = lang;
    if (lang == "ar") document.dir = "rtl";
    else document.dir = "";
    this.applyLanguage();

  }

  static get currentLanguage() { return this._currentLanguage }

  static async getData() {
    if (!this._data[this.currentLanguage]) {
      const response = await fetch(`assets/i18n/${this.currentLanguage}.json`);
      const languageData = await response.json();

      this._data[this.currentLanguage] = languageData;
    }

    return this._data[this.currentLanguage];
  }

  static async applyLanguage() {
    Content.update();

    const languageData = await this.getData();
    this.elementsToUpdate.forEach(el => {
      const elToChange = document.getElementById(el.id);
      elToChange && (elToChange[el.toUpdate] = languageData[el.id])
    })
  }

}
