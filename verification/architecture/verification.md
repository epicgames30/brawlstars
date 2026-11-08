Conversion verification
=======================

The final entry point is `/index.html`, also served at `/en/` by the optional static preview server.

- Compared the working page before conversion with the final vanilla version at 320, 390, 575, 576, 1024, and 1440 pixels wide. All recorded element positions, dimensions, display values, margins, and padding matched exactly. See before-layout.json and after-layout.json.
- Compared full-page screenshots at 390 and 1440 pixels. No pixels differed by more than 10 RGB levels; the 390-pixel JPEG files were byte-identical. See visual-comparison.json and before/after images.
- Switched through all 21 languages using the actual language selector. No broken images, horizontal overflow, or console errors. See language-checks.json.
- Tested voucher, friend, team, club, Supercell ID, creator, invite, and deck query parameters. Labels and deep-link URLs matched the original behavior. Query parameters survived language switching. See action-checks.json.
- Tested desktop, Android, and iOS user agents in isolated browser frames. Desktop displayed both stores and the QR; Android/iOS displayed the appropriate store and hid the QR. See platform-checks.json.
- Clicked Open Brawl Stars in an isolated frame with custom protocol navigation prevented. The original delayed download guidance appeared correctly.
- Confirmed language switching also works from static `/locales/fr/index.html` back to the final `/index.html`.
- `npm run check` passed: local assets exist, JavaScript parses, translations/configuration are valid JSON, and no obsolete framework references remain in the page sources.

The QR encoder, decoder, and device parser are the existing plain JavaScript implementations, extracted into standalone code without a bundler/module runtime. Their original license notices are in `js/licenses/`. Original image and font bytes were moved without alteration.
