/**
 * Country name → ISO 3166-1 alpha-2 code mapping.
 * Used to derive countryCode from provider's address fields.
 */
export const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    // Asia-Pacific
    'philippines': 'PH',
    'south korea': 'KR',
    'korea': 'KR',
    'japan': 'JP',
    'china': 'CN',
    'taiwan': 'TW',
    'hong kong': 'HK',
    'macau': 'MO',
    'thailand': 'TH',
    'vietnam': 'VN',
    'indonesia': 'ID',
    'malaysia': 'MY',
    'singapore': 'SG',
    'cambodia': 'KH',
    'myanmar': 'MM',
    'laos': 'LA',
    'brunei': 'BN',
    'india': 'IN',
    'sri lanka': 'LK',
    'nepal': 'NP',
    'bangladesh': 'BD',
    'pakistan': 'PK',
    'maldives': 'MV',
    'australia': 'AU',
    'new zealand': 'NZ',
    'fiji': 'FJ',

    // Middle East
    'united arab emirates': 'AE',
    'uae': 'AE',
    'saudi arabia': 'SA',
    'qatar': 'QA',
    'bahrain': 'BH',
    'oman': 'OM',
    'kuwait': 'KW',
    'jordan': 'JO',
    'israel': 'IL',
    'turkey': 'TR',
    'türkiye': 'TR',
    'lebanon': 'LB',
    'egypt': 'EG',

    // Europe
    'united kingdom': 'GB',
    'uk': 'GB',
    'england': 'GB',
    'scotland': 'GB',
    'wales': 'GB',
    'france': 'FR',
    'germany': 'DE',
    'italy': 'IT',
    'spain': 'ES',
    'portugal': 'PT',
    'netherlands': 'NL',
    'belgium': 'BE',
    'switzerland': 'CH',
    'austria': 'AT',
    'czech republic': 'CZ',
    'czechia': 'CZ',
    'poland': 'PL',
    'hungary': 'HU',
    'greece': 'GR',
    'croatia': 'HR',
    'sweden': 'SE',
    'norway': 'NO',
    'denmark': 'DK',
    'finland': 'FI',
    'ireland': 'IE',
    'iceland': 'IS',
    'romania': 'RO',
    'bulgaria': 'BG',
    'serbia': 'SR',
    'montenegro': 'ME',
    'slovenia': 'SI',
    'slovakia': 'SK',
    'luxembourg': 'LU',
    'malta': 'MT',
    'cyprus': 'CY',
    'estonia': 'EE',
    'latvia': 'LV',
    'lithuania': 'LT',
    'russia': 'RU',
    'ukraine': 'UA',
    'georgia': 'GE',

    // Americas
    'united states': 'US',
    'usa': 'US',
    'canada': 'CA',
    'mexico': 'MX',
    'brazil': 'BR',
    'argentina': 'AR',
    'chile': 'CL',
    'colombia': 'CO',
    'peru': 'PE',
    'costa rica': 'CR',
    'panama': 'PA',
    'cuba': 'CU',
    'dominican republic': 'DO',
    'jamaica': 'JM',
    'puerto rico': 'PR',
    'bahamas': 'BS',
    'trinidad and tobago': 'TT',
    'ecuador': 'EC',
    'uruguay': 'UY',
    'venezuela': 'VE',
    'bolivia': 'BO',
    'paraguay': 'PY',
    'guatemala': 'GT',
    'honduras': 'HN',
    'el salvador': 'SV',
    'nicaragua': 'NI',
    'belize': 'BZ',

    // Africa
    'south africa': 'ZA',
    'morocco': 'MA',
    'tunisia': 'TN',
    'kenya': 'KE',
    'tanzania': 'TZ',
    'nigeria': 'NG',
    'ghana': 'GH',
    'ethiopia': 'ET',
    'mozambique': 'MZ',
    'mauritius': 'MU',
    'seychelles': 'SC',
    'madagascar': 'MG',
    'senegal': 'SN',
    'rwanda': 'RW',
    'uganda': 'UG',
    'namibia': 'NA',
    'botswana': 'BW',
    'zimbabwe': 'ZW',
    'algeria': 'DZ',
};

/**
 * Extract country code from a formattedAddress string.
 */
export function extractCountryCode(formattedAddress: string, displayName?: string): string {
    if (formattedAddress) {
        const parts = formattedAddress.split(',').map(s => s.trim());
        const countryName = parts[parts.length - 1].toLowerCase();
        const code = COUNTRY_NAME_TO_CODE[countryName];
        if (code) return code;
    }

    if (displayName) {
        const code = COUNTRY_NAME_TO_CODE[displayName.toLowerCase()];
        if (code) return code;
    }

    return '';
}

/**
 * ISO country code → currency code mapping.
 */
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
    'PH': 'PHP',
    'KR': 'KRW',
    'JP': 'JPY',
    'US': 'USD',
    'GB': 'GBP',
    'AU': 'AUD',
    'CA': 'CAD',
    'SG': 'SGD',
    'MY': 'MYR',
    'TH': 'THB',
    'VN': 'VND',
    'ID': 'IDR',
    'IN': 'INR',
    'CN': 'CNY',
    'TW': 'TWD',
    'HK': 'HKD',
    'AE': 'AED',
    'SA': 'SAR',
    'QA': 'QAR',
    'EU': 'EUR', 
    'FR': 'EUR',
    'DE': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'PT': 'EUR',
    'NL': 'EUR',
    'BE': 'EUR',
    'AT': 'EUR',
    'IE': 'EUR',
    'FI': 'EUR',
    'GR': 'EUR',
    'SK': 'EUR',
    'SI': 'EUR',
    'LU': 'EUR',
    'MT': 'EUR',
    'CY': 'EUR',
    'EE': 'EUR',
    'LV': 'EUR',
    'LT': 'EUR',
    'HR': 'EUR',
    'CH': 'CHF',
    'SE': 'SEK',
    'NO': 'NOK',
    'DK': 'DKK',
    'CZ': 'CZK',
    'PL': 'PLN',
    'HU': 'HUF',
    'RO': 'RON',
    'BG': 'BGN',
    'IS': 'ISK',
    'MX': 'MXN',
    'BR': 'BRL',
    'AR': 'ARS',
    'CL': 'CLP',
    'CO': 'COP',
    'PE': 'PEN',
    'ZA': 'ZAR',
    'EG': 'EGP',
    'MA': 'MAD',
    'KE': 'KES',
    'NG': 'NGN',
    'NZ': 'NZD',
    'TR': 'TRY',
    'RU': 'RUB',
    'IL': 'ILS',
};

/**
 * Get currency code for a given user country code.
 */
export function getCurrencyForCountry(countryCode: string): string {
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
}
