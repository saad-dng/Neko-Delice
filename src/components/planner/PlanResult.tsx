import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '@/data/products'
import type { BundleResult, CatProfile } from '@/data/types'
import { PLANNER_CONFIG } from '@/config/planner'
import { NUTRITION_CONFIG } from '@/config/nutrition'
import { useCurrency } from '@/store/currency'
import { useBag } from '@/store/bag'
import { useBagUi } from '@/store/bag-ui'
import { formatDays, formatPrice, TABULAR_NUMS } from '@/lib/format'
import { splitRatio } from '@/lib/planner'
import { useCountUp } from '@/hooks/useCountUp'
import { ProductImage } from '@/components/ui/ProductImage'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'

export interface PlanResultProps {
  bundle: BundleResult
  profile: CatProfile
  onEditAnswers: () => void
}

export function PlanResult({ bundle, profile, onEditAnswers }: PlanResultProps) {
  const currency = useCurrency((s) => s.currency)
  const addMany = useBag((s) => s.addMany)

  // Fountain add-on checkbox state (starts unchecked)
  const [fountainChecked, setFountainChecked] = useState(false)
  const [addedNotice, setAddedNotice] = useState<string | null>(null)
  const [copiedNotice, setCopiedNotice] = useState(false)

  // Animated count-up for kcal (rounded to whole number)
  const animatedKcal = useCountUp(Math.round(bundle.mer), 800)

  // Cat name or default fallback
  const catName = profile.name.trim()
  const headline = catName
    ? `${catName} needs about ${animatedKcal} kcal a day.`
    : `Your cat needs about ${animatedKcal} kcal a day.`

  // Factor lookups for formula disclosure
  let fLife: number
  if (profile.stage === 'kitten') {
    fLife = PLANNER_CONFIG.lifeFactors.kitten
  } else if (profile.stage === 'adult') {
    fLife = profile.neutered
      ? PLANNER_CONFIG.lifeFactors.adult.neutered
      : PLANNER_CONFIG.lifeFactors.adult.intact
  } else {
    fLife = profile.neutered
      ? PLANNER_CONFIG.lifeFactors.senior.neutered
      : PLANNER_CONFIG.lifeFactors.senior.intact
  }
  const fActivity = PLANNER_CONFIG.activityMultipliers[profile.activity] ?? 0.9
  const split = splitRatio(profile)

  // Process bundle lines including fountain toggle
  const activeLines = bundle.lines.map((line) => {
    if (line.productId === PLANNER_CONFIG.products.waterFountain) {
      return { ...line, checked: fountainChecked }
    }
    return line
  })

  // Calculate total bundle price
  const bundleTotalPriceUSD = activeLines
    .filter((l) => l.checked)
    .reduce((sum, l) => sum + l.price, 0)

  const handleAddToBag = (e: React.MouseEvent<HTMLButtonElement>) => {
    const itemsToAdd = activeLines
      .filter((l) => l.checked)
      .map((l) => ({
        productId: l.productId,
        qty: l.qty,
      }))

    if (itemsToAdd.length > 0) {
      addMany(itemsToAdd)
      const count = itemsToAdd.reduce((sum, i) => sum + i.qty, 0)
      setAddedNotice(`Added ${count} items to your bag.`)
      setTimeout(() => setAddedNotice(null), 3000)
      useBagUi.getState().openBag(e.currentTarget)
    }
  }

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopiedNotice(true)
        setTimeout(() => setCopiedNotice(false), 2500)
      }
    } catch {
      // Ignore clipboard write failures in restricted environments
    }
  }

  const isExtremeWeight =
    profile.weightKg <= PLANNER_CONFIG.weight.min ||
    profile.weightKg >= PLANNER_CONFIG.weight.max

  return (
    <div className="space-y-10">
      {/* Polite Live Region for status notifications */}
      <output
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {addedNotice}
        {copiedNotice ? 'Link copied to clipboard.' : ''}
      </output>

      {/* Main Result Headline */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100/90 border border-sage-200/80 text-sage-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <span>Personalized Nutrition Target</span>
        </div>

        <Heading
          level={1}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4"
        >
          {headline}
        </Heading>

        <p className="text-base sm:text-lg text-espresso-700 leading-relaxed max-w-2xl">
          Based on {catName || 'your cat&apos;s'} weight of {profile.weightKg} kg,{' '}
          {profile.stage} stage, and {profile.activity} activity profile.
        </p>
      </div>

      {/* Extreme Weight Boundary Notice */}
      {isExtremeWeight ? (
        <div className="p-4 rounded-2xl bg-[#F6E8E2] border border-terracotta-300 text-sm text-espresso-800 leading-relaxed">
          <span className="font-semibold text-terracotta-800">
            Veterinary guidance notice:
          </span>{' '}
          Very small (&le;1.5 kg) or large (&ge;10 kg) cats have unique metabolic rates. Please consult your veterinarian for specialized feeding guidance.
        </div>
      ) : null}

      {/* Metrics Row: RER and MER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-oat-100 border border-sand-300/80">
          <div className="text-xs font-semibold uppercase tracking-wider text-espresso-600 mb-1">
            Resting Energy (RER)
          </div>
          <div className={`font-serif text-3xl font-semibold text-espresso-950 mb-1 ${TABULAR_NUMS}`}>
            {bundle.rer} <span className="text-lg font-sans font-normal text-espresso-700">kcal/day</span>
          </div>
          <p className="text-xs text-espresso-600 leading-relaxed">
            Baseline energy expended at complete rest.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-sage-50/80 border border-sage-300/80 shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-sage-800 mb-1">
            Maintenance Target (MER)
          </div>
          <div className={`font-serif text-3xl font-semibold text-espresso-950 mb-1 ${TABULAR_NUMS}`}>
            {bundle.mer} <span className="text-lg font-sans font-normal text-espresso-700">kcal/day</span>
          </div>
          <p className="text-xs text-espresso-700 leading-relaxed">
            Daily intake adjusted for life stage and activity multiplier.
          </p>
        </div>
      </div>

      {/* Daily Feeding Amounts Breakdown */}
      <div className="p-6 rounded-2xl bg-cream-50 border border-sand-300">
        <Heading level={2} className="font-serif text-xl font-semibold text-espresso-950 mb-4">
          Daily portion breakdown
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300/60">
            <span className="text-xs font-medium text-espresso-600 block mb-1">
              Wet food
            </span>
            <span className="font-serif text-2xl font-semibold text-espresso-950">
              {bundle.wetSachetsPerDay}
            </span>
            <span className="text-xs text-espresso-600 block mt-0.5">
              sachets/day (~{bundle.wetKcal} kcal)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300/60">
            <span className="text-xs font-medium text-espresso-600 block mb-1">
              Dry food
            </span>
            <span className="font-serif text-2xl font-semibold text-espresso-950">
              {bundle.dryGramsPerDay}
            </span>
            <span className="text-xs text-espresso-600 block mt-0.5">
              g/day (~{bundle.dryKcal} kcal)
            </span>
          </div>

          {bundle.topperPumpsPerDay > 0 ? (
            <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300/60">
              <span className="text-xs font-medium text-espresso-600 block mb-1">
                Topper (Salmon oil)
              </span>
              <span className="font-serif text-2xl font-semibold text-espresso-950">
                {bundle.topperPumpsPerDay}
              </span>
              <span className="text-xs text-espresso-600 block mt-0.5">
                pump/day (~{bundle.topperKcal} kcal)
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Monthly Bundle Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <Heading level={2} className="font-serif text-2xl font-semibold text-espresso-950">
              Recommended monthly bundle
            </Heading>
            <p className="text-xs sm:text-sm text-espresso-600">
              Covers at least 30 days of balanced daily nutrition.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-espresso-600 block">Bundle subtotal</span>
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950">
              {formatPrice(bundleTotalPriceUSD, currency)}
            </span>
          </div>
        </div>

        {/* Bundle Items List */}
        <div className="space-y-4">
          {activeLines.map((line) => {
            const product = products.find((p) => p.id === line.productId)
            if (!product) return null

            const isFountain = line.productId === PLANNER_CONFIG.products.waterFountain

            if (isFountain) {
              return (
                <div
                  key={line.productId}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    fountainChecked
                      ? 'border-sage-600 bg-sage-50/80 ring-1.5 ring-sage-500/40 shadow-xs'
                      : 'border-sand-300 bg-cream-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <label className="flex items-center gap-3 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={fountainChecked}
                        onChange={(e) => setFountainChecked(e.target.checked)}
                        className="h-5 w-5 text-sage-700 rounded border-sand-300 accent-sage-600 focus:ring-sage-500 cursor-pointer"
                        aria-label="Add Ceramic Water Fountain to bundle"
                      />
                    </label>

                    <Link
                      to={`/product/${product.slug}`}
                      aria-label={`View ${product.name} details`}
                      className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-beige-200 transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
                    >
                      <ProductImage
                        slug={product.slug}
                        imageRole="hero"
                        sizes="80px"
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200/70">
                          Suggested hydration add-on
                        </span>
                      </div>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-serif text-base sm:text-lg font-semibold text-espresso-950 truncate block hover:text-terracotta-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-espresso-600 mt-0.5">
                        Fresh moving water encourages vital hydration for urinary tract wellness.
                      </p>
                      <div className="mt-2 text-xs font-medium text-espresso-700">
                        One-time purchase · {formatPrice(line.price, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={line.productId}
                className="p-4 sm:p-5 rounded-2xl border border-sand-300 bg-cream-50 flex items-center gap-4 transition-colors hover:border-sand-300/90"
              >
                <Link
                  to={`/product/${product.slug}`}
                  aria-label={`View ${product.name} details`}
                  className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-beige-200 transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
                >
                  <ProductImage
                    slug={product.slug}
                    imageRole="hero"
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-serif text-base sm:text-lg font-semibold text-espresso-950 truncate block hover:text-terracotta-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded"
                  >
                    {product.name}
                  </Link>
                  <div className="text-xs text-espresso-600 mt-0.5">
                    Quantity: {line.qty}{' '}
                    {line.qty === 1
                      ? product.unit.type === 'sachet' || product.unit.type === 'pouch'
                        ? 'carton'
                        : product.unit.type === 'bag'
                          ? 'bag'
                          : 'bottle'
                      : product.unit.type === 'sachet' || product.unit.type === 'pouch'
                        ? 'cartons'
                        : product.unit.type === 'bag'
                          ? 'bags'
                          : 'bottles'}
                    {line.supplyDays ? ` · ${formatDays(line.supplyDays, { approximate: true })} supply` : ''}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif text-lg sm:text-xl font-semibold text-espresso-950 block">
                    {formatPrice(line.price, currency)}
                  </span>
                  <span className="text-xs text-espresso-700">
                    {formatPrice(line.unitPrice ?? line.price / line.qty, currency)} / unit
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action CTA Row */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3.5 pt-2">
        <Button
          variant="primary"
          onClick={handleAddToBag}
          className="w-full sm:w-auto min-w-[200px]"
        >
          {addedNotice ? 'Added to bag ✓' : 'Add bundle to bag'}
        </Button>

        <Button
          variant="secondary"
          onClick={onEditAnswers}
          className="w-full sm:w-auto"
        >
          Edit answers
        </Button>

        <Button
          asChild
          to="/shop"
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Explore the collection
        </Button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-espresso-800 hover:text-espresso-950 underline underline-offset-4 cursor-pointer py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-900 transition-colors"
        >
          {copiedNotice ? 'Link copied! ✓' : 'Copy shareable link'}
        </button>
      </div>

      {/* "How we calculate this" Accordion */}
      <div className="border-t border-sand-300 pt-6">
        <details className="group rounded-2xl bg-oat-100/60 border border-sand-300/80 p-5 transition-colors">
          <summary className="font-serif text-lg font-semibold text-espresso-950 cursor-pointer flex items-center justify-between list-none">
            <span>How we calculate this</span>
            <span
              className="text-terracotta-700 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ▾
            </span>
          </summary>

          <div className="mt-4 text-xs sm:text-sm text-espresso-800 space-y-3 leading-relaxed border-t border-sand-300/60 pt-4">
            <p>
              We calculate daily energy intake using peer-reviewed feline clinical formulas:
            </p>
            <div className="p-3 rounded-xl bg-cream-50 font-mono text-xs text-espresso-900 space-y-1">
              <div>RER = 70 × W^0.75</div>
              <div>
                RER = 70 × ({profile.weightKg})^0.75 = <strong>{bundle.rer} kcal/day</strong>
              </div>
              <div className="mt-2">MER = RER × F_life × F_activity</div>
              <div>
                MER = {bundle.rer} × {fLife} ({profile.stage} {profile.stage !== 'kitten' ? (profile.neutered ? 'neutered' : 'intact') : ''}) × {fActivity} ({profile.activity}) = <strong>{bundle.mer} kcal/day</strong>
              </div>
            </div>

            <p>
              <strong>Food split:</strong> {Math.round(split.wet * 100)}% wet ({bundle.wetKcal} kcal) / {Math.round(split.dry * 100)}% dry ({bundle.dryKcal} kcal).
              {bundle.topperKcal > 0 ? ` Salmon oil topper accounts for ${bundle.topperKcal} kcal/day.` : ''}
            </p>

            <p>
              <strong>Portion conversion:</strong> Wet food is calculated at{' '}
              {profile.stage === 'kitten'
                ? NUTRITION_CONFIG.wetFood.kittenMousseKcalPerSachet
                : NUTRITION_CONFIG.wetFood.salmonQuailPateKcalPerSachet}{' '}
              kcal/sachet; dry kibble is calculated at {NUTRITION_CONFIG.dryFood.kibbleKcalPerGram} kcal/g.
            </p>
          </div>
        </details>
      </div>

      {/* Mandatory Veterinary Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-oat-100 border border-sand-300 text-xs sm:text-sm text-espresso-700 leading-relaxed">
        <span className="font-semibold text-espresso-900">Veterinary notice: </span>
        An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
      </div>
    </div>
  )
}

export default PlanResult
