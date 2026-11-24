# BEST IMPEX PVT LTD website

Run `npm run build` to regenerate the homepage, product pages, legal pages and sitemap. Serve `dist/` with a static host that resolves directory URLs to `index.html`. The site has no build-time dependencies.

- Edit company details, the catalogue, packaging and service settings in `dist/data.js`.
- Edit page sections and generated markup in `build.mjs`. Styling and browser behaviour are in `dist/style.css` and `dist/app.js`.
- The photographs are generated editorial illustrations. Replace them under `dist/assets/` with verified company or lot imagery as it becomes available.
- Currency conversions use the ExchangeRate-API USD feed. The site shows the published rate date, a reference conversion, and an unavailable state on failure.

## Enquiry service

The default configuration keeps the enquiry on the visitor's device and lets them review and send a prepared message by email or WhatsApp. To enable direct web delivery, set `settings.enquiryEndpoint` to your HTTPS service or a same-origin API route. Both forms send a JSON POST with a `type` field and the named form inputs. The endpoint must validate input on the server, rate-limit submissions, forward to the company inbox or record the enquiry, and return HTTP 2xx with `{"accepted":true}` only after accepting it. If cross-origin, permit the website origin and the JSON POST preflight. Keep service credentials on the server. The browser uses the contact options when online delivery fails or is unconfigured.
