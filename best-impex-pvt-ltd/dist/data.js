export const company = {
  name: 'BEST IMPEX PVT LTD',
  email: 'bestgroup.in@gmail.com',
  phone: '+91 9500036154',
  telephone: '+919500036154',
  address: 'Old No.11, G-1, 21/1, New, Asoka Ave, Kodambakkam, Chennai, Tamil Nadu 600024, India.',
  whatsapp: 'https://wa.me/919500036154',
  whatsappMessage: 'Hello BEST IMPEX PVT LTD, I am interested in your spice products. I would like to know more about your product catalogue, bulk quantities, packaging options and export quotations.',
  origin: 'https://best-impex-spices.exoticdune16.chatgpt.site',
};

export const settings = {
  enquiryEndpoint: '',
  exchangeEndpoint: 'https://open.er-api.com/v6/latest/USD',
};

export const packaging = ['Discuss with our team', 'Food-grade lined sacks', 'Food-grade cartons', 'Sealed food-grade bags', 'Custom packaging'];
export const currencies = { USD: 'US Dollar', INR: 'Indian Rupee', EUR: 'Euro', GBP: 'British Pound', AED: 'UAE Dirham', SGD: 'Singapore Dollar' };
export const units = { KG: 'Kilograms', MT: 'Metric tons', G: 'Grams', LB: 'Pounds' };

const catalogue = [
  ['black-pepper','Black Pepper','Piper nigrum','India, Vietnam, Indonesia','Wrinkled dark brown to black berries','Woody, citrusy and sharp','Warm heat with a dry, lingering finish','Whole, cracked, coarse or ground','Dried, cleaned, graded and milled for ground forms','Steaks, soups, marinades, sauces and seasoning blends','Indian pepper fry, French pepper sauces and European cured meats','Meat rubs, prepared sauces and savoury seasoning blends','Pepper-crusted steak','Cracked pepper forms a fragrant crust on seared steak and brings warmth to pan sauces and marinades.'],
  ['green-cardamom','Green Cardamom','Elettaria cardamomum','India, Guatemala','Pale to deep green ridged pods with dark seeds','Floral, eucalyptus-like and fresh','Sweet, citrusy and lightly camphorous','Whole pods, seeds or ground','Cured and dried, then cleaned, sorted or milled','Biryani, chai, desserts, baked goods and traditional sweets','South Asian rice dishes, Arabic coffee and Scandinavian baking','Tea blends, bakery products and flavoured dairy','Cardamom biryani','Whole pods perfume rice as it steams, lending biryani a clean floral note that also works beautifully in chai.'],
  ['cloves','Cloves','Syzygium aromaticum','Indonesia, Madagascar, Sri Lanka','Dark reddish-brown dried flower buds','Intensely aromatic, sweet and woody','Warm, slightly bitter and pungent','Whole or ground','Flower buds are harvested before opening, dried and sorted','Curries, marinades, spice blends and rice dishes','Indian garam masala, Indonesian braises and European mulled drinks','Seasoning mixes, marinades and bakery blends','Clove-spiced curry','A few whole cloves bring warmth and depth to a slow-simmered curry, especially alongside cinnamon and cardamom.'],
  ['cinnamon','Cinnamon','Cinnamomum spp.','Sri Lanka, Indonesia, Vietnam','Rolled reddish-brown bark or a fine brown powder','Sweet, woody and fragrant','Warm and sweet, with intensity varying by species','Sticks, chips or ground','Bark is stripped, dried and cut or milled','Desserts, beverages, baked goods and slow-cooked dishes','European pastries, Middle Eastern braises and South Asian rice','Bakery, beverage concentrates and spice blends','Cinnamon rolls','Ground cinnamon gives enriched dough its familiar warmth. Whole sticks infuse syrups, teas and slow-cooked dishes.'],
  ['turmeric','Turmeric','Curcuma longa','India, Bangladesh, Myanmar','Orange-yellow fingers or a brilliant golden powder','Earthy and gently peppery','Earthy, mildly bitter and warm','Whole fingers or ground','Rhizomes are commonly cured, dried and polished or milled','Curries, rice dishes, seasoning blends and soups','South Asian dals, Southeast Asian curries and spiced rice','Dry seasoning, prepared meal bases and spice pastes','Golden coconut curry','Bloom turmeric in oil to bring its earthy character forward and give a coconut curry its deep golden colour.'],
  ['dry-red-chillies','Dry Red Chillies','Capsicum annuum','India, China, Mexico','Crimson to deep red dried pods, depending on variety','Fruity, smoky or earthy depending on variety','Heat and sweetness vary by cultivar','Whole pods, flakes or ground','Pods are dried, sorted and optionally destemmed or milled','Sauces, curries, spice mixes and chilli pastes','Indian tadka, Mexican adobos and East Asian chilli oils','Hot sauces, snack seasonings and spice blends','Red chilli paste','Rehydrating dried chillies brings out their fruitiness and gives pastes and sauces body as well as heat.'],
  ['coriander-seeds','Coriander Seeds','Coriandrum sativum','India, Morocco, Bulgaria','Round, light tan ribbed fruits','Citrusy, floral and lightly nutty','Warm, gently sweet and lemony','Whole, crushed or ground','Dried, cleaned and graded, with milling for ground forms','Curry powders, marinades, pickles and seasoning blends','South Asian curries, Middle Eastern spice mixes and European pickles','Pickling blends, seasonings and prepared sauces','Coriander mango pickle','Toasted coriander brings a citrus note to tangy mango pickle and balances sharper spices in marinades.'],
  ['cumin-seeds','Cumin Seeds','Cuminum cyminum','India, Turkey, Iran','Narrow ridged yellow-brown seeds','Earthy, warm and slightly nutty','Savoury and earthy with gentle bitterness','Whole or ground','Dried, cleaned, sorted and optionally milled','Roasted vegetables, curries, rice dishes and seasoning blends','Indian jeera rice, Mexican beans and Middle Eastern rubs','Snack seasonings, spice mixes and frozen meal bases','Cumin-roasted carrots','Toasting cumin draws out its aroma. Its earthy flavour balances the natural sweetness of roasted carrots.'],
  ['fennel-seeds','Fennel Seeds','Foeniculum vulgare','India, Egypt, Turkey','Elongated ridged green to green-brown seeds','Sweet with a soft anise aroma','Mildly sweet and liquorice-like','Whole, crushed or ground','Dried, cleaned, graded and optionally milled','Breads, sweets, seasoning blends and traditional dishes','Italian breads and sausages, Indian sweets and Mediterranean fish','Bakery toppings, confectionery and savoury seasonings','Fennel focaccia','A scattering of fennel seeds gives bread a delicate anise note, especially when paired with olive oil and salt.'],
  ['star-anise','Star Anise','Illicium verum','China, Vietnam','Reddish-brown, star-shaped dried fruit','Pronounced sweet anise and warm spice','Liquorice-like, sweet and lingering','Whole stars, broken pieces or ground','Fruit is dried, sorted and optionally milled','Broths, spice blends and desserts','Vietnamese phở, Chinese five-spice and spiced poached fruit','Broth bases, sauces and beverage blends','Star anise phở broth','Whole star anise releases a slow, sweet aroma into simmered broth and complements ginger and savoury stock.'],
  ['nutmeg','Nutmeg','Myristica fragrans','Indonesia, India, Grenada','Oval brown seed with a marbled interior','Warm, sweet and woody','Nutty, gently sweet and slightly bitter','Whole kernels or ground','Seeds are dried, shelled, sorted and optionally milled','Desserts, sauces, baked goods and beverages','European béchamel, South Asian sweets and Caribbean drinks','Bakery, dairy sauces and beverage blends','Nutmeg custard','A little freshly grated nutmeg adds warmth to custards, cream sauces and baked desserts.'],
  ['fenugreek','Fenugreek','Trigonella foenum-graecum','India, Egypt, Morocco','Angular yellow to pale brown seeds','Maple-like and earthy when toasted','Distinctly bitter with a nutty finish','Whole or ground seeds','Dried, cleaned, graded and optionally milled','Curries, pickles, spice blends and traditional dishes','South Asian pickles, Ethiopian berbere and Middle Eastern breads','Curry blends, pickle seasonings and savoury mixes','Fenugreek-tempered curry','A brief tempering in oil softens the seed’s bitterness and gives a curry or pickle a rounded toasted note.'],
];

export const spices = catalogue.map(([id, name, botanical, origins, appearance, aroma, flavour, forms, processing, culinary, international, industry, dish, story]) => ({
  id, name, botanical, origins, appearance, aroma, flavour, forms, processing, culinary, international, industry, dish, story,
  grades: 'Grade, size and specifications to be confirmed with our team.',
  storage: 'Keep sealed in a cool, dry place away from sunlight, moisture and strong odours.',
  shelfLife: 'Confirm shelf life by lot, form and packaging before ordering.',
}));

export const kilograms = { KG: 1, MT: 1000, G: 0.001, LB: 1 / 2.20462 };
export const convert = (value, from, to) => value * kilograms[from] / kilograms[to];
