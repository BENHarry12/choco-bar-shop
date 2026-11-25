const P = {
DARK70: {n: "ดาร์กช็อกโกแลต 70%", p: 89, i: "images/dark70.svg", d: "เข้มลึก หวานน้อย หอมโกโก้แท้ 60 กรัม"},
MILK40: {n: "ช็อกโกแลตนม 40%", p: 79, i: "images/milk40.svg", d: "นุ่มละมุน หอมนม ทานง่าย 60 กรัม"},
ALMOND55: {n: "อัลมอนด์คาราเมล 55%", p: 99, i: "images/almond55.svg", d: "กรุบอัลมอนด์อบ หวานคาราเมล 65 กรัม"}
};
const SHIP = 40, $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");
const cart = () => JSON.parse(localStorage.getItem("cart") || "{}");
const api = async b => (await fetch(API, {method: "POST", body: JSON.stringify(b)})).json();
function setQ(k, q) { const c = cart(); c[k] = Math.max(0, Math.min(99, parseInt(q) || 0)); localStorage.setItem("cart", JSON.stringify(c)); nav(); }
function add(k) { setQ(k, (cart()[k] || 0) + 1); }
function nav() {
const n = Object.values(cart()).reduce((a, b) => a + b, 0);
$("nav").innerHTML = '<a class="logo" href="index.html">COCOA LANE</a><a href="product.html">สินค้า</a><a href="order.html">ตะกร้า (' + n + ')</a>';
}
function grid() {
$("#grid").innerHTML = Object.entries(P).map(([k, x]) => '<article><img src="' + x.i + '" alt="' + x.n + '"><h3>' + x.n + '</h3><small>SKU: ' + k + '</small><p>' + x.d + '</p><b>' + x.p + ' บาท</b><button onclick="add(\'' + k + '\')">หยิบใส่ตะกร้า</button></article>').join("");
}
nav(); if ($("#grid")) grid();
