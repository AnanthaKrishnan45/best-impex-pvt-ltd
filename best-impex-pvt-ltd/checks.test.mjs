import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { company, spices, units, convert } from './dist/data.js';

const read = file => readFile('dist' + file, 'utf8');
const home = await read('/index.html');

test('converts all weight units and preserves round trips', () => {
  assert.equal(convert(1000,'KG','MT'),1);
  assert.equal(convert(1,'KG','G'),1000);
  assert.equal(convert(1,'KG','LB'),2.20462);
  assert.equal(convert(2.20462,'LB','KG'),1);
  for (const from of Object.keys(units)) {
    for (const to of Object.keys(units)) {
      assert.ok(Math.abs(convert(convert(217.83,from,to),to,from) - 217.83) < 1e-10);
    }
  }
});

test('renders the twelve distinct catalogue and culinary experiences', async () => {
  assert.equal(new Set(spices.map(spice => spice.id)).size,12);
  const sitemap = await read('/sitemap.xml');
  for (const spice of spices) {
    const path = '/spices/' + spice.id + '/';
    const product = await read(path + 'index.html');
    for (const item of [spice.name,spice.botanical,spice.dish,spice.appearance,spice.aroma,spice.flavour,spice.industry]) {
      assert.ok(product.includes(item), item);
    }
    assert.ok(product.includes('/?spice=' + spice.id + '#quotation'));
    assert.ok(home.includes('data-story="' + spice.id + '"'));
    assert.ok(sitemap.includes(company.origin + path));
    await access('dist/assets/' + spice.id + '.webp');
    await access('dist/assets/food-' + spice.id + '.webp');
  }
});

test('resolves internal links, images and page fragments', async () => {
  for (const path of ['/', '/privacy/', '/terms/', ...spices.map(spice=>'/spices/'+spice.id+'/')]) {
    const html = await read(path + 'index.html');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(match[1], company.origin+path);
      if (url.origin !== company.origin) continue;
      const file = url.pathname.endsWith('/') ? url.pathname+'index.html' : url.pathname;
      await access('dist'+file);
      if (url.hash) assert.ok((await read(file)).includes('id="'+url.hash.slice(1)+'"'), match[1]);
    }
  }
});

test('uses supplied business contact information and has both forms', () => {
  assert.ok(home.includes('id="quotation-form"'));
  assert.ok(home.includes('id="contact-form"'));
  assert.ok(home.includes('mailto:' + company.email));
  assert.ok(home.includes('tel:' + company.telephone));
  assert.ok(home.includes(company.whatsapp + '?text=' + encodeURIComponent(company.whatsappMessage)));
  assert.ok(home.includes('query=' + encodeURIComponent(company.address)));
  const about = home.split('id="about"')[1].split('id="culinary"')[0];
  assert.ok(about.includes('November 2026'));
  assert.ok(!about.includes(company.email) && !about.includes(company.address));
});
