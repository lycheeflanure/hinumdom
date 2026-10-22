// src/lib/i18n/translations.ts
// Centralized translation strings for Bisaya and English.
// Have a fluent Bisaya speaker review all Bisaya strings before public release.

export type Language = 'en' | 'ceb'

export type TranslationKey = keyof typeof translations.en

export const translations = {
  en: {
    // ─── Site Meta ──────────────────────────────────────────
    siteTitle: 'HINUMDOM',
    siteDescription:
      'HINUMDOM helps you find the final resting place of your loved ones. A Catholic cemetery locator and digital memorial system.',
    taglinePrimary: 'Never Forgotten, Even Though No Longer by Our Side.',
    taglineSecondary: 'In Our Remembrance, Love Remains.',
    verseMatthewQuote: 'Blessed are those who mourn, for they shall be comforted.',
    verseMatthewRef: 'Matthew 5:4',

    // ─── Navigation ─────────────────────────────────────────
    navHome: 'Home',
    navFind: 'Find a Loved One',
    navMap: 'Cemetery Map',
    navAbout: 'About',
    navContact: 'Contact',
    navAdmin: 'Admin',
    navLanguage: 'Language',
    navOpenMenu: 'Open menu',
    navCloseMenu: 'Close menu',

    // ─── Hero ────────────────────────────────────────────────
    heroHeading: 'Find Their Resting Place. Keep Their Memory Alive.',
    heroSubtitle:
      'HINUMDOM helps you find the final resting place of your loved ones. Search our parish cemetery records with respect and care.',
    heroSearchPlaceholder: 'Enter the name of your loved one…',
    heroSearchButton: 'Search',
    heroMapButton: 'Explore Cemetery Map',
    heroFindButton: 'Find a Loved One',

    // ─── Features ────────────────────────────────────────────
    featuresTitle: 'How Can We Help You?',
    feature1Title: 'Find a Loved One',
    feature1Desc:
      'Search our records by name to locate the resting place of someone dear to you.',
    feature2Title: 'Explore the Cemetery Map',
    feature2Desc:
      'View the interactive cemetery map and find the exact location of a burial site.',
    feature3Title: 'Learn About the Cemetery',
    feature3Desc:
      'Discover visiting guidelines, cemetery history, and contact information.',

    // ─── How It Works ────────────────────────────────────────
    howItWorksTitle: 'How It Works',
    step1Title: 'Search for a Name',
    step1Desc: 'Enter the full or partial name of your loved one.',
    step2Title: 'Select the Correct Record',
    step2Desc: 'Review the matching burial records and select the right person.',
    step3Title: 'View Their Location',
    step3Desc:
      'See the recorded burial location and open it on the cemetery map.',

    // ─── Search ──────────────────────────────────────────────
    searchTitle: 'Find a Loved One',
    searchSubtitle:
      'Search our parish cemetery records. Enter a full or partial name.',
    searchLabel: 'Name',
    searchFilterYear: 'Year of Death',
    searchFilterSection: 'Section',
    searchFilterAll: 'All Sections',
    searchResultsFor: 'Results for',
    searchResultCount: (n: number) => `${n} record${n !== 1 ? 's' : ''} found`,
    searchNoResults:
      'No matching burial record was found. Please check the spelling or contact the cemetery office for assistance.',
    searchLoading: 'Searching records…',
    searchError:
      'An error occurred while searching. Please try again.',
    searchClear: 'Clear search',

    // ─── Record Card ─────────────────────────────────────────
    viewDetails: 'View Details',
    viewOnMap: 'Show on Map',
    locationLabel: 'Location',
    sectionLabel: 'Section',
    blockLabel: 'Block',
    rowLabel: 'Row',
    lotLabel: 'Lot',
    graveLabel: 'Grave',
    bornLabel: 'Born',
    diedLabel: 'Died',
    buriedLabel: 'Buried',
    notRecorded: 'Not recorded',
    unmappedNotice:
      'The exact map position of this burial has not yet been recorded. Please contact the cemetery office for assistance.',

    // ─── Detail Page ─────────────────────────────────────────
    detailTitle: 'Burial Record',
    detailBurialInfo: 'Burial Information',
    detailLocationInfo: 'Cemetery Location',
    detailCemeteryInfo: 'Cemetery',
    detailMemorialFacility: 'Memorial Facility',
    detailContractTerm: 'Contract Term',
    detailShowOnMap: 'Show Exact Location on Map',
    detailBackToSearch: 'Back to Search',
    detailBackToResults: 'Back to Results',
    detailDemoNotice:
      '⚠️ This is demonstration data. It does not represent a real person or burial.',

    // ─── Map ─────────────────────────────────────────────────
    mapTitle: 'Cemetery Map',
    mapSubtitle: 'Explore the cemetery layout and burial locations.',
    mapDemoNotice:
      '⚠️ This is a demonstration map for development purposes. It does not represent the actual cemetery layout.',
    mapLocating: 'Locating burial site…',
    mapUnmapped: 'This location has not yet been mapped.',
    mapEntrance: 'Entrance',
    mapChapel: 'Chapel',
    mapSection: 'Section',

    // ─── Admin ───────────────────────────────────────────────
    adminTitle: 'Administrator Dashboard',
    adminSignIn: 'Sign In',
    adminSignOut: 'Sign Out',
    adminEmail: 'Email Address',
    adminPassword: 'Password',
    adminSignInTitle: 'Admin Sign In',
    adminSignInSubtitle: 'Sign in to manage cemetery records.',
    adminTotalRecords: 'Total Records',
    adminVerified: 'Verified',
    adminPending: 'Pending Review',
    adminMapped: 'Mapped Locations',
    adminUnmapped: 'Unmapped Locations',
    adminRecentActions: 'Recent Actions',
    adminManageRecords: 'Manage Records',
    adminNewRecord: 'Add New Record',
    adminEditRecord: 'Edit Record',
    adminDeleteRecord: 'Delete Record',
    adminVerifyRecord: 'Verify Record',
    adminImportCSV: 'Import from CSV',

    // ─── Footer ──────────────────────────────────────────────
    footerCemetery: 'Holy Cross Catholic Cemetery',
    footerParish: 'Holy Cross Parish - Ampayon',
    footerAddress: 'National Highway, Brgy. Ampayon, Butuan City, Agusan del Norte',
    footerContact: '(085) 341-2345 • holycross.cemetery@hinumdom.ph',
    footerVisiting: 'Visiting Hours: Daily 6:00 AM – 6:00 PM',
    footerPrivacy: 'Privacy Notice',
    footerTerms: 'Terms of Use',
    footerAllRightsReserved: 'All rights reserved.',
    footerNotAffiliated:
      'This website is managed by the cemetery office. It is not an official publication of the Roman Catholic Church.',
    footerReportError: 'Report an Error',
    footerDataPrivacy:
      'Information displayed on this site is published in accordance with applicable data privacy regulations.',

    // ─── Common ──────────────────────────────────────────────
    loading: 'Loading…',
    error: 'An error occurred.',
    notFound: 'Not found.',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    verified: 'Verified',
    pending: 'Pending',
    needsReview: 'Needs Review',
    unverified: 'Unverified',
    grave: 'Grave',
    crypt: 'Crypt',
    niche: 'Niche',
    columbarium: 'Columbarium',
    tomb: 'Tomb',
    other: 'Other',
  },

  ceb: {
    // ─── Site Meta ──────────────────────────────────────────
    siteTitle: 'HINUMDOM',
    siteDescription:
      'Tabangan ka sa HINUMDOM sa pagpangita sa kataposang pahulayanan sa imong mga minahal.',
    taglinePrimary: 'Dili Malimtan, Bisan Wala Na sa Atong Kiliran.',
    taglineSecondary: 'Sa Atong Paghinumdom, Magpabilin ang Gugma.',
    verseMatthewQuote: 'Bulahan ang mga nagsubo, kay sila pagalipayon.',
    verseMatthewRef: 'Mateo 5:4',

    // ─── Navigation ─────────────────────────────────────────
    navHome: 'Balay',
    navFind: 'Pangita ang Minahal',
    navMap: 'Mapa sa Sementeryo',
    navAbout: 'Mahitungod',
    navContact: 'Kontak',
    navAdmin: 'Admin',
    navLanguage: 'Pinulongan',
    navOpenMenu: 'Ablihi ang menu',
    navCloseMenu: 'Isira ang menu',

    // ─── Hero ────────────────────────────────────────────────
    heroHeading: 'Pangitaa ang Ilang Pahulayanan. Hinumdumi ang Ilang Gugma.',
    heroSubtitle:
      'Tabangan ka sa HINUMDOM sa pagpangita sa kataposang pahulayanan sa imong mga minahal.',
    heroSearchPlaceholder: 'Isulod ang ngalan sa imong minahal…',
    heroSearchButton: 'Pangita',
    heroMapButton: 'Tan-awa ang Mapa sa Sementeryo',
    heroFindButton: 'Pangita ang Minahal',

    // ─── Features ────────────────────────────────────────────
    featuresTitle: 'Unsaon Namo Pagtabang Kanimo?',
    feature1Title: 'Pangita ang Minahal',
    feature1Desc:
      'Pangita sa among mga rekord pinaagi sa ngalan aron makit-an ang pahulayanan sa imong minahal.',
    feature2Title: 'Tan-awa ang Mapa sa Sementeryo',
    feature2Desc:
      'Lantawa ang interactive nga mapa sa sementeryo ug pangita ang eksaktong lokasyon.',
    feature3Title: 'Hibal-i ang Sementeryo',
    feature3Desc:
      'Hibal-i ang mga oras sa pagbisita, kasaysayan sa sementeryo, ug impormasyon sa kontak.',

    // ─── How It Works ────────────────────────────────────────
    howItWorksTitle: 'Unsaon Kini?',
    step1Title: 'Pangita ang Ngalan',
    step1Desc: 'Isulod ang tibuok o kabahin sa ngalan sa imong minahal.',
    step2Title: 'Pilia ang Hustong Rekord',
    step2Desc: 'Tan-awa ang mga resulta ug pilia ang husto nga rekord.',
    step3Title: 'Tan-awa ang Ilang Lokasyon',
    step3Desc:
      'Tan-awa ang narekord nga lokasyon ug ablihi kini sa mapa sa sementeryo.',

    // ─── Search ──────────────────────────────────────────────
    searchTitle: 'Pangita ang Minahal',
    searchSubtitle: 'Pangita sa among mga rekord. Isulod ang tibuok o kabahin sa ngalan.',
    searchLabel: 'Ngalan',
    searchFilterYear: 'Tuig sa Pagkamatay',
    searchFilterSection: 'Seksyon',
    searchFilterAll: 'Tanan nga Seksyon',
    searchResultsFor: 'Mga resulta para sa',
    searchResultCount: (n: number) => `${n} rekord${n !== 1 ? ' ang nakit-an' : ' ang nakit-an'}`,
    searchNoResults:
      'Walay nakit-ang rekord. Palihog susaya ang spelling o kontak ang opisina sa sementeryo.',
    searchLoading: 'Gipangita ang mga rekord…',
    searchError: 'May sayop nga nahitabo. Palihog sulayi pag-usab.',
    searchClear: 'Limpyohi ang pagpangita',

    // ─── Record Card ─────────────────────────────────────────
    viewDetails: 'Tan-awa ang Detalye',
    viewOnMap: 'Ipakita sa Mapa',
    locationLabel: 'Lokasyon',
    sectionLabel: 'Seksyon',
    blockLabel: 'Bloke',
    rowLabel: 'Laray',
    lotLabel: 'Lot',
    graveLabel: 'Lubnganan',
    bornLabel: 'Natawo',
    diedLabel: 'Namatay',
    buriedLabel: 'Gilubong',
    notRecorded: 'Wala narekord',
    unmappedNotice:
      'Ang eksaktong posisyon niini sa mapa wala pa narekord. Palihog kontak ang opisina sa sementeryo.',

    // ─── Detail Page ─────────────────────────────────────────
    detailTitle: 'Rekord sa Lubong',
    detailBurialInfo: 'Impormasyon sa Lubong',
    detailLocationInfo: 'Lokasyon sa Sementeryo',
    detailCemeteryInfo: 'Sementeryo',
    detailMemorialFacility: 'Pasilidad sa Handumanan',
    detailContractTerm: 'Termino sa Kontrata',
    detailShowOnMap: 'Ipakita ang Eksaktong Lokasyon sa Mapa',
    detailBackToSearch: 'Balik sa Pagpangita',
    detailBackToResults: 'Balik sa mga Resulta',
    detailDemoNotice:
      '⚠️ Kini ay demonstration data. Dili kini nagrepresenta sa tinuod nga tawo o lubong.',

    // ─── Map ─────────────────────────────────────────────────
    mapTitle: 'Mapa sa Sementeryo',
    mapSubtitle: 'Lantawa ang layout sa sementeryo ug ang mga lokasyon sa lubong.',
    mapDemoNotice:
      '⚠️ Kini ay demonstration mapa para sa pag-uswag. Dili kini nagrepresenta sa aktuwal nga layout sa sementeryo.',
    mapLocating: 'Ginagita ang lokasyon sa lubong…',
    mapUnmapped: 'Kini nga lokasyon wala pa na-mapa.',
    mapEntrance: 'Pasukan',
    mapChapel: 'Kapilya',
    mapSection: 'Seksyon',

    // ─── Admin ───────────────────────────────────────────────
    adminTitle: 'Dashboard sa Administrador',
    adminSignIn: 'Mag-sign In',
    adminSignOut: 'Mag-sign Out',
    adminEmail: 'Email Address',
    adminPassword: 'Password',
    adminSignInTitle: 'Pag-sign In sa Admin',
    adminSignInSubtitle: 'Mag-sign in aron ma-manage ang mga rekord sa sementeryo.',
    adminTotalRecords: 'Tanan nga Rekord',
    adminVerified: 'Naverify',
    adminPending: 'Naghulat sa Review',
    adminMapped: 'Mga Na-mapa nga Lokasyon',
    adminUnmapped: 'Mga Wala Pa Na-mapa',
    adminRecentActions: 'Bag-ong mga Aksyon',
    adminManageRecords: 'Manage ang mga Rekord',
    adminNewRecord: 'Magdugang og Rekord',
    adminEditRecord: 'I-edit ang Rekord',
    adminDeleteRecord: 'Buraon ang Rekord',
    adminVerifyRecord: 'I-verify ang Rekord',
    adminImportCSV: 'Mag-import gikan sa CSV',

    // ─── Footer ──────────────────────────────────────────────
    footerCemetery: 'Holy Cross Catholic Cemetery',
    footerParish: 'Holy Cross Parish - Ampayon',
    footerAddress: 'National Highway, Brgy. Ampayon, Butuan City, Agusan del Norte',
    footerContact: '(085) 341-2345 • holycross.cemetery@hinumdom.ph',
    footerVisiting: 'Oras sa Pagbisita: Adlaw-adlaw 6:00 AM – 6:00 PM',
    footerPrivacy: 'Abiso sa Privacy',
    footerTerms: 'Mga Termino sa Paggamit',
    footerAllRightsReserved: 'Tanan nga katungod napreserba.',
    footerNotAffiliated:
      'Kini nga website gi-manage sa opisina sa sementeryo. Dili kini opisyal nga publikasyon sa Simbahang Katoliko.',
    footerReportError: 'Mag-report og Sayop',
    footerDataPrivacy:
      'Ang impormasyon sa kini nga site gimantala alinsunod sa mga balaod sa privacy sa datos.',

    // ─── Common ──────────────────────────────────────────────
    loading: 'Nagload…',
    error: 'May sayop nga nahitabo.',
    notFound: 'Wala nakit-an.',
    back: 'Balik',
    save: 'I-save',
    cancel: 'Kanselahi',
    confirm: 'Kumpirmahin',
    delete: 'Buraon',
    edit: 'I-edit',
    add: 'Magdugang',
    search: 'Pangita',
    filter: 'Filter',
    clear: 'Limpyohi',
    close: 'Isira',
    yes: 'Oo',
    no: 'Dili',
    verified: 'Naverify',
    pending: 'Pending',
    needsReview: 'Kinahanglan Susayaon',
    unverified: 'Wala Naverify',
    grave: 'Lubnganan',
    crypt: 'Kript',
    niche: 'Nicho',
    columbarium: 'Columbarium',
    tomb: 'Lubnganan',
    other: 'Uban pa',
  },
} as const

export type Translations = typeof translations.en

export function t(lang: Language, key: TranslationKey): string | Function {
  const dict = translations[lang] as Translations
  return dict[key] ?? translations.en[key]
}
