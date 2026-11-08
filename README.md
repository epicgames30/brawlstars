# Brawl Stars landing page

Run `npm start` (or `node server.cjs`) and open http://127.0.0.1:5173/en/.
No dependency installation or build step is required. The preview binds only to this computer.

`index.html` is the final, working English landing page. `css/style.css` contains the original styles in their original cascade order. `js/script.js` implements the page behavior using native DOM APIs. `js/qr.js` contains the original standalone QR encoder, QR decoder, and device detector; it has no framework or module runtime. Images and fonts are original, unmodified files under `images/` and `fonts/`.

There are no React, Next.js, Webpack, package, or CDN requirements in the page. The optional Node server is only a static preview server. Any static HTTP server can serve `index.html` and the assets at the site root. The preview server additionally maps `/en/` to `index.html` and `/fr/`, etc. to the corresponding static page in `locales/`. Language switching preserves query parameters. Translations and voucher configuration are ordinary JSON files in `locales/`.

Device-specific store badges, branded QR generation, query-string deep links, voucher links, button feedback, language switching, footer links, and responsive styles retain the original behavior. Run `npm run check` to audit local assets and JavaScript syntax. Before/after screenshots and layout measurements are under `verification/architecture/`.

The QR code intentionally encodes the current page URL, as on the reference. A phone cannot open another computer's loopback address. Store buttons and footer links retain their official destinations; Open Brawl Stars requires the installed game.

`reference.html` is the inert, cleaned source structure used to produce the final `index.html`; the application does not load it.
