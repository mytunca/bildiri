class Footer {
  static icons = [
    {
      href: "https://x.com/standingdoctors",
      class: "icon brands fa-twitter",
      label: "X"
    },
    {
      href: "https://instagram.com/standingdoctors",
      class: "icon brands fa-instagram",
      label: "Instagram"
    },
    {
      href: "https://www.youtube.com/@standingdoctors",
      class: "icon brands fa-youtube",
      label: "YouTube Channel"
    },
    {
      href: "https://t.me/standingdoctors",
      class: "icon brands fa-telegram",
      label: "Telegram Channel"
    },
    {
      href: "https://whatsapp.com/channel/0029VaFOG9dCsU9QdTocTW0u",
      class: "icon brands fa-whatsapp",
      label: "WhatsApp Channel"
    },
    {
      href: "mailto:doctorsstandwithpalestine@gmail.com",
      class: "icon solid fa-envelope",
      label: "Email"
    },
  ];
  static instance = new Footer();

  constructor() {
    this.el = document.querySelector("#footer");
    this.create();
  }

  create() {
    const firstUl = document.createElement("ul");
    firstUl.className = "icons";

    Footer.icons.forEach((icon) => {
      const li = document.createElement("li");

      const a = document.createElement("a");
      a.href = icon.href;
      a.target = "_blank";
      a.className = icon.class;

      const span = document.createElement("span");
      span.className = "label";
      span.textContent = icon.label;

      a.appendChild(span);
      li.appendChild(a);
      firstUl.appendChild(li);
    });

    this.el.appendChild(firstUl);

    const secondUl = document.createElement("ul");
    secondUl.className = "copyright";
    secondUl.innerHTML = `
    <li>&copy; 2023</li>
    <li>Prepared By Dr. Muhammet Yunus Tunca</li>
    <li>Design: <a href="http://html5up.net/spectral" target="_blank">HTML5 UP</a></li>`;

    this.el.appendChild(secondUl);
    
  }
}
