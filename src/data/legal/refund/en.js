/* Payment & Refunds — EN (translation; the AZ text prevails). Format: see LegalPage.jsx. */
import { LEGAL_CONTACT as C } from '../ui.js'

export default {
  title: 'Payment and Refund Policy',
  notice: 'This is a translation. In case of any discrepancy, the Azerbaijani version prevails.',
  intro: [
    'DigiToy is a digital service prepared individually for each customer. That is why you pay only after you have seen and approved the result. This page explains when payment is made and when money is refunded.',
  ],
  sections: [
    {
      id: 'odenis',
      title: '1. When payment is made',
      body: [
        { list: [
          'Sending an order is free and creates no obligation.',
          'We prepare the invitation and agree on the final version with you.',
          'Payment is made only after you approve the final version — by bank card or electronic payment.',
          'After payment, the invitation link is delivered to you.',
        ] },
        'You can cancel the order at any time before payment — in that case no payment is required.',
      ],
    },
    {
      id: 'qiymet',
      title: '2. Prices',
      body: [
        'Prices of packages and extra services are shown in Azerbaijani manat (AZN) in the “Packages” section of the site. The price of an agreed order does not change later.',
      ],
    },
    {
      id: 'qaytarilmir',
      title: '3. When money is not refunded',
      body: [
        'Because payment is made after the final version is approved, money is not refunded once the link has been delivered, including when:',
        { list: [
          'you change your mind or do not use the invitation;',
          'the event is cancelled or postponed;',
          'there are mistakes in the details provided by the customer — we are, however, happy to correct them;',
          'a problem is caused by factors beyond our control (a guest’s internet connection or device, WhatsApp, etc.).',
        ] },
      ],
    },
    {
      id: 'tam',
      title: '4. When money is refunded in full',
      body: [
        'If, after the link is delivered, a technical fault on our side occurs (for example, the invitation does not open or a core feature included in the package does not work) and we cannot fix it within a reasonable time, taking the event date into account, the amount paid is refunded in full.',
      ],
    },
    {
      id: 'muraciet',
      title: '5. How to make a request',
      body: [
        { list: [
          `Write to ${C.email} or via WhatsApp to ${C.phone}.`,
          'Include the order code (DT-…) or the invitation link and a short description of the problem.',
          'We review the request and let you know the outcome. Refunds are made using the original payment method; how long it takes for the money to arrive depends on your bank.',
        ] },
      ],
    },
    {
      id: 'elaqe',
      title: '6. Contact',
      body: [
        `${C.brand} — email: ${C.email}, WhatsApp: ${C.phone}.`,
      ],
    },
  ],
}
