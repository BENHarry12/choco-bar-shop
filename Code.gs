// Choco Bar: Google Sheet backend
const P = {DARK70: 89, MILK40: 79, ALMOND55: 99};
const ST = ["ใหม่", "หยิบแล้ว", "แพ็คแล้ว", "ส่งแล้ว"];
const H = ["id", "time", "name", "phone", "address", "zip", "items", "total", "note", "status"];
function setup() {
  const p = PropertiesService.getScriptProperties();
  if (!p.getProperty("SID")) {
    const b = SpreadsheetApp.create("Choco Bar Orders");
    b.getSheets()[0].setName("orders").appendRow(H);
    const key = Utilities.getUuid().slice(0, 13);
    b.insertSheet("config").appendRow(["ADMIN_KEY", key]);
    p.setProperties({SID: b.getId(), KEY: key});
  }
  Logger.log("https://docs.google.com/spreadsheets/d/" + p.getProperty("SID"));
}
function sheet() {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SID")).getSheetByName("orders");
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return out({ok: true}); }
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents), s = sheet(), t = (v, n) => "'" + String(v || "").slice(0, n);
    if (d.action === "order") {
      const it = Object.keys(P).map(k => [k, Math.min(99, Math.max(0, parseInt(d.cart[k]) || 0))]).filter(x => x[1]);
      if (!it.length || !d.name || !d.address || !/^0\d{8,9}$/.test(d.phone) || !/^\d{5}$/.test(d.zip)) return out({error: "ข้อมูลไม่ครบหรือไม่ถูกต้อง"});
      const total = it.reduce((a, x) => a + P[x[0]] * x[1], 0) + 40, id = "CB" + Date.now();
      s.appendRow([id, new Date(), t(d.name, 100), t(d.phone, 10), t(d.address, 400), t(d.zip, 5), it.map(x => x.join("x")).join(","), total, t(d.note, 200), ST[0]]);
      return out({id: id, total: total});
    }
    const key = PropertiesService.getScriptProperties().getProperty("KEY");
    if (!key || d.key !== key) return out({error: "รหัสแอดมินไม่ถูกต้อง"});
    const rows = s.getDataRange().getDisplayValues().slice(1);
    if (d.action === "list") return out({orders: rows.map(r => Object.fromEntries(H.map((h, i) => [h, r[i]])))});
    if (d.action === "status" && ST.includes(d.status)) {
      const i = rows.findIndex(r => r[0] === d.id);
      if (i < 0) return out({error: "ไม่พบออเดอร์"});
      s.getRange(i + 2, 10).setValue(d.status);
      return out({ok: true});
    }
    return out({error: "คำสั่งไม่ถูกต้อง"});
  } catch (x) { return out({error: String(x)}); } finally { lock.releaseLock(); }
}

