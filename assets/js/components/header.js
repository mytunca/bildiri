class Header {
  static pages = [
    {
      name: "index",
      path: "/",
    },
    {
      name: "approvers",
      path: "/approvers.html",
    },
    {
      name: "sign",
      path: "/sign.html",
    },
    {
      name: "about-us",
      path: "/about-us.html",
    },
    {
      name: "contact",
      path: "/contact.html",
    },
  ];
  static instance = new Header();

  constructor() {
    this.el = document.querySelector("#header");
    this.el.innerHTML = `<h1><a href="/">Standing Doctors</a></h1>`;
    this.create();
  }

  create() {
    const nav = document.createElement("nav");
    nav.id = "nav";

    const ul = document.createElement("ul");

    const li = document.createElement("li");
    li.className = "special";

    const a = document.createElement("a");
    a.href = "#menu";
    a.className = "menuToggle";
    a.appendChild(document.createElement("span"));

    li.appendChild(a);

    const div = document.createElement("div");
    div.id = "menu";

    const innerUl = document.createElement("ul");
    Header.pages.forEach((page) => {
      const li = document.createElement("li");
      const path = window.location.pathname;
      const pageName = path.slice(1).split(".")[0] || "index";

      let el;
      if (page.name === pageName) {
        el = document.createElement("b");
      } else {
        el = document.createElement("a");
        el.href = page.path;
      }

      li.appendChild(el);
      innerUl.appendChild(li);
    });

    div.appendChild(innerUl);

    li.appendChild(div);

    ul.appendChild(li);

    nav.appendChild(ul);

    this.el.appendChild(nav);
  }
}
