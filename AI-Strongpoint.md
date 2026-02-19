Strategic AI Integration for TravelBooking-Korean
Based on the current architecture (Next.js, Supabase, Mapbox, LiteAPI), here are the four high-impact roles for AI integration, ranked by value and feasibility.

1. The "Semantic" Search Agent (Highest Impact)
Role: Bridge the gap between vague user intent and strict API filters.

Problem: Users think in experiences ("romantic weekend near Seoul with a spa"), but APIs need strict data (destination_id, amenities, date_range).
AI Solution: A conversational interface that translates natural language into precise LiteAPI query parameters.
Why it works: You don't need a complex vector database. The AI acts as a "translator" layer before the API call.
2. Hyper-Personalized "Insta-Itineraries"
Role: Solve the "now what?" problem after booking.

Problem: Travelers book a hotel but struggle to plan their days.
AI Solution: Generate day-by-day itineraries based on the user's trip duration and style.
Why it works: You already use Mapbox. The AI can plot the itinerary directly on your map, creating a visually stunning, interactive experience that feels premium.
3. "Vibe" Check (Localized Intelligence)
Role: Provide culturally relevant context for Korean users.

Problem: Direct translation of English reviews often misses nuance. A "lively" hotel might translate to "noisy" or "energetic" depending on context.
AI Solution: Aggregate and summarize reviews to capture the "vibe" (e.g., "Great for couples, bad for families") rather than just translating text.
Why it works: It leverages the strength of LLMs in summarization and sentiment analysis, providing unique value over generic booking sites.
4. Smart Price Watch
Role: Post-booking value monitoring.

Problem: Users worry about booking too early and missing a better price.
AI Solution: Monitor "Pending" bookings or saved searches and alert users if the price drops on LiteAPI.
Why it works: You have the bookings table in Supabase. A background job can periodically check prices and notify users, driving engagement and trust.