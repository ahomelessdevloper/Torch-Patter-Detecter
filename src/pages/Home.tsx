import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { PatternTypes } from '../components/PatternTypes'
import { HowItWorks } from '../components/HowItWorks'
import { FAQ } from '../components/FAQ'
import { CTA } from '../components/CTA'

export function Home() {
  return (
    <>
      <Hero />
      <Features />
      <PatternTypes />
      <HowItWorks />
      <FAQ />
      <CTA />
    </>
  )
}