/* Terms of Service / Public offer — EN (translation; the AZ text prevails). Format: see LegalPage.jsx. */
import { LEGAL_CONTACT as C } from '../ui.js'

export default {
  title: 'Terms of Service and Public Offer',
  notice: 'This is a translation. In case of any discrepancy, the Azerbaijani version prevails.',
  intro: [
    `This document governs the relationship between ${C.brand} (“DigiToy”, “we”) and anyone who uses the service, and is an offer addressed to everyone (public offer). By sending an order you fully accept these terms.`,
  ],
  sections: [
    {
      id: 'anlayislar',
      title: '1. Definitions',
      body: [
        { list: [
          'Service — preparing a digital invitation web page and providing access to its features.',
          'Customer — the person who orders the invitation.',
          'Guest — a person who opens the invitation link and uses its features.',
          'Invitation — the web page prepared for the customer and opened via its own link.',
          'Package — the set of features and price shown on the site (Basic, VIP, Premium).',
        ] },
      ],
    },
    {
      id: 'xidmet',
      title: '2. Description of the service',
      body: [
        'Depending on the package, the invitation may include an opening animation, countdown, venue and navigation, programme, dress code, music, RSVP, seating plan, guestbook and photo sharing via QR code. The features of each package are listed in the “Packages” section of the site.',
      ],
    },
    {
      id: 'sifaris',
      title: '3. How ordering works',
      body: [
        { list: [
          'The customer fills in the builder on the site and sends the order with the “Order via WhatsApp” button.',
          'We check the details and prepare the invitation. This usually takes 24 hours, and up to 48 hours for VIP and Premium packages with custom design elements.',
          'The final version is agreed with the customer, who may ask for corrections at this stage.',
          'Once the final version is approved and paid for, the invitation link is delivered to the customer.',
        ] },
        'Sending an order does not create an obligation to pay: you can cancel the order at any time before payment.',
      ],
    },
    {
      id: 'qiymet',
      title: '4. Price and payment',
      body: [
        'Prices are shown on the site in Azerbaijani manat (AZN). Payment is made after the final version is approved, by bank card or electronic payment. Prices may change, but changes do not affect an order that has already been agreed.',
        'Payment and refund rules are described on the separate “Payment & Refunds” page, which forms an integral part of these terms.',
      ],
    },
    {
      id: 'muddet',
      title: '5. How long the invitation stays online',
      body: [
        'The invitation stays fully active until the day of the event. After the event it is not deleted and remains available as a keepsake. If the service is discontinued or keeping the invitation becomes technically impossible, the customer will be notified in advance.',
      ],
    },
    {
      id: 'mezmun',
      title: '6. Customer obligations',
      body: [
        { list: [
          'is responsible for the accuracy of the details provided (names, date, venue, etc.);',
          'provides other people’s names, photos and the guest list (including phone numbers) with their consent;',
          'has the right to use the photos and music they upload;',
          'shares the invitation link only with the people they invite.',
        ] },
      ],
    },
    {
      id: 'qonaqlar',
      title: '7. Rules for guests',
      body: [
        'When using the RSVP, guestbook and photo sharing features, a guest understands that their messages and uploaded photos are visible to people who have the invitation link. Guests should upload only photos that are their own or that they are allowed to share.',
        'The organizer (customer) and DigiToy may delete messages and photos that break these rules.',
      ],
    },
    {
      id: 'qadagan',
      title: '8. Prohibited content',
      body: [
        'The following is prohibited on the service:',
        { list: [
          'illegal, abusive, hateful or obscene content;',
          'content that violates other people’s privacy, copyright or other rights;',
          'malicious files, spam and attempts to interfere with the site.',
        ] },
      ],
    },
    {
      id: 'deaktiv',
      title: '9. Deactivation and deletion',
      body: [
        'The invitation link may be deactivated if these terms are breached, if payment is not made, or at the customer’s request. The invitation and all its data are deleted completely at the customer’s request. Details: “Privacy Policy”.',
      ],
    },
    {
      id: 'mesuliyyet',
      title: '10. Limitation of liability',
      body: [
        'We make reasonable efforts to keep the service running without interruption, but short outages may happen due to maintenance or reasons beyond our control (internet, hosting, third-party services such as WhatsApp or Google Maps). To the extent permitted by law, our liability is limited to the amount paid for the order concerned.',
        'Responsibility for content provided by the customer or guests lies with the person who provided it.',
      ],
    },
    {
      id: 'eqli',
      title: '11. Intellectual property',
      body: [
        'Templates, design, animations and software belong to DigiToy and may not be used outside the invitation. The customer’s texts and photos remain theirs; the customer allows us to display them in the invitation. We do not use a customer’s invitation in advertising without their consent.',
      ],
    },
    {
      id: 'qanun',
      title: '12. Governing law and disputes',
      body: [
        'These terms are governed by the law of the Republic of Azerbaijan. Disputes are resolved by negotiation first and, failing agreement, in court in accordance with the law.',
        'These terms may be updated; a new version takes effect on the date it is published on this page and does not apply to orders already agreed.',
      ],
    },
    {
      id: 'elaqe',
      title: '13. Contact',
      body: [
        `${C.brand} — email: ${C.email}, WhatsApp: ${C.phone}.`,
      ],
    },
  ],
}
