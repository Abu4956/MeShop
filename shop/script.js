Auth.guard();

const COLORS = { red: "#d33", blue: "#4938af", green: "#203d3e", black: "#000", white: "#fff" };
const NAMES = Object.keys(COLORS);
const TITLES = { "men's clothing": "Men's Clothing", "women's clothing": "Women's Clothing", jewelery: "Jewellery", electronics: "Electronics" };
let products = [], cat = "all", applied = { cols: [], sizes: [], ranges: [], minRate: 0 };

// FakeStoreAPI has no colors or sizes, so we derive them from the product id
function enrich(p) {
  const colors = [...new Set([NAMES[p.id % 5], NAMES[(p.id * 2 + 1) % 5], p.id % 3 === 0 ? NAMES[(p.id + 3) % 5] : null].filter(Boolean))];
  const clothing = p.category.includes("clothing");
  return { ...p, colors, sizes: clothing ? (p.id % 2 ? ["S", "M", "L"] : ["M", "L", "XL"]) : [] };
}

const checked = (name) => $$(`input[name="${name}"]:checked`).map((i) => i.id);
const PRICE = { "0-25": [0, 25], "25-50": [25, 50], "50-100": [50, 100], "100on": [100, Infinity] };

function render() {
  const q = $("#search").value.toLowerCase().trim();
  const { cols, sizes, ranges, minRate } = applied;
  const list = products.filter((p) =>
    p.title.toLowerCase().includes(q) &&
    (cat === "all" || p.category === cat) &&
    (!cols.length || p.colors.some((c) => cols.includes(c))) &&
    (!sizes.length || p.sizes.some((s) => sizes.includes(s))) &&
    (!ranges.length || ranges.some(([a, b]) => p.price >= a && p.price < b)) &&
    p.rating.rate >= minRate);

  const by = $("#sort").value;
  if (by === "price-asc") list.sort((a, b) => a.price - b.price);
  if (by === "price-desc") list.sort((a, b) => b.price - a.price);
  if (by === "rating") list.sort((a, b) => b.rating.rate - a.rating.rate);
  if (by === "name") list.sort((a, b) => a.title.localeCompare(b.title));

  const cats = Object.keys(TITLES).filter((c) => list.some((p) => p.category === c));
  $("#results").innerHTML = cats.length ? cats.map((c) => `
    <section><title>${TITLES[c]}</title><div class="items">${list.filter((p) => p.category === c).map((p) => `
      <div class="item"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" />
        <div class="info"><div class="title">${esc(p.title)}</div>
          <div class="row"><div class="price">$${p.price.toFixed(2)}</div><div class="sized">${p.sizes.join(",") || "One size"}</div></div>
          <div class="colors">Colors : <div class="row">${p.colors.map((c) => `<div class="circle" title="${c}" style="background-color:${COLORS[c]};border:1px solid #000"></div>`).join("")}</div></div>
          <div>Rating : <span class="stars" title="${p.rating.rate} from ${p.rating.count} reviews">${"★".repeat(Math.round(p.rating.rate))}<i>${"★".repeat(5 - Math.round(p.rating.rate))}</i></span></div></div>
        <button data-id="${p.id}">Add To Cart</button></div>`).join("")}</div></section>`).join("")
    : `<p class="empty">No products match these filters. Try removing one.</p>`;
}

fetch("https://fakestoreapi.com/products").then((r) => r.json()).then((d) => { products = d.map(enrich); render(); })
  .catch(() => ($("#results").innerHTML = `<p class="empty">Could not load products. Check your connection and refresh.</p>`));

$("#search").oninput = render;
$("#sort").onchange = render;
$("#apply").onclick = () => {
  applied = { cols: checked("color"), sizes: checked("size").map((x) => x.toUpperCase()), ranges: checked("prange").map((r) => PRICE[r]), minRate: +$("#range").value };
  render();
};
$("#filters").onclick = (e) => {
  const f = e.target.closest(".filter");
  if (!f) return;
  $$(".filter").forEach((x) => x.classList.toggle("active", x === f));
  cat = f.dataset.cat; render();
};
$("#results").onclick = (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  Cart.add(products.find((p) => p.id === +b.dataset.id));
  toast("Added to cart");
  b.classList.add("pop"); setTimeout(() => b.classList.remove("pop"), 300);
};
