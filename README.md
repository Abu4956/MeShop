# MeShop. - Shopping Cart Application

A multi-page shopping cart built with **HTML, CSS and vanilla JavaScript** for the Frontend 3 project. Users can sign up, log in, browse products from an API, filter and sort them, manage a cart, edit their profile and check out with Razorpay.

**Live demo:** https://meshoppp.netlify.app/

## Features

- **Signup and login:** accounts are stored in `localStorage`. A token is created on login, and the shop, cart and profile pages redirect to login without one.
- **Product fetching:** products load from [FakeStoreAPI](https://fakestoreapi.com/products) when the shop page opens.
- **Filtering:** search by name, category buttons (All, Mens, Womens, Jewellery, Electronics), and sidebar filters for colors, sizes, rating and price range, applied with the Apply Filter button.
- **Sorting:** price (low to high, high to low), rating, and name A to Z.
- **Cart:** add items, change quantities, remove items. The cart is saved in `localStorage` and the header shows the item count.
- **Checkout:** Razorpay payment popup. The cart is cleared only after a successful payment, and failed or cancelled payments show a message.
- **Profile:** edit first and last name, and change password (old password is checked). Includes logout.
- **UI:** Inter font, black and white theme following the Figma design, hover and button animations, responsive layout, reduced-motion support.

## Project structure

```
f3-project/
  index.html            landing page
  script.js             shared code: Auth, Cart, nav bar, helpers
  styles.css            shared styles
  landingPagePic.png
  login/                login page
  signup/               signup page
  shop/                 product listing, filters, sorting
  cart/                 cart and Razorpay checkout
  profile/              profile and password change
```

Each page folder has its own `index.html` and `script.js`, and loads the shared `../script.js` and `../styles.css`.

## Run locally

1. Clone or download the repository.
2. Open the folder in VS Code and start **Live Server** on `index.html`. A local server is needed, so don't just double-click the file.
3. Sign up, then browse the shop.

## Razorpay setup

1. Create a Razorpay account and switch to **Test Mode**.
2. Generate a test key under **Account & Settings > API Keys**.
3. Paste the **Key ID** (`rzp_test_...`) into `cart/script.js`:
   ```js
   const RAZORPAY_KEY = "rzp_test_xxxxxxxxxxxx";
   ```
4. Never put the Key Secret in this project.

Test payment details are in the Razorpay docs (for example, a test card `4111 1111 1111 1111` with any future expiry and CVV).

## Deploy to GitHub Pages

1. Push the project so `index.html` is at the repo root.
2. Go to **Settings > Pages**, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`.
3. The site goes live at `https://meshoppp.netlify.app/`. All links are relative, so it works under the repo path.

## Notes and limitations

- FakeStoreAPI has no color or size data, so colors and sizes are derived from each product's id to make those filters work. Sizes only appear on clothing.
- Prices are in USD from the API but are sent to Razorpay as INR for the demo.
- Passwords are stored as plain text in `localStorage`. This is acceptable for a learning project but not for production, where authentication and payment verification belong on a server.

## Tech stack

HTML5, CSS3, JavaScript (ES6+), `localStorage`, Fetch API, FakeStoreAPI, Razorpay Checkout.
