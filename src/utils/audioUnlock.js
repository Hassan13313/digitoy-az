/* ─────────────────────────────────────────────────────────────────
   audioUnlock — Phase 9
   Unlocks the browser audio context on the first user interaction.

   Why this exists:
   Mobile browsers (iOS Safari, Android Chrome, Samsung Internet)
   require a synchronous user gesture before any audio can play.
   YouTube IFrame API's playVideo() called from a timer fires outside
   the gesture window and is silently blocked.

   Strategy:
   1. On first user gesture → unlockAudio()
   2. unlockAudio() plays a 0-volume silent AudioContext tone AND a
      silent <audio> element — covering all browser variants.
   3. Stores __digitoy_audio_unlocked = true on success.
   4. InvitationPage checks isAudioUnlocked() when the video ends
      and decides whether to autoplay or show the prompt.

   Browser behaviour after unlock:
   - Desktop Chrome/Firefox/Safari  → autoplay works, no prompt needed
   - Android Chrome / Samsung       → autoplay usually works after unlock
   - iOS Safari                     → YouTube IFrame STILL blocked
                                       (sandboxed iframe; prompt shown)
──────────────────────────────────────────────────────────────────── */

const FLAG = '__digitoy_audio_unlocked'

let unlocked  = false
let attempted = false

export function unlockAudio() {
  if (unlocked || attempted) return
  attempted = true

  // 1 — Web Audio API: resume the AudioContext (most reliable unlock)
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (Ctx) {
      const ctx = new Ctx()
      const buf = ctx.createBuffer(1, 1, 22050)
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.connect(ctx.destination)
      src.start(0)
      ctx.resume().then(() => {
        unlocked = true
        window[FLAG] = true
        console.debug('[Digitoy Audio] ✅ AudioContext unlocked (Web Audio API)')
      }).catch(err => {
        console.debug('[Digitoy Audio] ⚠️  AudioContext resume failed:', err.message)
      })
    }
  } catch (err) {
    console.debug('[Digitoy Audio] ⚠️  AudioContext error:', err.message)
  }

  // 2 — HTML5 Audio element: audio.play() / pause() / currentTime = 0
  //     (user-requested pattern; covers browsers without AudioContext)
  try {
    // Minimal valid silent WAV (44 bytes)
    const a = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=')
    a.volume = 0
    a.play().then(() => {
      a.pause()
      a.currentTime = 0
      unlocked = true
      window[FLAG] = true
      console.debug('[Digitoy Audio] ✅ Audio context unlocked (HTML5 Audio)')
    }).catch(err => {
      console.debug('[Digitoy Audio] ⚠️  HTML5 Audio unlock failed:', err.message)
    })
  } catch (err) {
    console.debug('[Digitoy Audio] ⚠️  HTML5 Audio error:', err.message)
  }
}

export function isAudioUnlocked() {
  return unlocked || !!window[FLAG]
}
