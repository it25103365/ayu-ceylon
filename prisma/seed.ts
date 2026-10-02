import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting Ayu Ceylon database seed...");

  // 1. Seed Owner Admin Account from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ayuceylon.lk";
  const adminPassword = process.env.ADMIN_PASSWORD || "AyuCeylon@Admin2026";
  const adminName = process.env.ADMIN_NAME || "Gampaha Wedaarachchi (Ayu Ceylon Owner)";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "ADMIN",
    },
  });

  console.log(`✅ Seeded Admin Account: ${admin.email}`);

  // 2. Seed Ayurvedic Medicines with authentic Sinhala details
  const medicines = [
    {
      nameSi: "සිද්ධාර්ථ තෛලය",
      nameEn: "Siddhartha Oil (200ml)",
      slug: "siddhartha-oil-200ml",
      category: "තෙල් වර්ග (Oils)",
      price: 850,
      stock: 45,
      descriptionSi: "හිසරදය, පීනස, අර්ධ ශීර්ෂය, නින්ද නොයාම, ගෙල සහ උරහිස් වේදනාව සඳහා විශේෂිත පුරාණ ආයුර්වේද ඖෂධීය තෛලයකි. ශරීරයට සිසිලස ලබාදෙයි.",
      descriptionEn: "Classical Ayurvedic herbal oil formulated for relieving severe headaches, chronic sinusitis, cervical neck stiffness, and promoting deep restful sleep.",
      ingredientsSi: "සුවඳ කොට්ටං, එලබටු මුල්, තිප්පිලි, කළුදුරු, සුවඳහල්, සහ පිරිසිදු තල තෙල් අඩංගුයි.",
      ingredientsEn: "Costus root, Solanum xanthocarpum, Piper longum, Black seed, aromatic herbs infused in pure virgin sesame oil base.",
      usageSi: "හිසකෙස් මුල්වලට හෝ වේදනාකාරී ස්ථානවලට ආලේප කර මෘදුව සම්බාහනය කර විනාඩි 30කට පසු සෝදා හරින්න.",
      usageEn: "Gently massage onto scalp or affected painful areas. Leave on for at least 30 minutes before washing with lukewarm herbal water.",
      imageUrl: "/medicines/siddhartha-oil.jpg",
      featured: true,
    },
    {
      nameSi: "නීල්‍යාදී තෛලය",
      nameEn: "Neelyadi Hair & Scalp Oil (200ml)",
      slug: "neelyadi-oil-200ml",
      category: "තෙල් වර්ග (Oils)",
      price: 920,
      stock: 38,
      descriptionSi: "අකලට හිසකෙස් පැසීම, හිසකෙස් ගැලවී යාම වැළැක්වීමට සහ හිසකෙස් ඝනව වැවීමට උපකාරී වන ප්‍රකට පාරම්පරික තෛලයකි.",
      descriptionEn: "Renowned traditional herbal hair elixir for curbing premature greying, halting excessive hair thinning, and revitalizing roots.",
      ingredientsSi: "අවරිය (නීලී), ගොටුකොළ, කීකිරිඳිය, මුකුණුවැන්න සහ පිරිසිදු තල තෙල්.",
      ingredientsEn: "Indigofera tinctoria (Neeli), Gotukola, Eclipta alba (Keekirindiya), Alternanthera sessilis with pure virgin sesame oil.",
      usageSi: "දිනපතා රාත්‍රියේ හිස්කබල මත ගල්වා සියුම්ව සම්බාහනය කරන්න.",
      usageEn: "Apply evenly across scalp at bedtime and massage gently in circular motions.",
      imageUrl: "/medicines/neelyadi-oil.jpg",
      featured: true,
    },
    {
      nameSi: "සුවිශේෂී පස්පංගුව පැකට්ටුව",
      nameEn: "Special Paspanguwa Herbal Blend (100g)",
      slug: "special-paspanguwa-100g",
      category: "පස්පංගුව සහ තේ (Herbal Infusions)",
      price: 350,
      stock: 120,
      descriptionSi: "සෙම්ප්‍රතිශ්‍යාව, උණ, ඇඟපත වේදනාව, හිසරදය සහ කැස්ස සමනය කර ප්‍රතිශක්තිය වඩවන සාම්ප්‍රදායික ඖෂධ 5ක පිරිසිදු මිශ්‍රණයකි.",
      descriptionEn: "The quintessential Sri Lankan five-herb remedy that relieves seasonal chills, fever, muscle aches, catarrh, and stimulates innate immunity.",
      ingredientsSi: "කොත්තමල්ලි, වියළි ඉඟුරු, කටුවැල්බටු, පත්පාඩගම්, තිප්පිලි.",
      ingredientsEn: "Coriandrum sativum (Coriander), Zingiber officinale (Ginger), Solanum surattense, Mollugo cerviana, Piper longum.",
      usageSi: "පැකට්ටුවේ අඩංගු ඖෂධ වතුර කෝප්ප 4ක් දමා කෝප්ප 1ක් වනතුරු තම්බා උණුසුම්ව පානය කරන්න. සීනි හෝ මී පැණි ස්වල්පයක් එක් කළ හැක.",
      usageEn: "Boil contents in 4 cups of fresh water until reduced to 1 concentrated cup. Strain and drink hot with pure bee honey or jaggery.",
      imageUrl: "/branding/user_brand_poster.jpg",
      featured: true,
    },
    {
      nameSi: "ආඩතෝඩා කැස්ස පැණිය",
      nameEn: "Adhatoda Herbal Cough Syrup (150ml)",
      slug: "adhatoda-cough-syrup-150ml",
      category: "පැණි වර්ග (Syrups)",
      price: 680,
      stock: 50,
      descriptionSi: "වියළි කැස්ස, සෙම සහිත කැස්ස, උගුරේ අමාරුව සහ පපුවේ සෙම තදවීම දුරලන 100% ස්වභාවික ඖෂධීය පැණියකි. නිදිබර ගතියක් ඇති නොකරයි.",
      descriptionEn: "100% all-natural botanical cough syrup soothing dry cough, throat irritation, phlegm congestion and bronchodilating without drowsiness.",
      ingredientsSi: "ආඩතෝඩා යුෂ, තිප්පිලි, වැල්මී, පිරිසිදු මී පැණි, ඉඟුරු යුෂ.",
      ingredientsEn: "Adhatoda vasica leaf extracts, Glycyrrhiza glabra (Licorice), Piper longum, natural raw bee honey, ginger extract.",
      usageSi: "වැඩිහිටියන්ට: මේස හැඳි 1 බැගින් දිනකට 3 වරක් කෑමට පසු. ළමුන්ට: තේ හැඳි 1 බැගින් දිනකට 2 වරක්.",
      usageEn: "Adults: 1 tablespoon 3 times daily after meals. Children: 1 teaspoon twice daily.",
      imageUrl: "/medicines/siddhartha-oil.jpg",
      featured: true,
    },
    {
      nameSi: "ත්‍රිපලා චූර්ණය",
      nameEn: "Triphala Rejuvenating Churna (150g)",
      slug: "triphala-churna-150g",
      category: "චූර්ණ සහ කුඩු (Powders)",
      price: 580,
      stock: 65,
      descriptionSi: "ආහාර ජීර්ණය පහසු කරන, මළබද්ධය දුරලන, අක්මාව සහ රුධිරය පිරිසිදු කර ප්‍රතිශක්තිය සහ දිගු ආයුෂ ලබාදෙන ත්‍රිවිධ ඵල චූර්ණය.",
      descriptionEn: "Ancient Ayurvedic formulation of three potent fruits for digestive equilibrium, gentle internal detox, colon cleansing, and cellular rejuvenation.",
      ingredientsSi: "අරළු, බුළු, නෙල්ලි සම සමව ගෙන කුඩු කරන ලදී.",
      ingredientsEn: "Terminalia chebula (Haritaki/Aralu), Terminalia bellirica (Bibhitaki/Bulu), Phyllanthus emblica (Amalaki/Nelli).",
      usageSi: "රාත්‍රී නින්දට පෙර තේ හැඳි 1ක් උණුසුම් වතුර හෝ මී පැණි සමඟ මිශ්‍ර කර පානය කරන්න.",
      usageEn: "Mix 1 teaspoon with lukewarm water or bee honey, consume at bedtime.",
      imageUrl: "/medicines/hero-banner.jpg",
      featured: true,
    },
    {
      nameSi: "සුවඳ කොට්ටං මුහුණු ආලේපනය",
      nameEn: "Suwanda Kottan Glow Herb Pack (100g)",
      slug: "suwanda-kottan-glow-pack-100g",
      category: "ආලේපන සහ ක්‍රීම් (Balms & Pastes)",
      price: 750,
      stock: 40,
      descriptionSi: "සමේ ලප කැළැල්, කුරුලෑ ලප මකා මුහුණට දීප්තිමත් රන්වන් පැහැයක් සහ තරුණ බවක් ගෙන දෙන පාරම්පරික රාජකීය ඖෂධ සත්කාරයකි.",
      descriptionEn: "Royal complexion enhancing botanical face pack that diminishes blemishes, soothes breakouts, and bestows a radiant golden luminescence.",
      ingredientsSi: "සුවඳ කොට්ටං, රත් හඳුන්, සුදු හඳුන්, වෙනිවැල්ගැට, කොහොඹ, කස්තුරි කහ.",
      ingredientsEn: "Saussurea lappa (Suwanda Kottan), Red Sandalwood, White Sandalwood, Coscinium fenestratum, Neem, Kasturi Turmeric.",
      usageSi: "ස්වල්පයක් රෝස වතුර හෝ යෝගට් සමඟ මිශ්‍ර කර මුහුණේ ආලේප කර විනාඩි 20කින් මඳ උණුසුම් ජලයෙන් සෝදා හරින්න.",
      usageEn: "Mix paste with rosewater or yoghurt, apply over face, allow to dry for 20 minutes, then rinse gently.",
      imageUrl: "/branding/mockup_reference.jpg",
      featured: true,
    },
    {
      nameSi: "සර්ෂපාදී තෛලය",
      nameEn: "Sarshapadi Pain Relief Oil (150ml)",
      slug: "sarshapadi-oil-150ml",
      category: "තෙල් වර්ග (Oils)",
      price: 780,
      stock: 30,
      descriptionSi: "සන්ධි වේදනා, වාත වේදනා, කොන්දේ කැක්කුම සහ මාංශපේශී තදවීම් වලට ක්ෂණික සුවය ගෙන දෙන ප්‍රබල සම්බාහන තෛලයකි.",
      descriptionEn: "Deeply penetrating warming herbal oil designed for quick alleviation of joint stiffness, backache, arthritic discomfort, and muscle cramps.",
      ingredientsSi: "අබ තෙල්, තල තෙල්, කපු ඇට, සුවඳ කොට්ටං, එඬරු ඇට.",
      ingredientsEn: "Brassica nigra (Black Mustard oil), Sesame seed oil, Gossypium seeds, Ricinus communis castor extract.",
      usageSi: "වේදනාකාරී ස්ථානවල ආලේප කර උණුසුම් තැවීමක් සිදු කරන්න.",
      usageEn: "Gently apply on affected joints and muscles, follow with light warm compress for optimal relief.",
      imageUrl: "/medicines/sarshapadi-oil.jpg",
      featured: false,
    },
    {
      nameSi: "අස්වගන්ධ ජීව ශක්ති චූර්ණය",
      nameEn: "Ashwagandha Vitality Churna (100g)",
      slug: "ashwagandha-churna-100g",
      category: "චූර්ණ සහ කුඩු (Powders)",
      price: 890,
      stock: 55,
      descriptionSi: "මානසික ආතතිය දුරු කරන, ශාරීරික ශක්තිය සහ නිරෝගීභාවය වැඩි කරන, නින්ද ප්‍රශස්ත කරන අගනා ආයුර්වේද වාජීකරණ ඖෂධයකි.",
      descriptionEn: "Premium adaptogenic herbal root powder for alleviating chronic fatigue, enhancing physical stamina, balancing nervous system, and promoting vitality.",
      ingredientsSi: "100% පිරිසිදු අමුක්කරා මුල් (Withania somnifera).",
      ingredientsEn: "100% Pure certified organic Withania somnifera (Ashwagandha) dried root powder.",
      usageSi: "උදෑසන හෝ රාත්‍රියේ මඳ උණුසුම් කිරි කෝප්පයකට තේ හැඳි භාගයක් දමා හොඳින් කලවම් කර බොන්න.",
      usageEn: "Stir half teaspoon into warm milk with honey or cinnamon, consume in morning or evening.",
      imageUrl: "/medicines/hero-banner.jpg",
      featured: false,
    },
    {
      nameSi: "දසමූලාරිෂ්ටය",
      nameEn: "Dasamularishtaya Herbal Tonic (375ml)",
      slug: "dasamularishtaya-375ml",
      category: "පැණි වර්ග (Syrups)",
      price: 640,
      stock: 25,
      descriptionSi: "වෙහෙසකර බව දුරලන, වාත රෝග සමනය කරන, ආහාර රුචිය වඩවන සහ ශරීරයේ දුබලතා මගහරවන සාම්ප්‍රදායික ආසව ඖෂධයකි.",
      descriptionEn: "Classical fermented herbal tonic containing 10 sacred roots for reviving bodily energy, improving appetite, and easing fatigue.",
      ingredientsSi: "බෙලි මුල්, තොටිල, මිදි, නෙල්ලි සහ ස්වාභාවික පැසවූ ඖෂධ වර්ග.",
      ingredientsEn: "Aegle marmelos, Oroxylum indicum, raisins, amla with naturally fermented medicinal herbs.",
      usageSi: "කෑමට පසු මේස හැඳි 2ක් සමාන වතුර ප්‍රමාණයක් සමඟ මිශ්‍ර කර දිනකට දෙවරක් ගන්න.",
      usageEn: "Take 2 tablespoons with an equal volume of warm water twice daily after main meals.",
      imageUrl: "/medicines/siddhartha-oil.jpg",
      featured: false,
    },
    {
      nameSi: "සුවඳ ඖෂධීය පිනිදිය (රෝස සහ හඳුන්)",
      nameEn: "Floral Herb Mist - Rose & Sandalwood (100ml)",
      slug: "floral-herb-mist-100ml",
      category: "ආලේපන සහ ක්‍රීම් (Balms & Pastes)",
      price: 620,
      stock: 45,
      descriptionSi: "මුහුණ ක්ෂණිකව ප්‍රබෝධමත් කරන, සම සිසිල් කරන සහ කුණු දූවිලි ඉවත් කර ස්වභාවික සුවඳක් එක් කරන සුවිශේෂී ඖෂධීය පිනිදියකි.",
      descriptionEn: "Hydrating floral hydrosol mist infused with wild rose distillates and pure sandalwood to tone pores and refresh dull skin throughout the day.",
      ingredientsSi: "පිරිසිදු රෝස මල් පිනිදිය, සුදු හඳුන් සාරය, කෝමාරිකා සාරය.",
      ingredientsEn: "Steam-distilled Rosa damascena hydrosol, Santalum album wood extract, Aloe barbadensis leaf juice.",
      usageSi: "මුහුණට සහ ගෙලට දිනකට ඕනෑම වේලාවක ඉසින්න.",
      usageEn: "Spritz lightly onto face and neck whenever skin feels dry, tired or exposed to tropical sun.",
      imageUrl: "/medicines/heritage.jpg",
      featured: false,
    }
  ];

  for (const item of medicines) {
    await prisma.medicine.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  console.log(`✅ Seeded ${medicines.length} Ayurvedic Medicines successfully.`);

  // 3. Seed an initial test order for demonstration in admin panel
  const existingOrder = await prisma.order.findFirst();
  if (!existingOrder) {
    const siddhartha = await prisma.medicine.findFirst({ where: { slug: "siddhartha-oil-200ml" } });
    const paspanguwa = await prisma.medicine.findFirst({ where: { slug: "special-paspanguwa-100g" } });

    if (siddhartha && paspanguwa) {
      await prisma.order.create({
        data: {
          orderNumber: "AYU-2026-1001",
          customerName: "සුනිල් පෙරේරා (Sunil Perera)",
          customerPhone: "0771234567",
          address: "නො. 42, පන්සල පාර, මහරගම",
          city: "Maharagama",
          notes: "කරුණාකර සවස් කාලයේ බෙදාහරින්න (Please deliver in evening)",
          paymentMethod: "COD",
          status: "CONFIRMED",
          totalAmount: 1200,
          items: {
            create: [
              {
                medicineId: siddhartha.id,
                medicineName: siddhartha.nameSi,
                price: siddhartha.price,
                quantity: 1,
                subtotal: siddhartha.price,
              },
              {
                medicineId: paspanguwa.id,
                medicineName: paspanguwa.nameSi,
                price: paspanguwa.price,
                quantity: 1,
                subtotal: paspanguwa.price,
              },
            ],
          },
        },
      });
      console.log("✅ Seeded sample test order AYU-2026-1001");
    }
  }

  console.log("🌿 Ayu Ceylon database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
