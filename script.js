document.addEventListener('DOMContentLoaded', function () {
  // Varsayılan dil: Türkçe
  let currentLanguage = 'tr';

  // Dil seçimini kontrol et
  const languageSelectors = document.querySelectorAll('.flag');
  languageSelectors.forEach(flag => {
    flag.addEventListener('click', e => {
      if (currentLanguage == flag.dataset.lang) return;

      currentLanguage = flag.dataset.lang;
      updateText();
    });
  });

  document.querySelector("#filter").addEventListener("input", e => {
    SignatureTable.filter = e.target.value;
  })

  // Metin ve tabloyu güncelle
  function updateText() {
    const declarationText = document.getElementById('declaration-text');

    // Önceki içerikleri temizle
    declarationText.innerHTML = '';

    // Metin dosyasını oku ve içeriği ekle
    fetch(`assets/content/${currentLanguage}.md`)
      .then(response => response.text())
      .then(data => {
        // Showdown.js'yi kullanarak Markdown içeriğini HTML'ye dönüştür
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(data);
        declarationText.innerHTML = htmlContent;
      })
      .catch(error => {
        console.error('Hata:', error);
      });
    
    //Sayfadaki diğer metin içeriklerini güncelle
    fetch(`assets/i18n/${currentLanguage}.json`)
      .then(response => response.json())
      .then(languageData => {
        document.lang = currentLanguage;
        if (currentLanguage == "ar") document.dir = "rtl";
        else document.dir = "";

        const elementsToUpdate = [
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
        ];

        console.log(elementsToUpdate);

        elementsToUpdate.forEach(el => {
          console.log(el);
          document.getElementById(el.id)[el.toUpdate] = languageData[el.id];
        })

      })
      .catch(error => {
        console.error('Hata:', error);
      });
  }

  // Sayfa yüklendiğinde metni ve tabloyu güncelle
  updateText();
  //SignatureTable.getData();
});

class SignatureTable {
  static el = document.querySelector('#signature-list');
  static data = [];

  static getData() {
    this.el.innerHTML = '<tr><td></td><td colspan="2">İsimler yükleniyor...</td></tr>';
    const url = "https://script.google.com/macros/s/AKfycbyz5Ff8EnFAh9acbVi8Vjeip1AkQJFy4CXA2DL7rzaf-4eTuEJAJgRtAIvmuEGZ2Vrjgw/exec";
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
