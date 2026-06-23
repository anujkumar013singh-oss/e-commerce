import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';

const productImages = {
  shirts: [
    'https://spykar.com/cdn/shop/files/MSHCS2BE016CAMEOBLUE_2_e638d1c4-17ca-451e-811b-d00b770e002b.jpg?v=1755891848',
    'https://www.selectedhomme.in/cdn/shop/files/901541002_g1_0a41d767-578a-462f-981b-03f6a8c9c574.jpg?v=1753771490&width=2048',
    'https://cottonworld.net/cdn/shop/files/M-SHIRTS-50020-21482-NATURAL_1.jpg?v=1767077351',
    'https://www.richlook.in/cdn/shop/files/R202779_11.jpg?v=1754916869',
    'https://www.hancockfashion.com/cdn/shop/products/5326White_Navy_1.jpg?v=1734414360',
    'https://images-static.nykaa.com/media/catalog/product/9/1/91ec3f7SUBCS005OLIVE_1.jpg?tr=w-500',
    'https://images-static.nykaa.com/media/catalog/product/0/b/0be2304KACLFS1348BU_1.jpg',
    'https://m.media-amazon.com/images/I/919MDKiwNwL._AC_UY1100_.jpg',
    'https://imagescdn.louisphilippe.com/img/app/product/3/39867064-17272034.jpg?auto=format&w=390',
    'https://wrogn.com/cdn/shop/files/1_8aaea45c-b58c-47a1-b569-60e6f981424c.webp?v=1759966684',
    'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI710B20512003_alternate10?$rl_4x5_pdp$',
    'https://wrogn.com/cdn/shop/files/WUSH5078W-D.webp?v=1747289236',
    'https://www.iconicindia.com/cdn/shop/files/GMS25-003000100410_1_c4ab07bb-0e5d-4464-831b-40f8f822e1f9.jpg?v=1756443642',
    'https://www.iconicindia.com/cdn/shop/files/2402-76OAL2BA-NS431-004_1.jpg?v=1755186728',
    'https://www.nicobar.com/cdn/shop/files/NBI039091_2.jpg?v=1741008194'
  ],
  polos: [
    'https://www.technosport.in/cdn/shop/files/OR81IronGrey_1.jpg?v=1738839831&width=1946',
    'https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2025/APRIL/4/eR36DNpj_19521a30f521403d952d2b95aafc2da8.jpg',
    'https://ttbazaar.com/cdn/shop/files/Red_550024b2-bc44-452d-9a2a-f308351d312b.jpg?v=1752831103',
    'https://assets.myntassets.com/assets/images/26159566/2023/12/19/04b34014-d0cc-4129-b8f5-e3f2021d7be61702970186069-Roadster-Men-Striped-Relaxed-Fit-Polo-Collar-T-shirt-2517029-1.jpg',
    'https://m.media-amazon.com/images/I/71Q2dJYXeHL._AC_UY1100_.jpg',
    'https://successmenswear.com/cdn/shop/products/DSC00601aa.jpg?v=1737958431',
    'https://wrogn.com/cdn/shop/files/WUTS1210S.webp?v=1754396652',
    'https://www.technosport.in/cdn/shop/files/OR81Black_1_f951dce3-37c8-431c-bfe7-3c23e6221216.jpg?v=1765952024',
    'https://images-static.nykaa.com/media/catalog/product/d/0/d01cee8USSHTFX0511_1.jpg?tr=w-500',
    'https://www.sporto.in/cdn/shop/products/Untitleddesign_26_1080x1440.png?v=1714718134',
    'https://static.cilory.com/876645-thickbox_default/men-contrast-collar-full-sleeve-polo-t-shirt.jpg.webp',
    'https://levi.in/cdn/shop/files/004LY0028_01_Styleshot.jpg?v=1776678425',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/3/a/3aaaebdNike-DH0858-511_1.jpg?rnd=20200526195200&tr=w-1536',
    'https://golfbuyindia.com/cdn/shop/files/Greg_32.png?v=1759149940&width=2000',
    'https://m.media-amazon.com/images/I/71yQMIahyNL._AC_UY1000_.jpg'
  ],
  kurtas: [
    'https://www.houseofchikankari.in/cdn/shop/products/House-Of-Chikankari-Nasir-Chikankari-Cotton-Straight-Men-Kurta-White-And-Brown-00007.jpg?v=1754584415&width=1080',
    'https://www.creaseindia.com/cdn/shop/files/blackgizasatinpathanikurtaformen1.jpg?v=1746132728&width=1946',
    'https://www.ethnicrajasthan.com/cdn/shop/files/APKUMCCBPPLFL02201ER00M_5.jpg?v=1730282324&width=2048',
    'https://www.nabia.in/cdn/shop/files/9_d5500e7c-f614-4c22-a5f2-eb4ef48ba324.jpg?v=1738224355',
    'https://www.anantexports.in/cdn/shop/files/IMG_20250610_153744.jpg',
    'https://rochaldas.in/cdn/shop/files/IMG_0800.jpg?v=1755947131&width=1946',
    'https://www.truebrowns.com/cdn/shop/files/1_c74514f6-3900-40d0-8cf6-63514466d099.jpg?v=1758482250&width=2048',
    'https://assets0.mirraw.com/images/13356573/image_original_zoom.jpeg?1751023947',
    'https://manyavar.scene7.com/is/image/manyavar/I03_18-08-22+MANYAVAR02676_18-08-2022-02-15:650x900?&dpr=on,2',
    'https://ik.imagekit.io/4sjmoqtje/tr:c-at_max/cdn/shop/files/green-silk-kurta-set-for-men-with-brocade-work-sg321348-1_cf4114dd-6d70-4b3b-9df3-2a41eb0b5a28.jpg?v=1763802600&w=1000',
    'https://assets0.mirraw.com/images/12548994/image_zoom.jpeg?1718194347',
    'https://img.perniaspopupshop.com/catalog/product/a/n/ANGM0223113_1.jpg?impolicy=detailimageprod',
    'https://littlebrats.in/cdn/shop/products/PH-350.jpg?v=1664170301',
    'https://medias.utsavfashion.com/media/catalog/product/cache/1/image/1000x/040ec09b1e35df139433887a97daa66f/w/o/woven-art-silk-jacquard-angrakha-kurta-set-in-off-white-v1-muy393.jpg',
    'https://linentrail.com/cdn/shop/files/Marz-BlueGrey4.jpg?v=1759757008&width=1080'
  ],
  trousers: [
    'https://imagescdn.louisphilippe.com/img/app/product/3/39659831-13468842.jpg?auto=format&w=390',
    'https://imagescdn.louisphilippe.com/img/app/product/3/320937-14703319.jpg?auto=format&w=390',
    'https://assets.ajio.com/medias/sys_master/root/20240703/caic/66852fdc1d763220fab42ddc/-473Wx593H-467307673-beige-MODEL.jpg',
    'https://veshbhoshaa.com/cdn/shop/files/bluebird-mens-khaki-textured-formal-trousers-302530.jpg?v=1734424642',
    'https://pantproject.com/cdn/shop/files/DSC08312_161672ba-8421-4333-aca1-d1cc71449f40.jpg?v=1750795834&width=1200',
    'https://imagescdn.louisphilippe.com/img/app/product/3/39751463-15830694.jpg?auto=format&w=390',
    'https://imagescdn.louisphilippe.com/img/app/product/3/39724929-15038226.jpg',
    'https://pantproject.com/cdn/shop/files/DSC1045_6474c1f4-97e1-46ce-b7c1-1442379f84b6.jpg?v=1743609329&width=1200',
    'https://pantproject.com/cdn/shop/files/DSC8633.jpg?v=1737539834&width=1200',
    'https://www.urbanofashion.com/cdn/shop/files/chinoreg-brown-1.jpg?v=1779367054',
    'https://pantproject.com/cdn/shop/files/front_view_close-up_of_Pant_Project_olive_green_stretchable_trousers.jpg?v=1726636678&width=1200',
    'https://www.urbanofashion.com/cdn/shop/files/epnchino-29-white-1_ffb56a78-9d03-4c85-8676-36f336ec6cd0.jpg?v=1763461288',
    'https://pantproject.com/cdn/shop/files/DSC8305__2.jpg?v=1751604188&width=1200',
    'https://www.urbanofashion.com/cdn/shop/files/epnchino-24-wine-1_b7ef6f01-c3cc-4b75-b063-c209ffba12fe.jpg?v=1743770667',
    'https://imagescdn.louisphilippe.com/img/app/product/3/39751463-15830694.jpg?auto=format&w=390'
  ],
  pajamas: [
    'https://m.media-amazon.com/images/I/81Z-tt+JJdL._AC_UY1100_.jpg',
    'https://m.media-amazon.com/images/I/81D8MlwxSpL._AC_UY1100_.jpg',
    'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/23098476/2025/4/23/81ca3ccf-7200-435a-b614-aec4e6ad15531745397730859-Bewakoof-Men-Pure-Cotton-All-Over-Printed-Lounge-Pants-21917-1.jpg',
    'https://www.thekaftancompany.com/cdn/shop/files/the-kaftan-company-pyjama-set-mens-rust-striped-pyjama-set-1016288015.jpg?v=1746997298&width=1500',
    'https://m.media-amazon.com/images/I/71wI62VXfwL._AC_UY1100_.jpg',
    'https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/17142172/2022/4/22/1a0c03f0-2675-4ee5-a18e-c5983294c99a1650629498521-Hancock-Men-Maroon--White-Striped-Night-suit-541165062949781-1.jpg',
    'https://myraymond.com/cdn/shop/files/AHYA00011-B8_1.jpg?v=1735022699',
    'https://brownliving.in/cdn/shop/files/mens-lounge-pant-grey-fits-waist-size-28-to-36-at01013-hope-house-of-pure-eco-1036537.png?v=1758584023&width=1200',
    'https://m.media-amazon.com/images/I/81yr+L8MpAL._AC_UY1100_.jpg',
    'https://www.nabia.in/cdn/shop/files/1_5721dfd0-7e31-48fa-903d-c99fa75915d3.jpg?v=1718020389',
    'https://m.media-amazon.com/images/I/A1ad-adiDOL._AC_UY1100_.jpg',
    'https://sojanya.com/cdn/shop/files/V-SJR-LK-NwJacq-25001-Tblue-Pyj-001-1.jpg?v=1751286554',
    'https://delrossa.com/cdn/shop/files/2023update_2_a0752blk_lifestyle1_2048x.jpg?v=1745426957'
  ],
  makeup: [
    'https://m.media-amazon.com/images/I/61FrlXJ53vL._AC_UF1000,1000_QL80_.jpg',
    'https://sagansinghmakeup.in/cdn/shop/files/WhatsAppImage2024-05-30at16.16.11_7e753ddc.jpg?v=1717066031&width=1290',
    'https://images.meesho.com/images/products/612473235/jmj12_512.webp?width=512',
    'https://images-static.nykaa.com/media/catalog/product/0/8/0843f1eMORAB00000271_1.jpg?tr=w-500',
    'https://images-static.nykaa.com/media/catalog/product/a/4/a48cdef800897813710-new_08.jpg?tr=w-500',
    'https://makeupempire.in/cdn/shop/files/71QdiaNBd0L._SL1024_1120x.jpg?v=1770031074',
    'https://m.media-amazon.com/images/I/61kvtc30HWL.jpg',
    'https://m.media-amazon.com/images/I/81MkouPvWiL.jpg',
    'https://img.tatacliq.com/images/i7/437Wx649H/MP000000010959048_437Wx649H_202110201235251.jpeg',
    'https://m.media-amazon.com/images/I/51RvkMwlR5L.jpg',
    'https://www.thenaturalwash.com/cdn/shop/files/bbcream-cmpr.jpg?v=1770036052',
    'https://www.westman-atelier.com/cdn/shop/files/Duo_SuedeSable.jpg?format=pjpg&v=1742311496&width=1200',
    'https://www.paccosmetics.com/cdn/shop/files/8904341209028_IMG.main.jpg?v=1746616360',
    'https://insightcosmetics.in/cdn/shop/files/TranslucentPowder-06.jpg?v=1759755202',
    'https://majestique.in/cdn/shop/files/1_31a09745-6c0d-4738-a9eb-7cf7c3e850fd.jpg?v=1731820596',
    'https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/anastasia-beverly-hills/7014307/0/6O8dvCY301-1_Product_689304484022_Shimmer_Body_Oil_45ml_c9e259a7f32c8391bed2d16a78b6d988ad8e364a_1559815731.png',
    'https://m.media-amazon.com/images/I/51yLHjuMGSL._AC_UF1000,1000_QL80_.jpg',
    'https://makeupempire.in/cdn/shop/files/WhatsAppImage2024-05-21at11.09.52AM_1120x.jpg?v=1718343155',
    'https://www.reneecosmetics.in/cdn/shop/files/PrincessByReneeRoyalShineLipGlossSetPI.jpg?v=1767768234&width=1445',
    'https://suroskie.com/cdn/shop/files/6_b82b1536-70fd-4d66-b777-db5488bcf21c.png?v=1747123339&width=1445'
  ],
  womensDresses: [
    'https://static.cilory.com/792931-thickbox_default/women-floral-printed-fit-n-flared-midi-dress.jpg.webp',
    'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/2025/APRIL/23/vGGPZPi3_218d5965e97a4d80b0d8df8e9b0e2795.jpg',
    'https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/31123237/2025/5/5/2e2f93dd-6de6-4a3b-9c7b-ca92c471c9d61746437606737-DressBerry-Floral-Print-Puff-Sleeve-A-Line-Mini-Dress-301174-1.jpg',
    'https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2025/APRIL/24/ZgpGr0mc_39d3218774514f76a20e9cf445ee4b4f.jpg',
    'https://slipintosoft.com/cdn/shop/files/women-silk-slip-dress-wide-strap-v-neck-pure-silk-nightgown-dress-695896.jpg?v=1724323919',
    'https://diamondlady.in/cdn/shop/files/DC6634AD-9D64-4AC9-A19F-FA67A5BEB3F9.jpg?v=1729608896',
    'https://www.vastranand.in/cdn/shop/files/3_eed99c90-6ece-4820-8bde-486a16193b68.jpg?v=1743074411',
    'https://stylequotient.co.in/cdn/shop/files/AW24SQDIXIE_TAN-1.jpg?v=1729243588',
    'https://ambraee.com/cdn/shop/files/JBL07923-Recovered.jpg?v=1736702417',
    'https://srstore.in/cdn/shop/files/generated-image_84838d3e-d8e0-4644-ba0a-cbde2ff3d1b3.png',
    'https://sassafras.in/cdn/shop/products/SFDRSS11148-1_1800x.jpg?v=1757499137',
    'https://i.etsystatic.com/17481564/r/il/95700d/5832941034/il_fullxfull.5832941034_qnb3.jpg',
    'https://sassafras.in/cdn/shop/files/SFDRSS12066-Black-6_2793ec5d-2e33-4f03-a6d3-26e87c053997_1800x.jpg?v=1757493432',
    'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/19798096/2022/9/10/308c3f22-3c1e-40b1-87cd-acae310f51431662805481445-Roadster-Women-Maroon-Cable-Knit-Sweater-Dress-7831662805480-1.jpg',
    'https://www.lulus.com/images/product/xlarge/11876101_1907036.jpg?w=375&hdpi=1',
    'https://aayuwear.com/cdn/shop/files/s-aa-00231-black-aayu-original-imagz2ayzmp2g5ba.jpg?v=1717400738&width=1445',
    'https://diamondlady.in/cdn/shop/files/440B7336-1F5C-4DBC-9A2D-05D1EF9B8E41.jpg?v=1761303126',
    'https://cdn.shopify.com/s/files/1/0861/3294/9292/files/rn-image_picker_lib_temp_17a7bec7-3413-43e1-9516-f22f26a63dec.jpg?v=1707561905',
    'https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/29505810/2024/5/13/2588b2ce-230f-474e-9ceb-4f22bce2ad961715586988364STREET9LaceBodyconDress1.jpg',
    'https://www.alonge.in/cdn/shop/files/Front_8ce64876-dc0b-4650-b046-91f16f39294d_2048x.jpg?v=1712325821'
  ]
};

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const colorOptions = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Blue', hex: '#1E3A5F' },
  { name: 'Beige', hex: '#F5F0E1' },
  { name: 'Red', hex: '#8B0000' },
  { name: 'Green', hex: '#2D5A27' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Nude', hex: '#E8C9B6' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Plum', hex: '#7B3F5C' },
  { name: 'Teal', hex: '#008080' }
];

const categories = {
  'Casual Shirts': { count: 15, images: productImages.shirts, trendingCount: 7 },
  'Polo T-Shirts': { count: 15, images: productImages.polos, trendingCount: 7 },
  'Kurtas': { count: 15, images: productImages.kurtas, trendingCount: 7 },
  'Trousers': { count: 15, images: productImages.trousers, trendingCount: 5 },
  'Pajamas': { count: 15, images: productImages.pajamas, trendingCount: 0 },
  'Makeup': { count: 15, images: productImages.makeup, trendingCount: 10 },
  "Women's Dresses": { count: 20, images: productImages.womensDresses, trendingCount: 14 }
};

const shirtNames = [
  'Men Slim Fit Casual Shirt', 'Men Regular Fit Formal Shirt', 'Men Cotton Linen Shirt',
  'Men Checkered Casual Shirt', 'Men Striped Formal Shirt', 'Men Solid Oxford Shirt',
  'Men Denim Casual Shirt', 'Men Printed Casual Shirt', 'Men White Formal Shirt',
  'Men Beige Slim Fit Shirt', 'Men Blue Regular Shirt', 'Men Black Casual Shirt',
  'Men Maroon Check Shirt', 'Men Green Linen Shirt', 'Men Navy Blue Shirt',
  'Men Olive Green Shirt', 'Men Red Striped Shirt', 'Men Off White Shirt',
  'Men Light Blue Shirt', 'Men Charcoal Grey Shirt', 'Men Mustard Yellow Shirt',
  'Men Pink Casual Shirt', 'Men Lavender Formal Shirt', 'Men Teal Blue Shirt',
  'Men Brown Check Shirt', 'Men Mauve Casual Shirt', 'Men Indigo Shirt',
  'Men Cream Linen Shirt', 'Men Rust Red Shirt', 'Men Classic White Shirt',
  'Men Cotton Poplin Shirt', 'Men Linen Blend Shirt', 'Men Button Down Shirt',
  'Men Cuban Collar Shirt', 'Men Seersucker Shirt'
];

const poloNames = [
  'Men Slim Fit Polo T-Shirt', 'Men Regular Fit Polo', 'Men Cotton Pique Polo',
  'Men Striped Polo T-Shirt', 'Men Solid Performance Polo', 'Men Printed Polo Shirt',
  'Men Navy Blue Polo', 'Men Black Polo T-Shirt', 'Men White Casual Polo',
  'Men Red Sports Polo', 'Men Green Polo Shirt', 'Men Grey Melange Polo',
  'Men Maroon Polo T-Shirt', 'Men Blue Striped Polo', 'Men Olive Green Polo',
  'Men Mustard Polo', 'Men Pink Polo Shirt', 'Men Teal Blue Polo',
  'Men Charcoal Black Polo', 'Men Classic Fit Polo',
  'Men Contrast Collar Polo', 'Men Slim Stripe Polo', 'Men Tennis Polo',
  'Men Golf Performance Polo', 'Men Vintage Washed Polo'
];

const kurtaNames = [
  'Men Cotton Straight Kurta', 'Men Pathani Style Kurta', 'Men Printed Ethnic Kurta',
  'Men Solid Cotton Kurta', 'Men White Wedding Kurta', 'Men Black Embroidered Kurta',
  'Men Beige Casual Kurta', 'Men Maroon Festival Kurta', 'Men Navy Blue Kurta',
  'Men Green Silk Kurta', 'Men Off White Kurta', 'Men Grey Pathani Kurta',
  'Men Brown Cotton Kurta', 'Men Cream Handloom Kurta', 'Men Red Wedding Kurta',
  'Men Blue Printed Kurta', 'Men Mustard Kurta', 'Men Pink Festive Kurta',
  'Men Purple Silk Kurta', 'Men Classic White Kurta',
  'Men Cotton Dhoti Kurta', 'Men Asymmetrical Kurta', 'Men Layered Kurta',
  'Men Angrakha Kurta', 'Men Linen Kurta'
];

const trouserNames = [
  'Men Slim Fit Trousers', 'Men Regular Fit Trousers', 'Men Cotton Chinos',
  'Men Formal Trousers', 'Men Stretchable Trousers', 'Men Beige Casual Trousers',
  'Men Black Formal Pants', 'Men Navy Blue Trousers', 'Men Grey Office Trousers',
  'Men Brown Chinos', 'Men Olive Green Trousers', 'Men White Casual Pants',
  'Men Charcoal Grey Trousers', 'Men Maroon Chinos', 'Men Tan Trousers'
];

const pajamaNames = [
  'Men Cotton Pajamas', 'Men Silk Pajamas', 'Men Casual Lounge Pajamas',
  'Men Cotton Straight Pajamas', 'Men Kurta Pajama Set', 'Men White Cotton Pajamas',
  'Men Black Silk Pajamas', 'Men Grey Lounge Pants', 'Men Navy Blue Pajamas',
  'Men Maroon Cotton Pajamas', 'Men Beige Casual Pajamas', 'Men Striped Pajamas',
  'Men Printed Lounge Pants', 'Men Solid Cotton Pajamas', 'Men Classic Comfort Pajamas'
];

const makeupNames = [
  'Matte Liquid Lipstick', 'Full Coverage Foundation', 'Volumizing Mascara',
  'Eyebrow Micro Pencil', 'Setting Spray Matte Finish', 'Highlighting Palette',
  'Contour Stick Kit', 'Nude Eyeshadow Palette', 'Long Wear Eyeliner',
  'Hydrating Primer', 'BB Cream SPF 30', 'Blush Duo Powder',
  'Lip Liner Pencil Set', 'Translucent Loose Powder', 'Makeup Sponge Set',
  'Shimmer Body Oil', 'Matte Bronzer Powder', 'Concealer Full Coverage',
  'Lip Gloss Set', 'Face Mist Hydrating'
];

const womensDressNames = [
  'Women Floral Midi Dress', 'Women Bodycon Dress', 'Women A-Line Mini Dress',
  'Women Wrap Dress', 'Women Slip Dress Silk', 'Women Off Shoulder Dress',
  'Women Maxi Dress Printed', 'Women Shirt Dress', 'Women Tiered Mini Dress',
  'Women Ribbed Knit Dress', 'Women Smocked Midi Dress', 'Women Denim Dress',
  'Women Halter Neck Dress', 'Women Sweater Dress', 'Women Plaid Mini Dress',
  'Women Asymmetric Dress', 'Women Ruffle Dress', 'Women Tunic Dress',
  'Women Lace Bodycon Dress', 'Women Shift Dress'
];

const nameMap = {
  'Casual Shirts': shirtNames,
  'Polo T-Shirts': poloNames,
  'Kurtas': kurtaNames,
  'Trousers': trouserNames,
  'Pajamas': pajamaNames,
  'Makeup': makeupNames,
  "Women's Dresses": womensDressNames
};

const descriptions = [
  'Crafted from premium quality fabric for all-day comfort. Features a modern fit with attention to detail.',
  'Designed for the contemporary man. Breathable fabric with a tailored silhouette for a sharp look.',
  'Elevate your wardrobe with this versatile piece. Made from soft, breathable material with excellent durability.',
  'Perfect for any occasion. Features a classic design with modern finishing for a sophisticated appearance.',
  'Experience unmatched comfort with our premium fabric blend. Designed to keep you looking sharp all day.'
];

const tags = ['best-seller', 'new-arrival', 'summer-special', 'limited-edition', 'festival-pick', 'trending-now', 'editors-choice'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const adminPassword = 'admin123';
    const userPassword = 'user123';

    const admin1 = await User.create({ name: 'Admin Velore', email: 'alonesurvivor03@gmail.com', phone: '9876543210', password: '123456', role: 'admin' });
    const admin2 = await User.create({ name: 'Super Admin', email: 'superadmin@velore.in', phone: '9876543211', password: adminPassword, role: 'admin' });
    const user1 = await User.create({ name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543212', password: userPassword });
    const user2 = await User.create({ name: 'Priya Patel', email: 'priya@example.com', phone: '9876543213', password: userPassword });
    const user3 = await User.create({ name: 'Amit Singh', email: 'amit@example.com', phone: '9876543214', password: userPassword });

    console.log('Users created');

    let productIndex = 0;
    const allProducts = [];
    const trendingCounts = {};

    for (const [category, config] of Object.entries(categories)) {
      trendingCounts[category] = 0;
      const names = nameMap[category];
      for (let i = 0; i < config.count; i++) {
        const name = names[i % names.length];
        const price = Math.floor(Math.random() * 2500) + 399;
        const discountPercent = [0, 11, 15, 20, 25, 30, 40, 50, 60, 70][Math.floor(Math.random() * 10)];
        const productColors = [colorOptions[Math.floor(Math.random() * 8)]];
        if (Math.random() > 0.5) productColors.push(colorOptions[Math.floor(Math.random() * 8)]);

        const productTags = [];
        if (productIndex < 50) productTags.push('best-seller');
        if (Math.random() > 0.6) productTags.push(tags[Math.floor(Math.random() * tags.length)]);
        if (Math.random() > 0.7) productTags.push(tags[Math.floor(Math.random() * tags.length)]);

        const productSizes = shuffle(sizeOptions).slice(0, Math.floor(Math.random() * 4) + 3).map(s => ({
          size: s,
          stock: Math.floor(Math.random() * 50) + 5
        }));

        const availImages = config.images;
        const images = [
          availImages[i % availImages.length],
          availImages[(i + 1) % availImages.length]
        ].filter(Boolean);

        const lookOptions = ['casual', 'formal', 'ethnic', 'streetwear'];
        let look = '';
        if (category === 'Casual Shirts') look = 'casual';
        else if (category === 'Polo T-Shirts') look = 'casual';
        else if (category === 'Kurtas') look = 'ethnic';
        else if (category === 'Trousers') look = 'formal';
        else if (category === 'Pajamas') look = 'casual';
        else if (category === 'Makeup') look = 'beauty';
        else if (category === "Women's Dresses") look = 'womenswear';

        const isTrending = trendingCounts[category] < config.trendingCount;
        if (isTrending) trendingCounts[category]++;

        const fitOptions = ['Slim', 'Regular', 'Relaxed', 'Oversized'];
        const fit = fitOptions[Math.floor(Math.random() * fitOptions.length)];

        const product = await Product.create({
          name: `${name} - ${i + 1}`,
          category,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          images,
          price,
          discountPercent,
          colors: productColors,
          sizes: productSizes,
          fit,
          tags: productTags,
          look,
          isTrending,
          isNewArrival: Math.random() > 0.7,
          rating: (Math.random() * 1.5 + 3).toFixed(1) * 1,
          reviewCount: Math.floor(Math.random() * 500) + 10
        });

        allProducts.push(product);
        productIndex++;
      }
    }

    const fitProductImages = {
      'Slim Fit Stretch Chinos': 'https://www.subtract.in/cdn/shop/files/SUBCT002-BEIGE-32_1.jpg?v=1754677741',
      'Slim Fit Formal Shirt': 'https://www.hancockfashion.com/cdn/shop/products/d52c7f62-b9ef-4115-bb71-26309a21c0581659093912838-Hancock-Men-Shirts-8151659093912069-1.jpg?v=1734413177',
      'Slim Fit Casual Blazer': 'https://successmenswear.com/cdn/shop/files/B_9dc434a4-bdc7-4bbf-a785-99e83f92348f.jpg?v=1765432121',
      'Slim Fit Dark Jeans': 'https://www.urbanofashion.com/cdn/shop/files/23748858-1.jpg?v=1760604234',
      'Slim Fit Cotton Polo': 'https://cdn02.nnnow.com/web-images/large/styles/LZQ8B04OJWK/1745389028586/1.jpg',
      'Regular Fit Cargo Pants': 'https://www.urbanofashion.com/cdn/shop/files/chicargo-06-olivegrn-1_b28138b3-092b-4194-9841-98d464b12e7b.jpg?v=1763198542',
      'Regular Fit Casual Shirt': 'https://cottonworld.net/cdn/shop/files/M-SHIRTS-50015-21303-BLACK_1.jpg?v=1753678260',
      'Regular Fit Denim Jacket': 'https://www.richlook.in/cdn/shop/files/img_212.jpg?v=1765954650',
      'Regular Fit Sweatshirt': 'https://veirdo.in/cdn/shop/files/VSS0423BKPL09.jpg?v=1765625274',
      'Regular Fit Chino Shorts': 'https://assets.digitalcontent.marksandspencer.app/image/upload/w_600,h_780,q_auto,f_auto,e_sharpen/SD_03_T17_6017M_Y4_X_EC_0',
      'Relaxed Fit Linen Shirt': 'https://levi.in/cdn/shop/files/006DF0000_01_Styleshot.jpg?v=1777893282',
      'Relaxed Fit Joggers': 'https://nobero.com/cdn/shop/files/BLACK_72b44034-e1eb-4afb-bbda-d634897588f5.jpg?v=1772788068',
      'Relaxed Fit Hoodie': 'https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2026/FEBRUARY/3/Xs2UE6Zf_801763213b38426893a0fee7b3a1834a.jpg',
      'Relaxed Fit Cargo Shorts': 'https://d1pdzcnm6xgxlz.cloudfront.net/bottoms/8905875668701-9.jpg',
      'Relaxed Fit Track Pants': 'https://www.bonkerscorner.com/cdn/shop/files/black-faded-loose-fit-pants-xs-bonkerscorner-store-33695383453796_0bd1bf59-8f87-42e3-ac11-a3526f975a2a.jpg?v=1773818985',
      'Oversized Graphic Tee': 'https://veirdo.in/cdn/shop/files/Artboard_8_30.jpg?v=1758348679',
      'Oversized Bomber Jacket': 'https://cdn.mos.cms.futurecdn.net/whowhatwear/posts/302497/best-oversized-bomber-jackets-302497-1663379812607-square.jpg',
      'Oversized Hoodie': 'https://nobero.com/cdn/shop/files/222C021C-8EFF-4A86-A782-A25876663738.jpg?v=1732879745',
      'Oversized Wool Sweater': 'https://www.lenversfashion.com/cdn/shop/files/STEPHANIEMERINOCHOCOLATEAW249-min.jpg?v=1748259075&width=2048',
      'Oversized Flannel Shirt': 'https://www.bonkerscorner.com/cdn/shop/files/Bonkerscorner_green_plaid_flannel_oversized_shirt_04.jpg?v=1720171860'
    };

    const fitSpecificProducts = [
      { name: 'Slim Fit Stretch Chinos', fit: 'Slim', category: 'Trousers' },
      { name: 'Slim Fit Formal Shirt', fit: 'Slim', category: 'Casual Shirts' },
      { name: 'Slim Fit Casual Blazer', fit: 'Slim', category: 'Trousers' },
      { name: 'Slim Fit Dark Jeans', fit: 'Slim', category: 'Trousers' },
      { name: 'Slim Fit Cotton Polo', fit: 'Slim', category: 'Polo T-Shirts' },
      { name: 'Regular Fit Cargo Pants', fit: 'Regular', category: 'Trousers' },
      { name: 'Regular Fit Casual Shirt', fit: 'Regular', category: 'Casual Shirts' },
      { name: 'Regular Fit Denim Jacket', fit: 'Regular', category: 'Casual Shirts' },
      { name: 'Regular Fit Sweatshirt', fit: 'Regular', category: 'Pajamas' },
      { name: 'Regular Fit Chino Shorts', fit: 'Regular', category: 'Trousers' },
      { name: 'Relaxed Fit Linen Shirt', fit: 'Relaxed', category: 'Casual Shirts' },
      { name: 'Relaxed Fit Joggers', fit: 'Relaxed', category: 'Pajamas' },
      { name: 'Relaxed Fit Hoodie', fit: 'Relaxed', category: 'Pajamas' },
      { name: 'Relaxed Fit Cargo Shorts', fit: 'Relaxed', category: 'Trousers' },
      { name: 'Relaxed Fit Track Pants', fit: 'Relaxed', category: 'Pajamas' },
      { name: 'Oversized Graphic Tee', fit: 'Oversized', category: 'Polo T-Shirts' },
      { name: 'Oversized Bomber Jacket', fit: 'Oversized', category: 'Casual Shirts' },
      { name: 'Oversized Hoodie', fit: 'Oversized', category: 'Pajamas' },
      { name: 'Oversized Wool Sweater', fit: 'Oversized', category: 'Pajamas' },
      { name: 'Oversized Flannel Shirt', fit: 'Oversized', category: 'Casual Shirts' }
    ];

    for (const item of fitSpecificProducts) {
      const price = Math.floor(Math.random() * 2000) + 599;
      const discountPercent = [0, 11, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 8)];
      const productColors = [colorOptions[Math.floor(Math.random() * 8)]];
      if (Math.random() > 0.5) productColors.push(colorOptions[Math.floor(Math.random() * 8)]);

      const productSizes = shuffle(sizeOptions).slice(0, Math.floor(Math.random() * 4) + 3).map(s => ({
        size: s,
        stock: Math.floor(Math.random() * 50) + 5
      }));

      const imgUrl = fitProductImages[item.name];
      const images = [imgUrl, imgUrl];

      let look = '';
      if (item.category === 'Casual Shirts' || item.category === 'Polo T-Shirts') look = 'casual';
      else if (item.category === 'Trousers') look = 'formal';
      else if (item.category === 'Pajamas') look = 'casual';

      const product = await Product.create({
        name: `${item.name}`,
        category: item.category,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        images,
        price,
        discountPercent,
        colors: productColors,
        sizes: productSizes,
        fit: item.fit,
        tags: ['new-arrival', 'trending-now'],
        look,
        isTrending: false,
        isNewArrival: true,
        rating: (Math.random() * 1 + 4).toFixed(1) * 1,
        reviewCount: Math.floor(Math.random() * 200) + 5
      });

      allProducts.push(product);
      productIndex++;
    }

    console.log(`${allProducts.length} products created`);

    const orders = [];
    const orderStatuses = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const users = [user1, user2, user3];

    for (let i = 0; i < 10; i++) {
      const user = users[i % 3];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        const price = product.discountedPrice;
        items.push({
          product: product._id,
          name: product.name,
          image: product.images[0],
          size: product.sizes[0]?.size || 'M',
          color: product.colors[0]?.name || 'Black',
          quantity: qty,
          price
        });
        subtotal += price * qty;
      }

      const statusIndex = Math.min(i, orderStatuses.length - 1);
      const status = orderStatuses[statusIndex];
      const statusHistory = orderStatuses.slice(0, statusIndex + 1).map(s => ({
        status: s,
        timestamp: new Date(Date.now() - (orderStatuses.length - statusIndex) * 86400000 + orderStatuses.indexOf(s) * 86400000)
      }));

      const year = 2025;
      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();

      await Order.create({
        user: user._id,
        items,
        address: {
          name: user.name,
          phone: user.phone,
          line1: '123 Main Street',
          line2: 'Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        subtotal,
        shippingCost: subtotal > 999 ? 0 : 49,
        discount: Math.random() > 0.5 ? Math.round(subtotal * 0.11) : 0,
        total: subtotal + (subtotal > 999 ? 0 : 49) - (Math.random() > 0.5 ? Math.round(subtotal * 0.11) : 0),
        paymentIntentId: `pi_test_${Math.random().toString(36).substring(2, 15)}`,
        paymentStatus: 'paid',
        status,
        trackingId: `VLR-${year}-${randomStr}`,
        statusHistory,
        mobile: user.phone,
        email: user.email
      });
    }

    console.log('10 orders created');
    console.log('Seed completed successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin: alonesurvivor03@gmail.com / 123456');
    console.log('User: rahul@example.com / user123');
    console.log('User: priya@example.com / user123');
    console.log('User: amit@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
