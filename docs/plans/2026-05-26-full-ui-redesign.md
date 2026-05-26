# Digitoy.az — Tam UI/UX Redesign Planı
# 3D + Glassmorphism + Premium Smoothness

**Məqsəd:** Bütün saytı (landing + dəvətnamə + builder + admin) 3D dərinlik,
dramatik glassmorphism və premium animasiya ilə tam yenidən dizayn etmək.

**Yanaşma:** Hər Phase üçün: canlı screenshot → Claude Design prompt → kod inteqrasiyası
→ brauzer testi → git commit. Hər Phase öz-özünə işləyən bitmiş mərhələdir.

**Tech:** React 19 + Framer Motion + Tailwind CSS v3 + inline styles

**Rəng sistemi (dəyişmir):**
- Cream bg: `#F5F0E8` | Gold: `#C5A059` | Ink: `#2C1A0E` | Muted: `#8B6F5E`
- VIP dark: `#1A1209`

---

## İş Axını (hər Phase üçün eynidir)

```
1. Mən → canlı screenshot alıram (Playwright)
2. Mən → Claude Design prompt hazırlayıram
3. Sən → Claude Design-a göndərirsən + screenshot-ları attach edirsən
4. Sən → nəticəni mənə göndərirsən
5. Mən → kodu mövcud layihəyə inteqrasiya edirəm
6. Mən → brauzer testi (Playwright screenshot)
7. Mən → git commit + GitHub push
```

---

## PHASE 0 — Dizayn Təməli (Hər Şeydən Əvvəl)

**Niyə əvvəl:** Bütün digər Phase-lər buradan asılıdır. Glass recipe, animasiya
presetləri, background sistemi — hamısı burada müəyyənləşir.

**Fayllar:**
- Yarat: `src/styles/glass.css` — CSS dəyişənləri
- Yarat: `src/components/ui/GlassPanel.jsx` — universal glass wrapper
- Yarat: `src/components/ui/GlowBlob.jsx` — arxa fon glow elementləri
- Yarat: `src/components/ui/AnimatedBackground.jsx` — hərəkətli gradient mesh
- Dəyiş: `src/index.css` — global 3D context, perspective
- Dəyiş: `src/App.jsx` — AnimatedBackground + GlowBlob-ları əlavə et

**Nə edilir:**
- [ ] CSS dəyişənlər: `--glass-light`, `--glass-blur`, `--glass-border`,
  `--glass-shadow`, `--glow-gold`, `--spring-bounce`
- [ ] `AnimatedBackground`: 3 rəngli yavaş hərəkət edən gradient mesh (15s loop)
- [ ] `GlowBlob`: mövqe, ölçü, rəng, blur props alan komponentin
- [ ] `GlassPanel`: `backdrop-filter: blur(32px)`, `rgba(255,255,255,0.12)`,
  `border: 1px solid rgba(255,255,255,0.25)` — universal wrapper
- [ ] `perspective: 1200px` global root-a əlavə edilir
- [ ] Grain texture: `src/assets/noise.svg` (SVG-based, 3% opacity overlay)

---

## PHASE 1 — Landing Page

**Mövcud vəziyyət:** Düz, flat cream. Glassmorphism çox zəif. 3D yoxdur.

**Hədəf:** Saytın üzü — ziyarətçinin ilk gördüyü. Ən çox görünən hissə.

**Alt bölmələr (prioritet sırası):**

### 1A — Navbar
- Fayllar: `src/components/ui/TubelightNavbar.jsx`
- Deep glass: `backdrop-blur(24px)`, `rgba(245,240,232,0.72)`, gold alt xətt
- Active tab: gold glow + underline indicator

### 1B — Hero
- Fayllar: `src/components/landing/Hero.jsx`
- Floating 3D elementlər: tiltlənmiş dəvətnamə mockup + 3 qızılı halqa + 50 dust particle
- Mouse parallax: bütün hero ±4px başlıq, ±20px elementlər
- CTA glass panel: iki düymə glass paneldə
- Badge glass pill treatment

### 1C — Features Section
- Fayllar: `src/components/landing/Features.jsx`
- Glass tile grid: hər feature glass kart
- Hover: translateZ(12px) + glow

### 1D — "Necə İşləyir?" (StickyScrollReveal)
- Fayllar: `src/components/ui/StickyScrollReveal.jsx`
- Hər addım: viewport-a girəndə "kristallaşır" (blur 10px → 0 + opacity)
- Glass panel arxa fon

### 1E — PackageSelect (Pricing Cards)
- Fayllar: `src/components/landing/PackageSelect.jsx`
- SADƏ: light glass + light flare
- VİP: dark glass + ambient gold glow arxasında + border beam gücləndir
- PREMIUM: iridescent shimmer border hover-da
- Bütün kartlar: hover lift + shadow dərinləşir

### 1F — Testimonials
- Fayllar: `src/components/landing/TestimonialsSection.jsx`
- Glass bubble kartlar (indiki görünməz kartlar yerinə)
- Böyük qızılı quotation marks (decorative)

### 1G — FAQ + Footer
- Fayllar: `src/components/landing/Hero.jsx` (FAQSection burada)
- FAQ accordion: glass panel + smooth height animation
- Footer: dark glass panel (mövcud dark bg-ni glass-a çevir)

---

## PHASE 2 — Dəvətnamə Səhifəsi (InvitationPage)

**Mövcud vəziyyət:** Funksional amma flat. Qonaqların gördüyü ən vacib səhifə.

**Hədəf:** "Açdığında nəfəs kəsilsin" hissi. Ən premium səhifə olmalıdır.

**Fayllar:**
- `src/components/invitation/EnvelopeOpening.jsx` — artıq glass var, gücləndir
- `src/components/invitation/InvitationPage.jsx` — əsas wrapper
- `src/components/invitation/` — bütün sub-komponentlər

**Alt bölmələr:**

### 2A — Zərf Açılışı (EnvelopeOpening)
- Artıq glassmorphism var — particle burst var
- 3D yüksəltmə: zərfin özü 3D perspective-də (rotateX açılarkən)
- Arxa fonda gold glow burst

### 2B — Dəvətnamə Header/Cover
- Cütlüyün adları: böyük Cormorant Garamond + gold glow
- Tarix/saat: glass pill badges
- Arxa fon: animated gradient mesh (wedding theme — rose + gold)

### 2C — Proqram/Timeline
- Hər proqram elementi: glass card, sol tərəf gold timeline xətti
- Entry animation: soldan sürüşərək + glass materializes

### 2D — Məkan/Venue (Google Maps)
- Xəritə: glass frame içində
- Adres + naviqasiya düymələri (Google Maps, Waze, Apple Maps): glass buttons
- Location pin: animated gold pulse

### 2E — Dress Code
- Kişi/Xanım kartları: glass tiles + figure icons
- Seçilmiş style: glass highlight + glow

### 2F — Oturma Planı
- Masa kartları: glass tiles grid
- Hover: masa üzərindəki qonaqlar görünür (tooltip glass panel)

### 2G — Foto Qalereyası
- Grid: glass frame + image hover scale
- Lightbox: full glass overlay

### 2H — Guestbook
- Mesaj kartları: glass bubbles (chat-style)
- Input: glass textarea + shimmer send button

### 2I — RSVP
- Cavab düymələri: glass pills (Gələcəm / Gələ bilmərəm)
- Confirmation: glass modal + confetti

---

## PHASE 3 — Builder Forması (BuilderForm)

**Mövcud vəziyyət:** Funksional 6 addımlı forma, plain white panels.

**Hədəf:** Forma doldurmaq xoş hiss etdirsin — premium SaaS UI.

**Fayllar:**
- `src/components/landing/BuilderForm.jsx`
- `src/components/landing/PackageSelect.jsx` (standalone flow)

**Alt bölmələr:**

### 3A — Addım Naviqatoru (Stepper)
- Glass pill stepper (üstdə horizontal)
- Active step: gold glow + scale
- Completed steps: checkmark + gold

### 3B — Forma Paneli (hər addım)
- Hər addım: glass panel `backdrop-blur(32px)` içində
- Addımlar arası keçiş: 3D page flip (rotateY 0→-90→0)
- Input sahələri: glass inputs (light frost + gold focus border)

### 3C — Addım 1: Tədbir Növü
- Toy/Nişan/Birthday/Corporate kartları: glass selection tiles
- Seçilmiş: gold border + glass glow

### 3D — Addım 2: Məkan (Google Maps)
- Search input: glass + gold focus
- Xəritə: glass frame-də
- Suggestion dropdown: glass panel + blur

### 3E — Addım 3: Proqram
- Hər sıra: glass row + drag handle (reorder üçün)
- "Əlavə et" düyməsi: glass + shimmer

### 3F — Addım 4: Dress Code
- Style kartları: glass tiles (əvvəlcədən var, glass upgrade)

### 3G — Addım 5: Oturma Planı
- Masa/qonaq editor: glass grid
- "Masa əlavə et" CTA: glass button

### 3H — Addım 6: Foto & QR
- Upload zone: glass dashed border + drag-over glow
- QR kod: glass panel + gold border

---

## PHASE 4 — Preview (Xülasə Səhifəsi)

**Mövcud vəziyyət:** Plain summary + WhatsApp button.

**Hədəf:** "Hazırsınız!" hissi — forma bitdikdən sonra ödül kimi hiss etsin.

**Fayllar:** `src/components/landing/Preview.jsx`

**Nə edilir:**
- [ ] Confetti burst (Framer Motion particles) forma tamamlananda
- [ ] Summary: glass card — hər bölmə glass panel
- [ ] "Dəvətnaməni Gör" düyməsi: premium shimmer + glow
- [ ] WhatsApp düyməsi: glass green (brand-uyğun)
- [ ] Paket badge (SADƏ/VİP/PREMIUM): glass pill + color-coded

---

## PHASE 5 — Admin / GalleryManager

**Mövcud vəziyyət:** Funksional amma çılpaq UI.

**Hədəf:** Admin də premium hiss etsin — workflow rahat olsun.

**Fayllar:** `src/components/invitation/GalleryManager.jsx`

**Nə edilir:**
- [ ] Toolbar: glass panel
- [ ] Foto grid: glass frame + hover overlay
- [ ] Seçilmiş foto: gold border glow
- [ ] Delete/action bar: glass dark panel + slide-up animation
- [ ] Upload button: shimmer + drag-drop glow zone

---

## Phase Ardıcıllığı

```
Phase 0 (Təməl)  →  Phase 1 (Landing)  →  Phase 2 (Dəvətnamə)
     ↓                    ↓                       ↓
  1 gün               2-3 gün                  2-3 gün

Phase 3 (Builder)  →  Phase 4 (Preview)  →  Phase 5 (Admin)
      ↓                     ↓                     ↓
   1-2 gün               0.5 gün               0.5 gün
```

**Ümumi:** ~8–10 iş sessiyası

---

## Qeydlər

- Phase 0 olmadan heç bir Phase başlamır — təməl olmadan glass düzgün işləməz
- Hər Phase-in sonunda: git commit + GitHub push + cPanel deploy (istəyə görə)
- Phase 1B (Hero) ən çox vaxt aparacaq — ən mürəkkəb 3D işi orada
- Phase 2 (Dəvətnamə) Phase 1-dən daha vacibdir iş modelinə görə —
  qonaqlar landing görmür, dəvətnaməni görürlər
- Hər Phase üçün Claude Design prompt ayrıca hazırlanacaq (canlı
  screenshot ilə) — ümumi prompt işləməz, hər bölmənin spesifik konteksti lazımdır
