# PLACEHOLDER CONTENT

Everything in this folder is invented for development. None of it is an Adhara Energy
commitment. Model names, prices, specifications, dealer addresses and testimonials must all
be replaced before any public launch.

Replacing them is a change confined to this folder — `src/lib/data/` is the only consumer,
and it will be repointed at platform APIs when those exist. Nothing outside `src/lib/data/`
and `src/lib/legal/` imports from here, and `src/lib/data/boundary.test.ts` fails the build
if that ever stops being true.

Open questions blocking real data:

- National versus per-state pricing (affects the shape of `VehicleModel`)
- State-wise legal vetting of the low-speed classification claim
- Confirmed model line-up, specifications and tenure options
