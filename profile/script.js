Auth.guard();
const me = Auth.user();
// accounts made before first/last name existed only have a single "name"
$("#fn").value = me.firstName ?? (me.name || "").split(" ")[0];
$("#ln").value = me.lastName ?? (me.name || "").split(" ").slice(1).join(" ");

const update = (patch) => set("users", Auth.users().map((u) => (u.email === me.email ? { ...u, ...patch } : u)));
const say = (id, text, ok) => { const m = $(id); m.className = "msg" + (ok ? " ok" : ""); m.textContent = text; };

$("#info").onsubmit = (e) => {
  e.preventDefault();
  update({ firstName: $("#fn").value.trim(), lastName: $("#ln").value.trim() });
  say("#m1", "Saved.", true);
};

$("#pw").onsubmit = (e) => {
  e.preventDefault();
  if ($("#old").value !== me.password) return say("#m2", "Old password is incorrect.");
  if ($("#new").value !== $("#con").value) return say("#m2", "New passwords do not match.");
  update({ password: $("#new").value });
  me.password = $("#new").value;
  e.target.reset();
  say("#m2", "Password changed.", true);
};

$("#logout").onclick = () => Auth.logout();
