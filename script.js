// ---------- shared helpers (used by every page) ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ROOT = document.body.dataset.root || "./";
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const Auth = {
  users: () => get("users", []),
  token: () => localStorage.getItem("token"),
  user() { return this.users().find((u) => u.email === localStorage.getItem("currentUser")); },
  signup(firstName, lastName, email, password) {
    const users = this.users();
    if (users.some((u) => u.email === email)) throw new Error("An account with this email already exists.");
    users.push({ firstName, lastName, email, password });
    set("users", users);
  },
  login(email, password) {
    const u = this.users().find((x) => x.email === email && x.password === password);
    if (!u) throw new Error("Email or password is incorrect.");
    localStorage.setItem("token", crypto.randomUUID() + Date.now().toString(36)); // login token
    localStorage.setItem("currentUser", email);
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    location.href = ROOT + "login/";
  },
  guard() { if (!this.token() || !this.user()) location.href = ROOT + "login/"; },
};

const Cart = {
  items: () => get("myCart", []),
  save(c) { set("myCart", c); Cart.badge(); },
  add(p) {
    const c = this.items(), f = c.find((i) => i.id === p.id);
    f ? f.qty++ : c.push({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });
    this.save(c);
  },
  remove(id) { this.save(this.items().filter((i) => i.id !== id)); },
  setQty(id, q) { q < 1 ? this.remove(id) : this.save(this.items().map((i) => (i.id === id ? { ...i, qty: q } : i))); },
  total: () => Cart.items().reduce((s, i) => s + i.price * i.qty, 0),
  clear() { this.save([]); },
  badge() { const b = $("#badge"); if (b) b.textContent = this.items().reduce((s, i) => s + i.qty, 0); },
};

function toast(t) {
  let e = $("#toast");
  if (!e) { e = document.createElement("div"); e.id = "toast"; document.body.append(e); }
  e.textContent = t; e.classList.add("show");
  setTimeout(() => e.classList.remove("show"), 1800);
}

// builds the nav bar (matches the template: brand left, links right)
function renderNav() {
  const out = Auth.token();
  // the profile screen in the design has a bare black bar titled "Shopping Cart"
  if (document.body.dataset.nav === "minimal") {
    document.body.insertAdjacentHTML("afterbegin", `<nav><div class="brand small"><a href="${ROOT}">Shopping Cart</a></div></nav>`);
    return;
  }
  document.body.insertAdjacentHTML("afterbegin", `<nav><div class="brand"><a href="${ROOT}">MeShop.</a></div><div class="nav-items">
    <a href="${ROOT}">Home</a>
    ${out ? `<a href="${ROOT}shop/">Shop</a><a href="${ROOT}cart/">My Cart (<span id="badge">0</span>)</a><a href="${ROOT}profile/">Profile</a>`
          : `<a href="${ROOT}login/">Login</a><a href="${ROOT}signup/">Signup</a>`}</div></nav>`);
  Cart.badge();
}
renderNav();
