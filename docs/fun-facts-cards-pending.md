# Fun Facts Cards Pending

## Status

The following two cards are temporarily in `pending` status and are hidden from the Fun Facts section:

- **Backpacking card** — `TurkeyVolunteerCard`
- **Fan / dislike card** — the compact `ArticleFooter` reaction card

## Current handling

Their rendering and imports are commented out in `app/components/about/FunFactsSection.tsx`. The component implementations, assets, and translations are intentionally retained for future modification.

The `ArticleFooter` used on article detail pages remains active and is not affected by this temporary suspension.

## Future work

When these cards are ready for revision, update the component and styling first, then restore their rendering in `FunFactsSection.tsx` and remove the pending comment block.
