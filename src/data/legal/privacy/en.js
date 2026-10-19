/* Privacy Policy — EN (translation; the AZ text prevails). Format: see LegalPage.jsx. */
import { LEGAL_CONTACT as C } from '../ui.js'
import { RETENTION as R } from '../retention.js'

export default {
  title: 'Privacy Policy',
  notice: 'This is a translation. In case of any discrepancy, the Azerbaijani version prevails.',
  intro: [
    `This document explains which personal data ${C.brand} (“DigiToy”, “we”) collects when you use our digital invitation service, why we use it, who we share it with and how long we keep it. The policy is based on the Law of the Republic of Azerbaijan “On Personal Data”.`,
    'By using the site or placing an order you confirm that you have read this policy.',
  ],
  sections: [
    {
      id: 'operator',
      title: '1. Who is responsible for your data',
      body: [
        `The ${C.brand} service is responsible for processing your personal data. You can contact us at any time:`,
        { list: [`Email: ${C.email}`, `WhatsApp: ${C.phone}`] },
      ],
    },
    {
      id: 'toplanan',
      title: '2. What data we collect',
      body: [
        'From the customer (the person ordering the invitation):',
        { list: [
          'the details you enter in the builder: names of the groom, bride, birthday person or organizer, the date, time, venue, programme and dress code of the event;',
          'texts and photos of the “Our Story” section and the music you upload;',
          'guest names and table numbers you add to the seating plan;',
          'the contact number you may enter in the builder (optional) — so we can reach you if the order is left unfinished or a question comes up (it is not shown on the invitation);',
          'your phone number and our conversation when you send the order via WhatsApp.',
        ] },
        'From guests (people who open the invitation) — only what they choose to send:',
        { list: [
          'the name and answer given in the RSVP, number of extra guests and a note;',
          'the name and message written in the guestbook;',
          'photos and videos uploaded on the photo sharing page;',
          'a random identifier stored in the browser for emoji reactions (not linked to a name).',
        ] },
        'At the customer’s request we may add a guest list (names, phone numbers, notes) to the system. A customer who provides such a list confirms that they are entitled to share this data with us.',
        'Technical data:',
        { list: [
          'IP address and browser details — to prevent abuse (rate limits) and for security;',
          'a short, daily-changing trace (hash) derived from the IP address for gallery statistics — the IP itself is not stored;',
          'only if you consent — visit statistics (see section 8).',
        ] },
      ],
    },
    {
      id: 'meqsed',
      title: '3. Why we use your data',
      body: [
        { list: [
          'to prepare, display and update the invitation;',
          'to accept the order, contact you and agree on the final version;',
          'if you left a number in the builder but did not finish the order — to contact you and offer help;',
          'to run the RSVP, seating plan, guestbook and photo gallery features;',
          'to keep the site secure and prevent abuse;',
          'with your consent — to understand how the site is used and improve it;',
          'to meet our legal obligations.',
        ] },
        'We do not sell your data or share it with others for advertising.',
      ],
    },
    {
      id: 'esas',
      title: '4. Legal grounds',
      body: [
        { list: [
          'Performance of the order — the customer’s data is needed to provide the service.',
          'Consent — analytics cookies work only after you choose “Accept”; guest data is sent voluntarily by the guest.',
          'Legitimate interest — security, rate limits and technical logs.',
          'Legal requirement — lawful requests from public authorities.',
        ] },
      ],
    },
    {
      id: 'gorunurluk',
      title: '5. Who sees what on an invitation',
      body: [
        'Anyone who has the invitation link can see its content. To serve the guests, a person who opens the link can also see:',
        { list: [
          'the names and table numbers on the guest list (to find their table) — phone numbers and notes are not shown;',
          'the guestbook messages and the names of their authors;',
          'the photos and videos in the photo sharing gallery (Premium package).',
        ] },
        'Invitation pages are not shown in search engines (noindex), but the link itself can be shared and its address may contain names. We recommend sharing the link only with the people you invite.',
        'The person who ordered the invitation gets a separate private «Customer panel» link. It shows the RSVP answers, the guest report (without guests’ phone numbers), the guestbook and gallery management. Do not share this link — on request we revoke it immediately and issue a new one.',
        'When an invitation is deactivated, its main content is no longer shown. To have all data deleted completely, including the guest list, messages and photos, please contact us (section 9).',
      ],
    },
    {
      id: 'paylasma',
      title: '6. Third parties that receive data',
      body: [
        { list: [
          'Hosting provider — the site and database are stored on its servers.',
          'Google Analytics (Google LLC, USA) — only with your consent: pages visited, device and browser details, approximate location.',
          'PostHog (PostHog Inc., US servers) — only with your consent: page views and key steps (for example, starting the builder, the order button). Text you type into forms is not sent.',
          'Google Fonts (Google) — your IP address is visible to Google when fonts load. This is needed for the site to display correctly and does not depend on consent.',
          'Google Maps (Google) — the query you type when searching for a venue in the builder.',
          'WhatsApp (Meta) — the order message is sent from your own WhatsApp account; the details in it (package, names, date, venue) reach us via WhatsApp. WhatsApp’s own privacy rules apply.',
          'OpenStreetMap — to draw the venue map our server sends only the coordinates; your IP address is not shared.',
          'Public authorities — only where required by law.',
        ] },
        'Google and PostHog servers are located outside Azerbaijan (in the USA). By consenting to analytics you also consent to this transfer. You can withdraw your consent at any time.',
      ],
    },
    {
      id: 'saxlama',
      title: '7. How long we keep data',
      body: [
        { list: [
          'The invitation and its data (guest list, answers, messages, photos) are kept as a keepsake after the event and are deleted completely at the customer’s request.',
          'Order records are kept as the service history and can be deleted on request (except where the law requires us to keep them).',
          `Unsent (unfinished) builder drafts are deleted automatically ${R.draftDays} days after the last change, together with their story photos, music and contact number.`,
          `IP addresses in the admin log are deleted after ${R.auditIpDays} days.`,
          `IP traces (hashes) in the gallery statistics are deleted after ${R.galleryIpDays} days.`,
          `Temporary files for rate limits and link previews are deleted within ${R.tempHours} hours.`,
          `Technical upload logs are kept for ${R.mediaLogDays} days.`,
          'Analytics data is kept according to the retention settings of Google Analytics and PostHog.',
        ] },
      ],
    },
    {
      id: 'kuki',
      title: '8. Cookies and browser storage',
      body: [
        'The site uses cookies and similar storage (localStorage, sessionStorage) in your browser.',
        'Necessary — no consent required, the site cannot work without them:',
        { list: [
          'digitoy_consent — your cookie choice (12 months);',
          'digitoy_session_id, digitoy_builder_state, digitoy_story_sid, digitoy_customer_phone — so you don’t lose an unfinished invitation or the contact number you entered;',
          'selected_package — the package you selected;',
          'digitoyVisitorId — a random identifier so emoji reactions are not repeated;',
          'digitoyGalleryKey:*, digitoyUpload:* — the couple’s gallery management key and resuming an interrupted upload;',
          'digitoyOwnerKey:* — the «Customer panel» key (only on the device where you opened the panel);',
          'adminToken — administrators only.',
        ] },
        'Analytics — only if you choose “Accept”:',
        { list: [
          '_ga, _ga_* — Google Analytics (up to 2 years);',
          'ph_*_posthog — PostHog (cookie and localStorage, up to 1 year).',
        ] },
        'You can change your choice at any time with “Cookie settings” at the bottom of the page. If you decline, analytics stops and its cookies are removed.',
      ],
    },
    {
      id: 'huquqlar',
      title: '9. Your rights',
      body: [
        'You have the right to:',
        { list: [
          'find out what data we hold about you;',
          'ask us to correct inaccurate data;',
          'ask us to delete your data;',
          'withdraw your consent to analytics (“Cookie settings”);',
          'object to processing and complain to the competent public authority.',
        ] },
        `To make a request, write to ${C.email} or via WhatsApp to ${C.phone}. Mentioning the order code (DT-…) or the invitation link helps us handle it faster. We reply as soon as possible and no later than the period set by law.`,
        'Guests can ask the event organizer or us directly to delete their message or an uploaded photo.',
      ],
    },
    {
      id: 'usaqlar',
      title: '10. Children',
      body: [
        'The service is intended for adults. On a child’s birthday invitation, the child’s name and photo should be added only by a parent or legal guardian. We ask guests to respect parents’ wishes when sharing photos of other people’s children.',
      ],
    },
    {
      id: 'tehlukesizlik',
      title: '11. Security',
      body: [
        { list: [
          'all communication with the site is encrypted (HTTPS);',
          'the admin panel is password-protected and every destructive action is logged;',
          'forms are protected by rate limits against abuse;',
          'uploaded photos are re-processed and all metadata, including location (GPS), is removed. Videos are stored as they are — if you do not want to share location data, we recommend turning it off on your phone before uploading.',
        ] },
        'No system on the internet is completely secure, but we take reasonable technical and organisational measures to protect your data.',
      ],
    },
    {
      id: 'deyisiklik',
      title: '12. Changes',
      body: [
        'This policy may be updated. The new version is published on this page with its “Last updated” date.',
      ],
    },
    {
      id: 'elaqe',
      title: '13. Contact',
      body: [
        `For privacy questions and requests: ${C.email}, WhatsApp ${C.phone}.`,
      ],
    },
  ],
}
