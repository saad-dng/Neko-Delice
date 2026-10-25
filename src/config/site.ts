export const SITE_CONFIG = {
  name: 'NEKO DELICE',
  tagline: 'Honest food, quiet design, no guesswork.',
  footerLine: 'Honest food, quiet design.',
  previewDisclaimer: 'This is a storefront preview. Checkout is not connected yet.',
  brandPromise: 'Formulated with human-grade proteins and quiet, purposeful design.',
  plannerDisclaimer:
    'An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.',
  extremeWeightNote: 'Very small or large cats should get feeding advice from a vet.',
  kittenNeuterHelper: "Neuter status doesn't change a kitten's needs, so we skip it.",

  currency: {
    USD_TO_BDT: 123,
    BDT_ROUND_TO: 10,
    RATE_LABEL: 'BDT prices are approximate',
    RATE_AS_OF: 'Oct 2026',
    defaultCurrency: 'USD' as const,
  },

  defaultMeta: {
    title: 'NEKO DELICE — Honest Food, Quiet Design, No Guesswork',
    description:
      'Tell us about your cat. We work out the calories and build a month of meals with vet-informed cat nutrition.',
    url: 'https://example.com',
  },
} as const
