if (Auth.token() && Auth.user()) location.href = "../shop/";
$("#f").onsubmit = (ev) => {
  ev.preventDefault();
  try { Auth.login($("#e").value.trim().toLowerCase(), $("#p").value); location.href = "../shop/"; }
  catch (x) { $("#m").textContent = x.message; }
};
