// src/lib/translations.ts
// Central translation file for Bisaya / English

export type Language = 'en' | 'ceb'

export const translations = {
  en: {
    // App
    app_name: 'HINUMDOM',
    app_tagline: 'Catholic Cemetery Locator & Memorial System',
    tagline_primary: 'Dili Malimtan, Bisan Wala Na sa Atong Kiliran.',
    tagline_primary_en: 'Never Forgotten, Even Though No Longer by Our Side.',
    tagline_secondary: 'Sa Atong Paghinumdom, Magpabilin ang Gugma.',
    tagline_secondary_en: 'In Our Remembrance, Love Remains.',

    // Navigation
    nav_home: 'Home',
    nav_find: 'Find a Loved One',
    nav_map: 'Cemetery Map',
    nav_about: 'About',
    nav_contact: 'Contact',

    // Hero
    hero_heading: 'Find Their Resting Place. Keep Their Memory Alive.',
    hero_desc_ceb: 'Tabangan ka sa HINUMDOM sa pagpangita sa kataposang pahulayanan sa imong mga minahal.',
    hero_desc_en: 'HINUMDOM helps you find the final resting place of your loved ones.',
    hero_cta_primary: 'Find a Loved One',
    hero_cta_secondary: 'Explore Cemetery Map',
    search_placeholder: 'Enter the name of your loved one...',

    // Search
    search_title: 'Find a Loved One',
    search_subtitle: 'Search by name to find burial records',
    search_button: 'Search',
    search_clear: 'Clear',
    search_results_for: 'Results for',
    search_no_results: 'No matching burial record was found. Please check the spelling or contact the cemetery office for assistance.',
    search_error: 'An error occurred while searching. Please try again.',
    search_filter_year: 'Year of Death',
    search_filter_section: 'Section',
    search_loading: 'Searching records...',

    // Record
    full_name: 'Full Name',
    birth_date: 'Date of Birth',
    death_date: 'Date of Death',
    burial_date: 'Date of Burial',
    cemetery: 'Cemetery',
    section: 'Section',
    block: 'Block',
    row: 'Row',
    lot: 'Lot',
    grave: 'Grave No.',
    tile: 'Tile No.',
    niche: 'Niche No.',
    burial_type: 'Burial Type',
    memorial_facility: 'Memorial Facility',
    contract_term: 'Contract Term',
    view_on_map: 'Show Exact Location on Map',
    back_to_results: '← Back to Search Results',
    back_to_record: '← Back to Burial Details',
    record_verified: 'Verified Record',
    record_pending: 'Awaiting Verification',
    record_needs_review: 'Needs Review',
    location_mapped: 'Location Mapped',
    location_unmapped: 'Location Not Yet Mapped',
    location_unmapped_desc: 'The exact position of this burial has not yet been added to the digital map. The textual location shown above is from the cemetery records.',

    // Features
    feature_find_title: 'Find a Loved One',
    feature_find_desc: 'Search our burial records database by name to locate your loved one\'s resting place.',
    feature_map_title: 'Explore the Cemetery Map',
    feature_map_desc: 'View an interactive map of the cemetery with sections, blocks, and grave locations.',
    feature_about_title: 'Learn About the Cemetery',
    feature_about_desc: 'Find visiting hours, guidelines, contact information, and parish details.',

    // How It Works
    how_title: 'How It Works',
    how_step1_title: 'Search for a Name',
    how_step1_desc: 'Enter the full or partial name of your loved one in the search box.',
    how_step2_title: 'Select the Correct Record',
    how_step2_desc: 'Review matching results and select the correct burial record.',
    how_step3_title: 'View the Location',
    how_step3_desc: 'See the recorded cemetery section, block, row, and lot number.',
    how_step4_title: 'Open the Map',
    how_step4_desc: 'Navigate directly to the grave location on the interactive cemetery map.',

    // Map
    map_title: 'Cemetery Map',
    map_demo_notice: 'This is a demonstration map. The actual cemetery layout will replace this once official survey data is provided.',
    map_select_location: 'Select a location to view details',
    map_section: 'Section',
    map_loading: 'Loading map...',

    // Footer
    footer_cemetery: 'Holy Cross Catholic Cemetery',
    footer_parish: 'Holy Cross Parish - Ampayon',
    footer_address: 'National Highway, Brgy. Ampayon, Butuan City, Agusan del Norte',
    footer_contact: '(085) 341-2345 • holycross.cemetery@hinumdom.ph',
    footer_visiting: 'Visiting Hours: Daily 6:00 AM – 6:00 PM',
    footer_privacy: 'Privacy Notice',
    footer_terms: 'Terms of Use',
    footer_report: 'Report an Incorrect Record',
    footer_copyright: '© {year} HINUMDOM. All rights reserved.',

    // Admin
    admin_dashboard: 'Dashboard',
    admin_records: 'Burial Records',
    admin_locations: 'Locations',
    admin_import: 'Import Records',
    admin_settings: 'Settings',
    admin_audit: 'Audit Log',
    admin_logout: 'Sign Out',
    admin_login_title: 'Administrator Sign In',
    admin_login_email: 'Email Address',
    admin_login_password: 'Password',
    admin_login_button: 'Sign In',

    // Common
    loading: 'Loading...',
    error: 'An error occurred.',
    not_found: 'Not found.',
    unknown: 'Unknown',
    not_recorded: 'Not recorded',
    not_available: 'Not available',
    demo_data_notice: '⚠️ This is demonstration data. Do not treat these as real burial records.',
    contact_office: 'Contact the Cemetery Office',
  },

  ceb: {
    // App
    app_name: 'HINUMDOM',
    app_tagline: 'Lokasyon sa Sementeryo ug Memoryal',
    tagline_primary: 'Dili Malimtan, Bisan Wala Na sa Atong Kiliran.',
    tagline_primary_en: 'Never Forgotten, Even Though No Longer by Our Side.',
    tagline_secondary: 'Sa Atong Paghinumdom, Magpabilin ang Gugma.',
    tagline_secondary_en: 'In Our Remembrance, Love Remains.',

    // Navigation
    nav_home: 'Balay',
    nav_find: 'Pangita ang Minahal',
    nav_map: 'Mapa sa Sementeryo',
    nav_about: 'Mahitungod',
    nav_contact: 'Kontak',

    // Hero
    hero_heading: 'Pangitaa ang Ilang Pahulayanan. Hinumdumi ang Gugma.',
    hero_desc_ceb: 'Tabangan ka sa HINUMDOM sa pagpangita sa kataposang pahulayanan sa imong mga minahal.',
    hero_desc_en: 'HINUMDOM helps you find the final resting place of your loved ones.',
    hero_cta_primary: 'Pangita ang Minahal',
    hero_cta_secondary: 'Tan-awa ang Mapa',
    search_placeholder: 'Isulod ang ngalan sa imong minahal...',

    // Search
    search_title: 'Pangita ang Minahal',
    search_subtitle: 'Pangita pinaagi sa ngalan',
    search_button: 'Pangita',
    search_clear: 'I-clear',
    search_results_for: 'Mga resulta para sa',
    search_no_results: 'Walay nakit-ang rekord. Palihug i-check ang spelling o kontaka ang opisina sa sementeryo.',
    search_error: 'May sayop. Sulayi pag-usab.',
    search_filter_year: 'Tuig sa Kamatayon',
    search_filter_section: 'Seksyon',
    search_loading: 'Gipangita ang mga rekord...',

    // Record
    full_name: 'Buong Ngalan',
    birth_date: 'Petsa sa Pagkatawo',
    death_date: 'Petsa sa Kamatayon',
    burial_date: 'Petsa sa Paglubong',
    cemetery: 'Sementeryo',
    section: 'Seksyon',
    block: 'Bloke',
    row: 'Linya',
    lot: 'Lote',
    grave: 'Lubnganan',
    tile: 'Tile No.',
    niche: 'Nicho No.',
    burial_type: 'Klase sa Paglubong',
    memorial_facility: 'Pasilidad sa Handumanan',
    contract_term: 'Termino sa Kontrata',
    view_on_map: 'Ipakita ang Lokasyon sa Mapa',
    back_to_results: '← Balik sa mga Resulta',
    back_to_record: '← Balik sa Detalye',
    record_verified: 'Na-verify na',
    record_pending: 'Ginaverify pa',
    record_needs_review: 'Kinahanglan i-review',
    location_mapped: 'Nasal-ot na sa Mapa',
    location_unmapped: 'Wala Pa sa Mapa',
    location_unmapped_desc: 'Ang eksaktong lokasyon sa lubnganan wala pa nasal-ot sa digital nga mapa. Ang teksto nga lokasyon gibase sa rekord sa sementeryo.',

    // Features
    feature_find_title: 'Pangita ang Minahal',
    feature_find_desc: 'Pangita sa amo\'ng database pinaagi sa ngalan aron makit-an ang lubnganan sa imong minahal.',
    feature_map_title: 'Tan-awa ang Mapa',
    feature_map_desc: 'Tan-awa ang interactive nga mapa sa sementeryo uban ang mga seksyon ug lubnganan.',
    feature_about_title: 'Mahitungod sa Sementeryo',
    feature_about_desc: 'Pangitaa ang mga oras sa pagbisita, mga patakaran, ug impormasyon sa kontak.',

    // How It Works
    how_title: 'Giunsa Kini',
    how_step1_title: 'Pangita ug Ngalan',
    how_step1_desc: 'Isulod ang ngalan sa imong minahal sa search box.',
    how_step2_title: 'Pilia ang Tamang Rekord',
    how_step2_desc: 'Tan-awa ang mga resulta ug pilia ang tamang rekord.',
    how_step3_title: 'Tan-awa ang Lokasyon',
    how_step3_desc: 'Tan-awa ang rekordado nga seksyon, bloke, linya, ug lote.',
    how_step4_title: 'Ablihi ang Mapa',
    how_step4_desc: 'Diretso moadto sa lokasyon sa lubnganan sa mapa.',

    // Map
    map_title: 'Mapa sa Sementeryo',
    map_demo_notice: 'Demo mapa kini. Mapulihan kini sa tinuod nga layout sa sementeryo.',
    map_select_location: 'Pilia ang lokasyon para sa detalye',
    map_section: 'Seksyon',
    map_loading: 'Gi-load ang mapa...',

    // Footer
    footer_cemetery: 'Holy Cross Catholic Cemetery',
    footer_parish: 'Holy Cross Parish - Ampayon',
    footer_address: 'National Highway, Brgy. Ampayon, Butuan City, Agusan del Norte',
    footer_contact: '(085) 341-2345 • holycross.cemetery@hinumdom.ph',
    footer_visiting: 'Oras sa Pagbisita: Adlaw-adlaw 6:00 AM – 6:00 PM',
    footer_privacy: 'Patakaran sa Privacy',
    footer_terms: 'Mga Kondisyon',
    footer_report: 'I-report ang Sayop nga Rekord',
    footer_copyright: '© {year} HINUMDOM. Tanan nga katungod napreserba.',

    // Admin (same as English for admin)
    admin_dashboard: 'Dashboard',
    admin_records: 'Mga Rekord',
    admin_locations: 'Mga Lokasyon',
    admin_import: 'Mag-import',
    admin_settings: 'Settings',
    admin_audit: 'Audit Log',
    admin_logout: 'Mag-logout',
    admin_login_title: 'Sign In (Admin)',
    admin_login_email: 'Email',
    admin_login_password: 'Password',
    admin_login_button: 'Mag-sign In',

    // Common
    loading: 'Gi-load...',
    error: 'May sayop.',
    not_found: 'Wala nakit-an.',
    unknown: 'Wala nahibaloan',
    not_recorded: 'Wala narehistro',
    not_available: 'Wala magamit',
    demo_data_notice: '⚠️ Demo data kini. Dili kini tinuod nga rekord sa lubnganan.',
    contact_office: 'Kontaka ang Opisina sa Sementeryo',
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function t(lang: Language, key: TranslationKey, vars?: Record<string, string>): string {
  const str = translations[lang][key] ?? translations.en[key] ?? key
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}
