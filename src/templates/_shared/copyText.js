/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONUN ÖZ MƏTNLƏRİ — köməkçilər (2026-10-28)

   Premium dizaynların hər birinin yalnız özünə aid sətirləri var: bilet
   sahələri («Sərnişinlər», «Birinci sinif»), qəzet rubrikaları, kino
   titrləri, yuxarı paneldəki brend yazısı və s. Bunlar `<şablon>/copy.js`
   faylındadır — həm şablon, həm admin «Mətnlər» tabı eyni mənbədən oxuyur.

   Admin dəyişikliyi `form_data.admin.strings`-də saxlanılır, açar:
   `tpl_<şablon_id>.<açar>` (məs. `tpl_boarding_pass.pax`). ⚠ Bu forma
   serverin açar yoxlamasına (`admin_invitation_content.php`) uyğundur:
   bir nöqtə, defis yox.
   ⚠ React YOXDUR — node testləri və admin override qatı bu faylı yükləyir.
   ───────────────────────────────────────────────────────────────────────── */

/** Şablonun admin açar prefiksi: 'boarding-pass' → 'tpl_boarding_pass.' */
export function copyPrefix(templateId) {
  return `tpl_${String(templateId).replace(/-/g, '_')}.`
}

/** `{ad}` yer tutucularını doldur; naməlum yer tutucu olduğu kimi qalır */
export function fill(str, vars) {
  return String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k] ?? '') : m))
}
