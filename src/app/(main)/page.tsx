import React from 'react';
import {
  Hero,
  RecentlyViewed,
  DealsSection,
  YourRecentSearches,
  LastMinuteWeekendDeals,
  StaysForEveryStyle,
  ExploreVacationPackages,
  ExploreUniqueStays,
  AppBanner,
  AIFeaturesSection,
  PopularDestinations,
  HowItWorksSection,
  TestimonialsSection,
  NewsletterSection,
} from '@/components/landing';

export default function Home() {
  return (
    <main className="overflow-x-clip">
      {/* Hero — cinematic with aurora background, floating cards, trust strip */}
      <Hero />

      {/* Recent searches — quick access */}
      <YourRecentSearches />

      {/* AI Features — bento grid showcasing intelligence */}
      <AIFeaturesSection />

      {/* Popular Destinations — stunning photo grid */}
      <PopularDestinations />

      {/* Deals & Offers */}
      <DealsSection />

      {/* How It Works — 3-step journey */}
      <HowItWorksSection />

      {/* Curated Collections */}
      <StaysForEveryStyle />

      {/* Continue Your Search */}
      <RecentlyViewed />

      {/* All-Inclusive Bundles */}
      <ExploreVacationPackages />

      {/* Extraordinary Escapes */}
      <ExploreUniqueStays />

      {/* Testimonials — social proof */}
      <TestimonialsSection />

      {/* Flash Getaways */}
      <LastMinuteWeekendDeals />

      {/* Newsletter CTA */}
      <NewsletterSection />

      {/* App Download Banner */}
      <AppBanner />
    </main>
  );
}
