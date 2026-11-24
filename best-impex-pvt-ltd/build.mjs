import { writeFile, mkdir } from 'node:fs/promises';
import { company, spices, units, currencies, packaging } from './dist/data.js';
import { codes } from './dist/countries.js';

const img = '/assets/';
const paths = spices.map(spice => '/spices/' + spice.id + '/');
const menu = [
  ['home','Home'], ['about','About Us'], ['spices','Our Spices'], ['culinary','Culinary Uses'],
  ['export','Export Process'], ['bulk','Bulk Orders'], ['contact','Contact Us'],
];
const iconPaths = {
  leaf: '<path d="M12 22V9m0 8C5 17 2 13 2 7c5 0 9 1 10 6 1-5 5-6 10-6 0 6-3 10-10 10Zm0-5C8 8 9 4 12 2c3 2 4 6 0 10Z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a13 13 0 0 1-6-6l2-2-2-5Z"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 11h8m-8 4h5"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  box: '<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v10M7.5 5l9 4v4"/>',
  file: '<path d="M5 3h9l5 5v13H5V3Zm9 0v6h5M8 13h8m-8 4h8"/>',
  ship: '<path d="M4 17 2 12l10-4 10 4-2 5M6 10V5h12v5m-6-2v9M2 20c3 0 3-2 5-2s3 2 5 2 3-2 5-2 2 2 5 2"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name]}</svg>`;
const label = text => `<p class="eyebrow"><span aria-hidden="true"></span>${text}</p>`;
const button = (href, text, style = 'primary') => `<a class="button ${style}" href="${href}">${text}</a>`;
const whatsapp = company.whatsapp + '?text=' + encodeURIComponent(company.whatsappMessage);
const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(company.address);
const image = (name, alt, cls = '', lazy = true) => `<img class="${cls}" src="${img}${name}.webp" alt="${alt}" ${lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high"'}>`;
const logo = `<span class="brand-mark">${icon('leaf')}</span><span class="brand-name">BEST IMPEX<small>PVT LTD</small></span>`;
const nav = `<a class="skip" href="#main">Skip to content</a><header class="header">
  <div class="header-inner"><a class="brand" href="/#home" aria-label="BEST IMPEX PVT LTD home">${logo}</a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Open navigation"><span></span><span></span></button>
  <nav id="navigation" aria-label="Main navigation">${menu.map(([id,title]) => `<a href="/#${id}" data-section="${id}">${title}</a>`).join('')}</nav>
  ${button('/#bulk', 'Request a Quote', 'header-quote')}</div></header>`;
const footer = `<footer class="footer"><div class="container">
  <div class="footer-grid"><div><a class="brand" href="/#home" aria-label="BEST IMPEX PVT LTD home">${logo}</a><p>International spice trading and bulk supply enquiries from Chennai, India.</p></div>
  <div><h2>Quick links</h2>${menu.map(([id,title]) => `<a href="/#${id}">${title}</a>`).join('')}</div>
  <div><h2>Our spices</h2><div class="footer-spices">${spices.map((spice, i) => `<a href="${paths[i]}">${spice.name}</a>`).join('')}</div></div>
  <div><h2>Contact</h2><a href="mailto:${company.email}">${company.email}</a><a href="tel:${company.telephone}">${company.phone}</a><a href="${whatsapp}">WhatsApp</a><a class="footer-address" href="${map}">${company.address}</a></div></div>
  <div class="footer-base"><span>© 2026 BEST IMPEX PVT LTD. All Rights Reserved.</span><div><a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms and Conditions</a></div></div>
  </div></footer>`;

const page = ({title, description, path = '/', photo = 'hero', schema, html}) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<link rel="canonical" href="${company.origin}${path}"><meta name="theme-color" content="#12251d">
<meta property="og:type" content="${path.startsWith('/spices/') ? 'product' : 'website'}"><meta property="og:title" content="${title}">
<meta property="og:description" content="${description}"><meta property="og:url" content="${company.origin}${path}">
<meta property="og:image" content="${company.origin}${img}${photo}.webp">
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css"><script type="module" src="/app.js"></script>
${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>` : ''}
</head><body>${nav}<main id="main">${html}</main>${footer}</body></html>`;

const locations = new Intl.DisplayNames(['en'], {type:'region'});
const countryOptions = codes.map(code => [code, locations.of(code)]).sort((a,b) => a[1].localeCompare(b[1]));
const options = values => values.map(([value,text]) => `<option value="${value}">${text}</option>`).join('');
const select = (name, title, list, prompt, required = true) => `<label>${title}<select name="${name}" ${required ? 'required' : ''}>${prompt ? `<option value="">${prompt}</option>` : ''}${options(list)}</select></label>`;
const input = (name, title, attrs = '') => `<label>${title}<input name="${name}" ${attrs}></label>`;
const spiceList = spices.map(({id,name}) => [id,name]);
const unitList = Object.entries(units).map(([code,name]) => [code, `${name} (${code})`]);
const currencyList = Object.entries(currencies).map(([code,name]) => [code, `${code} · ${name}`]);
const packList = packaging.map(item => [item,item]);
const quantity = input('quantity','Quantity','type="number" inputmode="decimal" step="any" min="0.000001" max="1000000000000" required placeholder="e.g. 1000"');
const buyer = [
  input('name','Full name','required autocomplete="name" maxlength="120"'),
  input('company','Company name','required autocomplete="organization" maxlength="150"'),
  input('email','Business email','type="email" required autocomplete="email" maxlength="254"'),
  input('phone','WhatsApp number','type="tel" autocomplete="tel" placeholder="+91 00000 00000" required maxlength="24"'),
];
const formActions = type => `<div class="form-actions full"><button class="button primary" type="submit">${type}</button><noscript><p>Enable JavaScript to prepare your enquiry, or <a href="mailto:${company.email}">contact us by email</a>.</p></noscript><p data-status role="status" aria-live="polite"></p><div class="fallback" hidden><a data-mail class="text-link" href="mailto:${company.email}">Continue by email</a><a data-chat class="text-link" href="${whatsapp}" target="_blank" rel="noopener">Continue on WhatsApp</a></div></div>`;

const aboutItems = [
  ['Our Story','We began in Chennai with a focus on quality-conscious sourcing and dependable bulk supply for business customers.'],
  ['Our Vision','To build a trusted spice trading business that connects well-sourced ingredients with buyers around the world.'],
  ['Our Mission','To make it straightforward for buyers to discuss specifications, lot information, packaging and trade requirements.'],
  ['Our Sourcing Philosophy','We start with the spice, its origin, form and expected sensory profile. Sourcing details are confirmed for each quotation.'],
  ['Our Commitment to Quality','We discuss lot-specific requirements such as appearance, aroma, grade and storage before an order is agreed.'],
  ['Why Choose BEST IMPEX PVT LTD?','A Chennai-based point of contact for wholesale buyers, with a quotation process built around each product, quantity and destination.'],
];
const steps = [
  ['leaf','Sourcing','Discuss origin, form, grade and availability for your spice.'],
  ['check','Quality check','Agree inspection requirements, product specifications and lot details.'],
  ['box','Packaging','Choose an appropriate food-grade format for handling, storage and transport.'],
  ['file','Export preparation','Confirm the documentation and shipment details required for your market.'],
  ['ship','International delivery','Discuss bulk shipment handling, destination port and logistics requirements.'],
];
const details = (spice) => `<dl class="spec-list">${[
  ['Botanical name',`<i>${spice.botanical}</i>`], ['Typical growing regions', `${spice.origins}. Order origin subject to confirmation.`],
  ['Appearance',spice.appearance], ['Aroma',spice.aroma], ['Flavour',spice.flavour],
  ['Grades',spice.grades], ['Common forms',`${spice.forms}. Availability to be confirmed.`],
  ['Typical processing',spice.processing], ['Packaging','Lined sacks, cartons and sealed bags can be discussed. Format and capacity are confirmed in your quote.'],
  ['Storage',spice.storage], ['Shelf life',spice.shelfLife], ['Culinary applications',spice.culinary],
  ['International cuisines',spice.international], ['Food industry applications',spice.industry], ['Bulk availability','Subject to confirmation for your requested quantity, grade and destination.'],
].map(([key,value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl>`;

const homeHTML = `<section class="hero" id="home">
  ${image('hero','Turmeric, peppercorns, cardamom, cinnamon and dried chillies on a dark spice table','hero-img',false)}
  <div class="hero-shade"></div><div class="container hero-content">
    ${label('CHENNAI, INDIA  /  INTERNATIONAL SPICE TRADE')}
    <h1><span>The World's Finest</span><span>Spices. Delivered</span><em>Beyond Borders.</em></h1>
    <p class="hero-description">Discover exceptional spices, thoughtfully sourced and supplied to global markets with quality, consistency and care.</p>
    <div class="hero-actions">${button('#spices','Explore Our Spices')}${button('#bulk','Request Bulk Pricing','outline')}</div>
  </div><a class="hero-scroll" href="#spices" aria-label="Scroll to our spices"><span></span>Scroll to explore</a>
  
</section>
<section id="spices" class="section catalogue"><div class="container">
  <div class="collection-head reveal"><div>${label('THE ART OF SPICES')}<h2>The Spice Collection</h2></div><p>Discover twelve whole and ground spices for wholesale, food manufacturing and international trade.</p></div>
  <div class="spice-grid">${spices.map((spice,i) => `<a class="spice-card reveal" href="${paths[i]}"><div class="spice-image">${image(spice.id,spice.name)}<span class="card-action" aria-hidden="true">+</span></div><div class="spice-title"><h3>${spice.name}</h3><p>${spice.botanical}</p></div></a>`).join('')}</div>
</div></section>
<section class="section about" id="about"><div class="container editorial">
  <div class="editorial-image reveal">${image('story','A spice trader inspecting whole spices above jute sacks')}<div class="photo-caption">Chennai, Tamil Nadu, India</div></div>
  <div class="editorial-copy reveal">${label('ABOUT US')}<h2>Rooted in Chennai.<br><em>Open to the world.</em></h2>
    <p>Founded in November 2026, BEST IMPEX PVT LTD is a Chennai-based spice trading brand focused on bringing quality spices to international markets.</p>
    <p>Built on a commitment to quality, reliable sourcing and customer satisfaction, we aim to connect premium spice products with businesses across the globe.</p>
    <p>From Chennai, Tamil Nadu, India, we are building our presence in the international spice trade through a customer-focused approach, quality-conscious sourcing and dependable bulk supply solutions.</p>
    <dl class="company-facts"><div><dt>Established</dt><dd>November 2026</dd></div><div><dt>Headquarters</dt><dd>Chennai, Tamil Nadu, India</dd></div></dl>
  </div>
  <div class="about-details">${aboutItems.map(([title,content]) => `<details><summary>${title}</summary><p>${content}</p></details>`).join('')}</div>
</div></section>
<section class="section culinary" id="culinary"><div class="container">
  <div class="collection-head reveal"><div>${label('CULINARY USES')}<h2>From Nature to Your Kitchen</h2></div><p>See how each spice shapes a dish, from the first aroma to the final bite.</p></div>
  <div class="culinary-layout"><div class="story-picker" role="group" aria-label="Choose a spice">${spices.map((spice, i) => `<button type="button" data-story="${spice.id}" aria-pressed="${i===0}">${spice.name}</button>`).join('')}</div>
    <div class="story-panel" aria-live="polite"><div class="story-photo">${image('food-black-pepper',spices[0].dish)}</div><div class="story-copy"><p data-story-name class="eyebrow">${spices[0].name}</p><h3 data-dish>${spices[0].dish}</h3><p data-story-text>${spices[0].story}</p><a class="text-link" data-story-link href="${paths[0]}">Explore this spice</a></div></div>
  </div>
</div></section>
<section class="section export" id="export"><div class="container">
  <div class="collection-head reveal"><div>${label('EXPORT PROCESS')}<h2>From origin to destination</h2></div><p>Our approach to international spice trade, from sourcing discussions to preparing your bulk shipment.</p></div>
  <div class="export-photo reveal">${image('trade','Packed cartons and jute sacks prepared in a warehouse')}</div><ol class="trade-steps">${steps.map(([symbol,title,copy]) => `<li class="reveal"><span class="trade-symbol">${icon(symbol)}</span><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol>
</div></section>
<section class="section bulk" id="bulk"><div class="container">
  <div class="collection-head reveal"><div>${label('BULK ORDERS')}<h2>Plan your bulk order</h2></div><p>Calculate quantities and share your requirements for a tailored quotation.</p></div>
  <div class="calculator"><form id="calculator" class="field-grid">
    <h3 class="full">Bulk quantity calculator</h3>${select('spice','Spice',spiceList,'Choose a spice')}${quantity}
    ${select('unit','Measurement unit',unitList)}${select('packaging','Packaging preference',packList)}
    ${select('country','Destination country',countryOptions,'Select a country')}${select('currency','Preferred currency',currencyList)}
    <div class="rate full"><p id="rate" role="status">Checking the latest exchange rates…</p><div class="rate-value" id="currency-reference" hidden><label>Reference amount in USD<input type="number" id="reference-amount" form="currency-conversion" inputmode="decimal" min="0" max="1000000000000" step="any" placeholder="e.g. 100"></label><output id="reference-output" for="reference-amount"></output><a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Rates by ExchangeRate-API</a></div><button class="text-link" id="rate-retry" type="button" hidden>Retry exchange rates</button></div>
    <button class="button primary full" type="submit">Request Bulk Quotation</button>
  </form><div class="calc-summary"><h3>Your order summary</h3><dl>
    <div><dt>Spice</dt><dd data-summary="spice">Choose a spice</dd></div>
    <div><dt>Requested quantity</dt><dd data-summary="quantity">—</dd></div>
    <div><dt>Equivalent weights</dt><dd data-summary="converted">Enter a quantity</dd></div>
    <div><dt>Destination</dt><dd data-summary="country">Select a country</dd></div>
    <div><dt>Packaging</dt><dd data-summary="packaging">${packaging[0]}</dd></div>
    <div><dt>Currency</dt><dd data-summary="currency">USD</dd></div>
  </dl></div></div>
  <section class="quote" id="quotation"><div><h3>Request a bulk quotation</h3><p>Tell us where and how much you need. Our team can confirm origin, availability, packaging and pricing for your order.</p></div>
  <form id="quotation-form" method="post" class="field-grid" data-enquiry="Bulk quotation">
  ${buyer.join('')}${select('country','Country',countryOptions,'Select a country')}${select('spice','Selected spice',spiceList,'Choose a spice')}
  ${quantity}${select('unit','Measurement unit',unitList)}${select('packaging','Packaging preference',packList)}
  ${input('port','Destination port','required maxlength="140" placeholder="e.g. Port of Singapore"')}${select('currency','Preferred currency',currencyList)}
  <label class="full">Additional requirements<textarea name="requirements" rows="4" maxlength="3000" placeholder="Grade, form, delivery timing or other specifications"></textarea></label>
  ${formActions('Request a Bulk Quotation')}</form></section>
</div></section>
<section class="section contact" id="contact"><div class="container">
  <div class="collection-head reveal"><div>${label('CONTACT US')}<h2>Speak with our team</h2></div><p>BEST IMPEX PVT LTD<br>Customer relations and bulk order enquiries</p></div>
  <div class="contact-cards">
    <article>${icon('email')}<h3>Customer relations</h3><a href="mailto:${company.email}">${company.email}</a>${button('mailto:'+company.email,'Email Customer Relations','light')}</article>
    <article>${icon('phone')}<h3>Direct phone</h3><a href="tel:${company.telephone}">${company.phone}</a>${button('tel:'+company.telephone,'Call Our Office','light')}</article>
    <article>${icon('chat')}<h3>WhatsApp bulk orders</h3><a href="${whatsapp}">${company.phone}</a>${button(whatsapp,'Chat with Us on WhatsApp','light')}</article>
    <article>${icon('pin')}<h3>Office location</h3><a href="${map}">${company.address}</a>${button(map,'Open in Google Maps','light')}</article>
  </div>
  <div class="contact-lower"><div class="map"><iframe title="Map of BEST IMPEX PVT LTD office in Chennai" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(company.address)}&amp;t=&amp;z=15&amp;output=embed"></iframe><a class="text-link" href="${map}">Get directions in Google Maps</a></div>
  <form class="field-grid" id="contact-form" method="post" data-enquiry="General enquiry"><h3 class="full">General enquiry</h3>${input('name','Full name','required autocomplete="name" maxlength="120"')}${input('email','Email','type="email" required autocomplete="email" maxlength="254"')}<label class="full">Message<textarea name="requirements" rows="4" maxlength="3000" required></textarea></label>${formActions('Send Enquiry')}<a href="#quotation" class="text-link full">Request a bulk quotation</a></form></div>
</div></section>`;

const description = 'Explore twelve wholesale spices, from black pepper and cardamom to turmeric. Request bulk export quotations from BEST IMPEX PVT LTD in Chennai, India.';
await writeFile('dist/index.html', page({
  title: 'BEST IMPEX PVT LTD | Bulk Spice Suppliers in Chennai, India', description,
  schema: {'@context':'https://schema.org','@type':'Organization',name:company.name,url:company.origin,
    email:company.email,telephone:company.telephone,foundingDate:'2026-11',
    address:{'@type':'PostalAddress',streetAddress:'Old No.11, G-1, 21/1, New, Asoka Ave, Kodambakkam',addressLocality:'Chennai',addressRegion:'Tamil Nadu',postalCode:'600024',addressCountry:'IN'}},
  html: homeHTML,
}));

await Promise.all(spices.map(async (spice,i) => {
  const path = paths[i];
  await mkdir('dist'+path,{recursive:true});
  await writeFile('dist'+path+'index.html',page({
    title: `${spice.name} | Wholesale Spice | BEST IMPEX PVT LTD`,
    description: `Explore ${spice.name.toLowerCase()}, its typical origins, flavour and culinary uses. Discuss bulk supply and export packaging with BEST IMPEX PVT LTD.`,
    path, photo:spice.id,
    schema:{'@context':'https://schema.org','@type':'Product',name:spice.name,image:company.origin+img+spice.id+'.webp',description:spice.flavour,category:'Spices'},
    html: `<section class="product-hero"><div class="container editorial"><div class="product-copy">
      <a href="/#spices" class="text-link">Back to the spice collection</a>${label('THE ART OF SPICES')}
      <h1>${spice.name}</h1><p class="botanical">${spice.botanical}</p><p>${spice.flavour}.</p>
      ${button('/?spice='+spice.id+'#quotation','Request Bulk Quotation')}</div>
      <div class="product-image">${image(spice.id,spice.name,'',false)}</div></div></section>
      <section class="section product-specs"><div class="container"><h2>Product profile</h2>${details(spice)}</div></section>
      <section class="section product-food"><div class="container editorial"><div class="editorial-image">${image('food-'+spice.id,spice.dish)}</div>
      <div class="editorial-copy">${label('CULINARY USES')}<h2>${spice.dish}</h2><p>${spice.story}</p><a class="text-link" href="/#culinary">Explore culinary uses</a></div></div></section>`,
  }));
}));

const legal = {
  privacy:['Privacy Policy',`<p>BEST IMPEX PVT LTD uses the information buyers choose to share to respond to enquiries and discuss product specifications, quotations and delivery requirements.</p><h2>What buyers share</h2><p>Enquiries may include your name, company, business email, WhatsApp number, country and order details. Please share only the information needed for your enquiry.</p><h2>External services</h2><p>Email, WhatsApp and Google Maps are provided by their respective operators. When you use those services, their privacy terms apply. If online submission is unavailable, you can review your prepared message before sending it in your selected app.</p><h2>Contact</h2><p>For questions about your enquiry information, email <a href="mailto:${company.email}">${company.email}</a>.</p>`],
  terms:['Terms and Conditions',`<p>The website presents general spice information and an enquiry service for business buyers. It does not accept payment or place orders.</p><h2>Quotations and availability</h2><p>Origin, grade, product form, lot specifications, packaging, price and availability are confirmed in writing for each order. Quantity conversions are informational. Reference exchange rates can change and do not determine an order price.</p><h2>Trade and delivery</h2><p>Delivery, documentation and payment terms depend on the product, destination and conditions agreed in writing with the buyer.</p><h2>Contact</h2><p>For questions about a quotation, email <a href="mailto:${company.email}">${company.email}</a>.</p>`],
};
for(const [slug,[title,copy]] of Object.entries(legal)) {
  await mkdir('dist/'+slug,{recursive:true});
  await writeFile('dist/'+slug+'/index.html',page({title:title+' | BEST IMPEX PVT LTD',description:title+' for BEST IMPEX PVT LTD.',path:'/'+slug+'/',html:`<article class="section legal"><div class="container"><h1>${title}</h1>${copy}</div></article>`}));
}
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${company.origin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...paths,'/privacy/','/terms/'].map(path=>`<url><loc>${company.origin}${path}</loc></url>`).join('')}</urlset>\n`);
