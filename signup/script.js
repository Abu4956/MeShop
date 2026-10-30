$("#f").onsubmit = (ev) => {
  ev.preventDefault();
  if ($("#p").value !== $("#c").value) return ($("#m").textContent = "Passwords do not match.");
  const email = $("#e").value.trim().toLowerCase();
  try {
    Auth.signup($("#n").value.trim(), $("#ln").value.trim(), email, $("#p").value);
    Auth.login(email, $("#p").value);
    location.href = "../shop/";
  } catch (x) { $("#m").textContent = x.message; }
};
