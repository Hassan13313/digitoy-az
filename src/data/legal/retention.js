/* Phase 47 — Məxfilik siyasətində yazılan saxlama müddətləri.
   ⚠ public/api/retention.php-dəki RET_* sabitləri ilə EYNİ olmalıdır:
   siyasət nə vəd edirsə, avtomatik təmizləmə onu edir
   (tests/legal_content_test.mjs yoxlayır). */
export const RETENTION = {
  auditIpDays:   90,   /* RET_AUDIT_IP_DAYS */
  galleryIpDays: 7,    /* RET_GALLERY_IP_DAYS */
  tempHours:     24,   /* RET_TEMP_HOURS */
  mediaLogDays:  30,   /* RET_MEDIA_LOG_DAYS */
  draftDays:     30,   /* RET_DRAFT_DAYS */
}
