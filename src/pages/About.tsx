import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'

export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Our Approach | NEKO DELICE"
        description="Honest food, quiet design. Learn about our vet-informed approach to feline nutrition, transparent sourcing, and quality standards."
        path="/about"
      />

      <Section>
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
            Our Philosophy
          </p>

          <Heading level={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-6">
            Honest food, quiet design
          </Heading>

          <p className="text-lg text-espresso-800 leading-relaxed mb-12">
            Most cat food packaging is loud, filled with stock photos and marketing claims that obscure basic feeding facts. NEKO DELICE was created to be the antidote: vet-informed nutrition, quiet design, and absolute transparency in every bowl.
          </p>

          <div className="space-y-12">
            {/* Our Approach */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso-900 mb-3">
                Our approach
              </h2>
              <p className="text-base text-espresso-700 leading-relaxed">
                Cats are obligate carnivores. We formulate every recipe around clean, named animal proteins with optimal moisture levels and controlled ash. We skip all fillers, thickeners, and artificial colorants, keeping ingredient lists short and understandable.
              </p>
            </div>

            {/* Sourcing */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso-900 mb-3">
                Transparent sourcing
              </h2>
              <p className="text-base text-espresso-700 leading-relaxed">
                From cold-filtered Norwegian salmon oil to slow-baked free-range duck, our ingredients are sourced with care. We disclose exact percentages on principal protein components and test every batch for microbiological purity.
              </p>
            </div>

            {/* Quality Commitments */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso-900 mb-3">
                Quality commitments
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-base text-espresso-700">
                <li>Never any wheat, corn, soy, or byproduct meals.</li>
                <li>Single-source proteins for clear allergy elimination.</li>
                <li>Accurate caloric densities for exact portion calculation.</li>
                <li>Sustainable materials: paper-based pouches, brushed steel, and solid ash wood.</li>
              </ul>
            </div>

            {/* Behind the build note */}
            <div className="p-6 rounded-2xl bg-oat-100 border border-oat-200">
              <h3 className="font-serif text-lg font-semibold text-espresso-900 mb-2">
                Behind the build
              </h3>
              <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed mb-3">
                A detailed breakdown of our clinical calorie formulas, design decisions, and web performance metrics will be added here in Phase 14/15.
              </p>
              <p className="text-xs text-espresso-600 italic">
                Concept imagery generated with AI. Products are fictional.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default AboutPage
