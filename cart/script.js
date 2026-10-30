Auth.guard();
const RAZORPAY_KEY = "API KEY"; // paste your Razorpay test Key ID here

function draw() {
  const c = Cart.items();
  $("#list").innerHTML = c.length
    ? c.map((i) => `<div class="crow"><img src="${esc(i.image)}" alt="" /><div><div>${esc(i.title)}</div><small>$${i.price.toFixed(2)} each</small></div>
        <div class="qty"><button class="ghost" data-a="-" data-id="${i.id}" aria-label="Decrease quantity">-</button>${i.qty}<button class="ghost" data-a="+" data-id="${i.id}" aria-label="Increase quantity">+</button></div>
        <button class="ghost" data-a="x" data-id="${i.id}">Remove</button></div>`).join("")
    : `<p class="empty">Your cart is empty. <a href="../shop/">Go to the shop</a></p>`;
  $("#total").innerHTML = c.length ? `<div class="total"><span>Total: $${Cart.total().toFixed(2)}</span><button id="checkout">Checkout</button></div>` : "";
}

$("#list").onclick = (e) => {
  const b = e.target.closest("button[data-a]");
  if (!b) return;
  const id = +b.dataset.id, item = Cart.items().find((x) => x.id === id);
  b.dataset.a === "x" ? Cart.remove(id) : Cart.setQty(id, item.qty + (b.dataset.a === "+" ? 1 : -1));
  draw();
};

$("#total").onclick = (e) => {
  if (!e.target.closest("#checkout")) return;
  if (typeof Razorpay === "undefined") return toast("Payment service failed to load. Check your connection.");
  if (RAZORPAY_KEY.includes("API_KEY")) return toast("Add your Razorpay test key in cart/script.js first.");
  const u = Auth.user();
  const rzp = new Razorpay({
    key: RAZORPAY_KEY,
    amount: Math.round(Cart.total() * 100), // paise
    currency: "INR",
    name: "MeShop. Checkout",
    description: "This is your order",
    theme: { color: "#000" },
    prefill: { name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(), email: u.email },
    handler() { Cart.clear(); draw(); toast("Payment successful. Your cart is empty."); }, // clear cart only on success
    modal: { ondismiss: () => toast("Checkout closed. Your cart is unchanged.") },
  });
  rzp.on("payment.failed", (r) => toast("Payment failed: " + (r.error?.description || "please try again.")));
  rzp.open();
};
draw();
