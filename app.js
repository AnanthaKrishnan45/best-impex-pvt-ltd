import { company, settings, spices, units, currencies, convert } from './data.js';

const bySpice = new Map(spices.map(spice => [spice.id, spice]));
const number = new Intl.NumberFormat('en', { maximumSignificantDigits: 9 });
const nav = document.querySelector('#navigation');
const menu = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function toggleMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) toggleMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    toggleMenu(false);
    menu.focus();
  }
});

const navItems = [...nav.querySelectorAll('[data-section]')];
const sections = navItems
  .map(link => document.getElementById(link.dataset.section))
  .filter(Boolean)
  .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
const hero = document.querySelector('.hero');
let queued = false;
function updateHeader() {
  queued = false;
  header.classList.toggle('compact', scrollY > 38);
  if (hero && !reducedMotion.matches && scrollY < hero.offsetHeight) {
    hero.style.setProperty('--parallax', Math.round(scrollY * 0.065) + 'px');
  }
  if (!sections.length) return;
  const threshold = Math.max(header.offsetHeight + 32, innerHeight * 0.24);
  let current = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) current = section.id;
  }
  for (const link of navItems) {
    if (link.dataset.section === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function scheduleHeader() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(updateHeader);
}
addEventListener('scroll', scheduleHeader, { passive:true });
addEventListener('resize', scheduleHeader);
updateHeader();

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        reveal.unobserve(entry.target);
      }
    }
  }, { threshold:0.12 });
  document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));
}

const picker = document.querySelector('.story-picker');
if (picker) {
  const panel = document.querySelector('.story-panel');
  const photoBox = panel.querySelector('.story-photo');
  const name = panel.querySelector('[data-story-name]');
  const dish = panel.querySelector('[data-dish]');
  const story = panel.querySelector('[data-story-text]');
  const link = panel.querySelector('[data-story-link]');
  let currentStory;
  picker.addEventListener('click', async event => {
    const button = event.target.closest('button[data-story]');
    if (!button) return;
    const spice = bySpice.get(button.dataset.story);
    currentStory = spice.id;
    for (const candidate of picker.querySelectorAll('button')) {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    }
    const photo = new Image();
    photo.alt = spice.dish;
    photo.src = new URL('./assets/food-' + spice.id + '.webp', import.meta.url).href;
    try {
      await photo.decode();
    } catch {
      // Text stays available if the image file fails to load.
    }
    if (currentStory !== spice.id) return;
    photoBox.replaceChildren(photo);
    name.textContent = spice.name;
    dish.textContent = spice.dish;
    story.textContent = spice.story;
    link.href = new URL('./spices/' + spice.id + '/', import.meta.url).href;
  });
}

const calculator = document.querySelector('#calculator');
const quote = document.querySelector('#quotation-form');
if (calculator) {
  const summary = Object.fromEntries([...document.querySelectorAll('[data-summary]')]
    .map(element => [element.dataset.summary, element]));
  const selectedLabel = field => field.value ? field.selectedOptions[0].textContent : '';
  const quoteFields = ['spice','quantity','unit','packaging','country','currency'];
  const preselected = new URLSearchParams(location.search).get('spice');
  if (bySpice.has(preselected)) {
    calculator.elements.spice.value = preselected;
    quote.elements.spice.value = preselected;
  }
  function updateCalculator() {
    const fields = calculator.elements;
    const amount = fields.quantity.valueAsNumber;
    const unit = fields.unit.value;
    summary.spice.textContent = selectedLabel(fields.spice) || 'Choose a spice';
    summary.quantity.textContent = fields.quantity.validity.valid ? number.format(amount) + ' ' + unit : '—';
    summary.converted.textContent = fields.quantity.validity.valid
      ? Object.keys(units).filter(target => target !== unit)
        .map(target => number.format(convert(amount, unit, target)) + ' ' + target).join(' · ')
      : 'Enter a valid quantity';
    summary.country.textContent = selectedLabel(fields.country) || 'Select a country';
    summary.packaging.textContent = fields.packaging.value;
    summary.currency.textContent = fields.currency.value;
    updateRate();
  }
  calculator.addEventListener('input', updateCalculator);
  calculator.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of quoteFields) quote.elements[field].value = calculator.elements[field].value;
    document.querySelector('#quotation').scrollIntoView({ behavior:reducedMotion.matches ? 'instant' : 'smooth' });
    quote.elements.name.focus({ preventScroll:true });
  });

  const rateText = document.querySelector('#rate');
  const retry = document.querySelector('#rate-retry');
  const reference = document.querySelector('#currency-reference');
  const referenceAmount = document.querySelector('#reference-amount');
  const referenceOutput = document.querySelector('#reference-output');
  let rates;
  let rateError = false;
  let loading = false;
  function updateRate() {
    const currency = calculator.elements.currency.value;
    const rate = rates?.rates[currency];
    retry.hidden = !rateError;
    reference.hidden = !rate;
    if (!rate) {
      rateText.textContent = rateError
        ? 'Live conversion is unavailable. You can still request a quotation in your preferred currency.'
        : 'Checking the latest exchange rates…';
      return;
    }
    rateText.textContent = '1 USD = ' + number.format(rate) + ' ' + currency + ' · ' +
      new Intl.DateTimeFormat('en', { dateStyle:'medium', timeZone:'UTC' }).format(rates.time_last_update_unix * 1000) +
      ' · ExchangeRate-API';
    const usd = referenceAmount.valueAsNumber;
    referenceOutput.textContent = Number.isFinite(usd) && referenceAmount.validity.valid
      ? new Intl.NumberFormat('en', { style:'currency', currency, currencyDisplay:'code' }).format(usd * rate)
      : 'Enter an amount to convert';
  }
  async function loadRate() {
    if (loading) return;
    loading = true;
    rateError = false;
    updateRate();
    try {
      const response = await fetch(settings.exchangeEndpoint, { signal:AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error('Exchange rate request failed');
      const payload = await response.json();
      const valid = payload.result === 'success' && payload.base_code === 'USD'
        && Number.isFinite(payload.time_last_update_unix)
        && Object.keys(currencies).every(code => Number.isFinite(payload.rates?.[code]) && payload.rates[code] > 0);
      if (!valid) throw new Error('Invalid exchange rate data');
      rates = payload;
    } catch {
      rateError = true;
    } finally {
      loading = false;
      updateRate();
    }
  }
  retry.addEventListener('click', loadRate);
  updateCalculator();
  loadRate();
}

const enquiryLabels = {
  name:'Full name', company:'Company', email:'Email', phone:'WhatsApp', country:'Country',
  spice:'Spice', quantity:'Quantity', unit:'Unit', packaging:'Packaging', port:'Destination port',
  currency:'Currency', requirements:'Requirements',
};

for (const form of document.querySelectorAll('[data-enquiry]')) {
  const submit = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-status]');
  const fallback = form.querySelector('.fallback');
  const mail = form.querySelector('[data-mail]');
  const chat = form.querySelector('[data-chat]');
  const requiredText = form.querySelectorAll('input[required]:not([type=number]), textarea[required]');
  for (const field of requiredText) {
    field.addEventListener('input', () => field.setCustomValidity(''));
  }
  form.addEventListener('input', () => {
    if (!submit.disabled) {
      fallback.hidden = true;
      status.textContent = '';
    }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    for (const field of requiredText) {
      if (!field.value.trim()) field.setCustomValidity('Please complete this field.');
    }
    const phone = form.elements.phone?.value.trim();
    if (phone && !/^\+[1-9][0-9]{7,14}$/.test(phone.replace(/[\s()-]/g, ''))) {
      form.elements.phone.setCustomValidity('Enter a phone number with the country code, such as +91 9500036154.');
    }
    if (!form.reportValidity()) return;
    const type = form.dataset.enquiry;
    const data = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
    const lines = Object.entries(data).filter(([, value]) => value).map(([key, value]) => {
      const field = form.elements.namedItem(key);
      const text = field instanceof HTMLSelectElement ? field.selectedOptions[0].textContent : value;
      return enquiryLabels[key] + ': ' + text;
    });
    const message = 'Hello BEST IMPEX LINK PVT LTD,\n\n' + type + '\n\n' + lines.join('\n');
    mail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(company.email) + '&su=' + encodeURIComponent(type) + '&body=' + encodeURIComponent(message);
    mail.target = '_blank';
    mail.rel = 'noopener noreferrer';
    mail.textContent = 'Continue with Gmail';
    chat.href = company.whatsapp + '?text=' + encodeURIComponent(message);

    if (!settings.enquiryEndpoint) {
      status.textContent = 'Your enquiry is ready. Choose email or WhatsApp to review and send it.';
      fallback.hidden = false;
      return;
    }
    submit.disabled = true;
    status.textContent = 'Sending your enquiry…';
    form.setAttribute('aria-busy','true');
    try {
      const endpoint = new URL(settings.enquiryEndpoint, location.origin);
      if (endpoint.protocol !== 'https:' && endpoint.origin !== location.origin) throw new Error('HTTPS is required');
      const response = await fetch(endpoint, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Accept:'application/json' },
        body:JSON.stringify({ type, ...data }),
        credentials:'omit',
        signal:AbortSignal.timeout(12000),
      });
      if (!response.ok || (await response.json()).accepted !== true) throw new Error('Delivery was not confirmed');
      status.textContent = 'Your enquiry was received by BEST IMPEX LINK PVT LTD.';
      fallback.hidden = true;
      form.reset();
    } catch {
      status.textContent = 'Online delivery could not be confirmed. You can send your enquiry by email or WhatsApp.';
      fallback.hidden = false;
    } finally {
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
