import { resolveWeddingContent, translatePhrase } from '../src/data/contentI18n.js'

let pass = 0, fail = 0
const eq = (name, a, b) => {
  if (JSON.stringify(a) === JSON.stringify(b)) { pass++; console.log('  ok  ', name) }
  else { fail++; console.log('  FAIL', name, '\n     got:', JSON.stringify(a), '\n     exp:', JSON.stringify(b)) }
}

const base = {
  brideName: 'Aytəkin', groomName: 'Fərid',
  venueName: 'Gülüstan Şadlıq Sarayı',
  venueNote: 'Zal 2, 3-cü mərtəbə',
  dressCodeDescription: 'Xahiş edirik ağ rəngdən çəkinin',
  programSteps: [
    { time: '18:00', activity: 'Qonaqların Qarşılanması' },
    { time: '19:00', activity: 'Nikah Mərasimi' },
    { time: '21:00', activity: 'Xüsusi sürpriz nömrə' },
  ],
  seatingPlan: 'Masa 1: Əli, Leyla',
}

// 1. az → identity
eq('az identity', resolveWeddingContent(base, 'az') === base, true)
eq('unknown lang identity', resolveWeddingContent(base, 'de') === base, true)

// 2. en dictionary
const en = resolveWeddingContent(base, 'en')
eq('en venueName', en.venueName, 'Gülüstan Wedding Hall')
eq('en venueNote', en.venueNote, 'Hall 2, 3rd floor')
eq('en program 0', en.programSteps[0].activity, 'Guest Reception')
eq('en program 1', en.programSteps[1].activity, 'Wedding Ceremony')
eq('en program 2 unchanged', en.programSteps[2].activity, 'Xüsusi sürpriz nömrə')
eq('en time untouched', en.programSteps[0].time, '18:00')
eq('en names untouched', [en.brideName, en.groomName], ['Aytəkin', 'Fərid'])
eq('en seating untouched', en.seatingPlan, 'Masa 1: Əli, Leyla')

// 3. ru
const ru = resolveWeddingContent(base, 'ru')
eq('ru venueName', ru.venueName, 'Gülüstan Банкетный зал')
eq('ru program 1', ru.programSteps[1].activity, 'Свадебная церемония')

// 4. manual override wins
const withI18n = { ...base, i18n: { en: { venueName: 'Gulustan Palace', brideName: 'Aytakin', programSteps: { 2: 'Special surprise act' } } } }
const en2 = resolveWeddingContent(withI18n, 'en')
eq('manual venueName', en2.venueName, 'Gulustan Palace')
eq('manual brideName', en2.brideName, 'Aytakin')
eq('manual programStep 2', en2.programSteps[2].activity, 'Special surprise act')
eq('dictionary still applies', en2.programSteps[0].activity, 'Guest Reception')

// 5. old invitation with no translatable content → identity
const bare = { brideName: 'A', groomName: 'B', programSteps: [] }
eq('bare identity', resolveWeddingContent(bare, 'en') === bare, true)

// 6. memo identity stability
eq('stable ref', resolveWeddingContent(base,'en') !== resolveWeddingContent(base,'en'), true)

// 7. dressCode custom labels
const dc = { dressCodeLabels: { blacktie: 'Rəsmi geyim' }, dressCodeGenders: { blacktie: { male: 'Klassik kostyum', female: 'Rəsmi geyim' } } }
const dcEn = resolveWeddingContent(dc, 'en')
eq('dc label', dcEn.dressCodeLabels.blacktie, 'Formal Attire')
eq('dc genders', dcEn.dressCodeGenders.blacktie, { male: 'Classic Suit', female: 'Formal Attire' })

// 8. franken-metn qoruyucusu: qismen taninan sərbəst cümlə tərcümə OLUNMUR
eq('unknown phrase null', translatePhrase('Bura tamamilə naməlum cümlədir', 'en'), null)
eq('partial sentence null', translatePhrase('Xahiş edirik ağ rəngdən çəkinin', 'en'), null)
eq('proper noun kept', translatePhrase('Gülüstan Şadlıq Sarayı', 'en'), 'Gülüstan Wedding Hall')
eq('ordinal en', translatePhrase('Şadlıq Sarayı, 1-ci mərtəbə', 'en'), 'Wedding Hall, 1st floor')
eq('ordinal ru', translatePhrase('Zal 2, 3-cü mərtəbə', 'ru'), 'Зал 2, 3-й этаж')
eq('exact phrase still works', translatePhrase('ağ rəngdən çəkinin', 'en'), 'please avoid white')

// 9. dressCodeDescription: taninmayan cümlə ORİJİNAL qalır (yarımçıq deyil)
const dd = resolveWeddingContent({ dressCodeDescription: 'Xahiş edirik ağ rəngdən çəkinin' }, 'en')
eq('dressCodeDescription untouched', dd.dressCodeDescription, 'Xahiş edirik ağ rəngdən çəkinin')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
