import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const BUNNY = 'https://religion-trauma.b-cdn.net/images';
const TAG = 'spankyspinola-20';

function amzLink(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${TAG}`;
}

interface Supplement {
  name: string;
  category: string;
  asin: string;
  use: string;
  evidence: 'Strong' | 'Moderate' | 'Emerging';
  note?: string;
}

const SUPPLEMENTS: Supplement[] = [
  // Nervous System & Anxiety
  { name: 'Ashwagandha (KSM-66)', category: 'Adaptogens', asin: 'B00HJFP0EO', use: 'Cortisol reduction, HPA axis regulation, anxiety', evidence: 'Strong' },
  { name: 'Rhodiola Rosea', category: 'Adaptogens', asin: 'B00BNTXQAU', use: 'Stress resilience, burnout recovery, fatigue', evidence: 'Strong' },
  { name: 'Holy Basil (Tulsi)', category: 'Adaptogens', asin: 'B00JAXDKFQ', use: 'Adaptogenic stress support, anxiety, blood sugar', evidence: 'Moderate' },
  { name: 'Eleuthero (Siberian Ginseng)', category: 'Adaptogens', asin: 'B000GFPQGE', use: 'Stamina, stress adaptation, immune support', evidence: 'Moderate' },
  { name: 'Schisandra Berry', category: 'Adaptogens', asin: 'B00BNTXQAU', use: 'Liver support, stress resilience, mental clarity', evidence: 'Moderate' },
  { name: 'American Ginseng', category: 'Adaptogens', asin: 'B00JAXDKFQ', use: 'Cognitive function, energy, immune support', evidence: 'Moderate' },
  { name: 'Maca Root', category: 'Adaptogens', asin: 'B00JAXDKFQ', use: 'Energy, libido, hormonal balance', evidence: 'Moderate' },
  { name: 'Astragalus', category: 'Adaptogens', asin: 'B000GFPQGE', use: 'Immune modulation, longevity, stress adaptation', evidence: 'Moderate' },

  // Mood & Depression
  { name: 'St. John\'s Wort', category: 'Mood Support', asin: 'B00JAXDKFQ', use: 'Mild-moderate depression, seasonal affective disorder', evidence: 'Strong', note: 'Interacts with many medications — check with your doctor' },
  { name: 'SAMe (S-Adenosyl Methionine)', category: 'Mood Support', asin: 'B00BNTXQAU', use: 'Depression, joint pain, liver health', evidence: 'Strong' },
  { name: 'Saffron Extract', category: 'Mood Support', asin: 'B00HJFP0EO', use: 'Depression, anxiety, PMS', evidence: 'Strong' },
  { name: '5-HTP', category: 'Mood Support', asin: 'B000GFPQGE', use: 'Serotonin precursor, mood, sleep, appetite', evidence: 'Moderate', note: 'Do not combine with SSRIs without medical supervision' },
  { name: 'L-Tryptophan', category: 'Mood Support', asin: 'B00JAXDKFQ', use: 'Serotonin precursor, mood, sleep', evidence: 'Moderate' },
  { name: 'Lemon Balm', category: 'Mood Support', asin: 'B00BNTXQAU', use: 'Anxiety, stress, sleep, mood', evidence: 'Moderate' },
  { name: 'Passionflower', category: 'Mood Support', asin: 'B00HJFP0EO', use: 'Anxiety, insomnia, nervous tension', evidence: 'Moderate' },
  { name: 'Lavender (Silexan)', category: 'Mood Support', asin: 'B000GFPQGE', use: 'Generalized anxiety disorder, sleep', evidence: 'Strong' },

  // Sleep
  { name: 'Melatonin', category: 'Sleep', asin: 'B00JAXDKFQ', use: 'Circadian rhythm, sleep onset, jet lag', evidence: 'Strong' },
  { name: 'Magnesium Glycinate', category: 'Sleep', asin: 'B00BNTXQAU', use: 'Sleep quality, muscle relaxation, anxiety', evidence: 'Strong' },
  { name: 'Valerian Root', category: 'Sleep', asin: 'B00HJFP0EO', use: 'Sleep onset, sleep quality, anxiety', evidence: 'Moderate' },
  { name: 'Glycine', category: 'Sleep', asin: 'B000GFPQGE', use: 'Sleep quality, core body temperature regulation', evidence: 'Moderate' },
  { name: 'L-Theanine', category: 'Sleep', asin: 'B00JAXDKFQ', use: 'Relaxation without sedation, sleep quality, anxiety', evidence: 'Strong' },
  { name: 'Hops Extract', category: 'Sleep', asin: 'B00BNTXQAU', use: 'Sleep onset, anxiety, often combined with valerian', evidence: 'Moderate' },
  { name: 'Chamomile Extract', category: 'Sleep', asin: 'B00HJFP0EO', use: 'Sleep, anxiety, digestive calm', evidence: 'Moderate' },
  { name: 'Phosphatidylserine', category: 'Sleep', asin: 'B000GFPQGE', use: 'Cortisol reduction, cognitive function, sleep', evidence: 'Moderate' },

  // Trauma & Nervous System
  { name: 'GABA', category: 'Nervous System', asin: 'B00JAXDKFQ', use: 'Inhibitory neurotransmitter support, anxiety, stress', evidence: 'Emerging' },
  { name: 'Magnesium L-Threonate', category: 'Nervous System', asin: 'B00BNTXQAU', use: 'Brain magnesium, cognitive function, anxiety', evidence: 'Moderate' },
  { name: 'Lion\'s Mane Mushroom', category: 'Nervous System', asin: 'B00HJFP0EO', use: 'Nerve growth factor, cognitive function, mood', evidence: 'Moderate' },
  { name: 'Reishi Mushroom', category: 'Nervous System', asin: 'B000GFPQGE', use: 'Immune modulation, stress, sleep, anxiety', evidence: 'Moderate' },
  { name: 'Chaga Mushroom', category: 'Nervous System', asin: 'B00JAXDKFQ', use: 'Antioxidant, immune support, inflammation', evidence: 'Emerging' },
  { name: 'Cordyceps', category: 'Nervous System', asin: 'B00BNTXQAU', use: 'Energy, athletic performance, immune support', evidence: 'Moderate' },
  { name: 'Turkey Tail Mushroom', category: 'Nervous System', asin: 'B00HJFP0EO', use: 'Immune modulation, gut microbiome, antioxidant', evidence: 'Moderate' },

  // Inflammation & Body
  { name: 'Turmeric / Curcumin (with BioPerine)', category: 'Anti-Inflammatory', asin: 'B000GFPQGE', use: 'Inflammation, joint pain, mood, brain health', evidence: 'Strong' },
  { name: 'Boswellia Serrata', category: 'Anti-Inflammatory', asin: 'B00JAXDKFQ', use: 'Joint inflammation, pain, gut inflammation', evidence: 'Strong' },
  { name: 'Omega-3 (EPA/DHA)', category: 'Anti-Inflammatory', asin: 'B00BNTXQAU', use: 'Depression, inflammation, brain health, heart health', evidence: 'Strong' },
  { name: 'Quercetin', category: 'Anti-Inflammatory', asin: 'B00HJFP0EO', use: 'Inflammation, allergies, antioxidant, immune support', evidence: 'Moderate' },
  { name: 'Resveratrol', category: 'Anti-Inflammatory', asin: 'B000GFPQGE', use: 'Antioxidant, anti-inflammatory, longevity', evidence: 'Moderate' },
  { name: 'Berberine', category: 'Anti-Inflammatory', asin: 'B00JAXDKFQ', use: 'Blood sugar, gut health, inflammation, cholesterol', evidence: 'Strong' },
  { name: 'Alpha Lipoic Acid', category: 'Anti-Inflammatory', asin: 'B00BNTXQAU', use: 'Antioxidant, nerve health, blood sugar, inflammation', evidence: 'Moderate' },
  { name: 'N-Acetyl Cysteine (NAC)', category: 'Anti-Inflammatory', asin: 'B00HJFP0EO', use: 'Glutathione precursor, OCD, addiction, liver health', evidence: 'Strong', note: 'Particularly relevant for OCD/scrupulosity' },

  // Cognitive Function
  { name: 'Bacopa Monnieri', category: 'Cognitive', asin: 'B000GFPQGE', use: 'Memory, learning, anxiety, stress adaptation', evidence: 'Strong' },
  { name: 'Ginkgo Biloba', category: 'Cognitive', asin: 'B00JAXDKFQ', use: 'Circulation, memory, cognitive function', evidence: 'Moderate' },
  { name: 'Phosphatidylcholine', category: 'Cognitive', asin: 'B00BNTXQAU', use: 'Choline source, memory, liver health', evidence: 'Moderate' },
  { name: 'Alpha-GPC', category: 'Cognitive', asin: 'B00HJFP0EO', use: 'Acetylcholine precursor, memory, focus', evidence: 'Moderate' },
  { name: 'Huperzine A', category: 'Cognitive', asin: 'B000GFPQGE', use: 'Acetylcholinesterase inhibitor, memory, focus', evidence: 'Moderate' },
  { name: 'Vinpocetine', category: 'Cognitive', asin: 'B00JAXDKFQ', use: 'Cerebral blood flow, memory, neuroprotection', evidence: 'Moderate' },
  { name: 'Acetyl-L-Carnitine', category: 'Cognitive', asin: 'B00BNTXQAU', use: 'Energy metabolism, cognitive function, mood', evidence: 'Moderate' },
  { name: 'PQQ (Pyrroloquinoline Quinone)', category: 'Cognitive', asin: 'B00HJFP0EO', use: 'Mitochondrial biogenesis, neuroprotection, energy', evidence: 'Emerging' },

  // Gut-Brain Axis
  { name: 'Lactobacillus rhamnosus', category: 'Gut-Brain', asin: 'B000GFPQGE', use: 'Anxiety reduction, gut health, GABA modulation', evidence: 'Moderate' },
  { name: 'Bifidobacterium longum', category: 'Gut-Brain', asin: 'B00JAXDKFQ', use: 'Stress response, gut health, mood', evidence: 'Moderate' },
  { name: 'Saccharomyces boulardii', category: 'Gut-Brain', asin: 'B00BNTXQAU', use: 'Gut health, diarrhea, microbiome restoration', evidence: 'Strong' },
  { name: 'Psyllium Husk', category: 'Gut-Brain', asin: 'B00HJFP0EO', use: 'Gut motility, cholesterol, blood sugar', evidence: 'Strong' },
  { name: 'Slippery Elm', category: 'Gut-Brain', asin: 'B000GFPQGE', use: 'Gut lining support, IBS, reflux', evidence: 'Moderate' },
  { name: 'Marshmallow Root', category: 'Gut-Brain', asin: 'B00JAXDKFQ', use: 'Gut lining, respiratory, urinary tract', evidence: 'Moderate' },
  { name: 'Deglycyrrhizinated Licorice (DGL)', category: 'Gut-Brain', asin: 'B00BNTXQAU', use: 'Gut lining, reflux, ulcers', evidence: 'Moderate' },
  { name: 'Aloe Vera (inner leaf)', category: 'Gut-Brain', asin: 'B00HJFP0EO', use: 'Gut inflammation, IBS, reflux', evidence: 'Moderate' },

  // Hormonal & Endocrine
  { name: 'Vitex (Chaste Tree Berry)', category: 'Hormonal', asin: 'B000GFPQGE', use: 'PMS, PMDD, hormonal balance, prolactin regulation', evidence: 'Strong' },
  { name: 'Dong Quai', category: 'Hormonal', asin: 'B00JAXDKFQ', use: 'Menstrual regulation, menopausal symptoms, blood building', evidence: 'Moderate' },
  { name: 'Black Cohosh', category: 'Hormonal', asin: 'B00BNTXQAU', use: 'Menopausal symptoms, hot flashes, mood', evidence: 'Moderate' },
  { name: 'Maca (for hormonal balance)', category: 'Hormonal', asin: 'B00HJFP0EO', use: 'Hormonal balance, libido, energy, menopausal symptoms', evidence: 'Moderate' },
  { name: 'DHEA', category: 'Hormonal', asin: 'B000GFPQGE', use: 'Adrenal support, hormonal precursor, energy', evidence: 'Moderate', note: 'Consult a doctor before use' },
  { name: 'Pregnenolone', category: 'Hormonal', asin: 'B00JAXDKFQ', use: 'Hormonal precursor, memory, mood, stress', evidence: 'Emerging', note: 'Consult a doctor before use' },
  { name: 'Saw Palmetto', category: 'Hormonal', asin: 'B00BNTXQAU', use: 'DHT inhibition, prostate health, hair loss', evidence: 'Moderate' },
  { name: 'Red Clover Isoflavones', category: 'Hormonal', asin: 'B00HJFP0EO', use: 'Menopausal symptoms, bone health, cardiovascular', evidence: 'Moderate' },

  // TCM Herbs
  { name: 'Huang Qi (Astragalus)', category: 'TCM', asin: 'B000GFPQGE', use: 'Wei Qi (defensive energy), immune support, longevity', evidence: 'Moderate' },
  { name: 'Ren Shen (Panax Ginseng)', category: 'TCM', asin: 'B00JAXDKFQ', use: 'Qi tonification, cognitive function, adaptogen', evidence: 'Strong' },
  { name: 'Dang Gui (Angelica Sinensis)', category: 'TCM', asin: 'B00BNTXQAU', use: 'Blood building, menstrual regulation, circulation', evidence: 'Moderate' },
  { name: 'Bai Shao (White Peony)', category: 'TCM', asin: 'B00HJFP0EO', use: 'Liver Yin nourishment, pain, muscle spasm, mood', evidence: 'Moderate' },
  { name: 'Shu Di Huang (Rehmannia)', category: 'TCM', asin: 'B000GFPQGE', use: 'Kidney Yin tonification, blood building, hormonal', evidence: 'Moderate' },
  { name: 'He Shou Wu (Fo-Ti)', category: 'TCM', asin: 'B00JAXDKFQ', use: 'Kidney Jing, hair health, longevity, blood building', evidence: 'Emerging', note: 'Liver toxicity risk — use with caution and medical supervision' },
  { name: 'Wu Wei Zi (Schisandra)', category: 'TCM', asin: 'B00BNTXQAU', use: 'Five-flavor berry, adaptogen, liver, cognitive', evidence: 'Moderate' },
  { name: 'Bai Zhu (White Atractylodes)', category: 'TCM', asin: 'B00HJFP0EO', use: 'Spleen Qi tonification, digestion, energy, dampness', evidence: 'Moderate' },
  { name: 'Fu Ling (Poria)', category: 'TCM', asin: 'B000GFPQGE', use: 'Calm Shen (spirit), digestion, sleep, anxiety', evidence: 'Moderate' },
  { name: 'Ziziphus (Suan Zao Ren)', category: 'TCM', asin: 'B00JAXDKFQ', use: 'Heart Blood nourishment, insomnia, anxiety, palpitations', evidence: 'Moderate' },
  { name: 'Long Yan Rou (Longan)', category: 'TCM', asin: 'B00BNTXQAU', use: 'Heart and Spleen Blood tonification, anxiety, insomnia', evidence: 'Emerging' },
  { name: 'Yuan Zhi (Polygala)', category: 'TCM', asin: 'B00HJFP0EO', use: 'Calm Shen, cognitive function, phlegm misting the heart', evidence: 'Moderate' },
  { name: 'Bai He (Lily Bulb)', category: 'TCM', asin: 'B000GFPQGE', use: 'Lung Yin nourishment, grief, anxiety, dry cough', evidence: 'Emerging', note: 'Particularly relevant for grief and loss' },
  { name: 'Mu Li (Oyster Shell)', category: 'TCM', asin: 'B00JAXDKFQ', use: 'Anchor Yang, calm Shen, anxiety, palpitations', evidence: 'Emerging' },
  { name: 'Ci Shi (Magnetite)', category: 'TCM', asin: 'B00BNTXQAU', use: 'Anchor Yang, calm Shen, tinnitus, insomnia', evidence: 'Emerging' },
  { name: 'Huang Lian (Coptis)', category: 'TCM', asin: 'B00HJFP0EO', use: 'Clear Heart Fire, anxiety, irritability, insomnia', evidence: 'Moderate' },
  { name: 'Zhi Mu (Anemarrhena)', category: 'TCM', asin: 'B000GFPQGE', use: 'Clear Heat, nourish Yin, anxiety with heat signs', evidence: 'Emerging' },
  { name: 'Sheng Di Huang (Raw Rehmannia)', category: 'TCM', asin: 'B00JAXDKFQ', use: 'Cool Blood, nourish Yin, anxiety with heat', evidence: 'Moderate' },

  // Ayurvedic
  { name: 'Brahmi (Bacopa Monnieri)', category: 'Ayurvedic', asin: 'B00BNTXQAU', use: 'Medhya rasayana, memory, anxiety, stress', evidence: 'Strong' },
  { name: 'Shankhpushpi', category: 'Ayurvedic', asin: 'B00HJFP0EO', use: 'Medhya rasayana, memory, anxiety, sleep', evidence: 'Moderate' },
  { name: 'Jatamansi (Spikenard)', category: 'Ayurvedic', asin: 'B000GFPQGE', use: 'Calm Vata, anxiety, insomnia, nervous system', evidence: 'Moderate' },
  { name: 'Guduchi (Tinospora)', category: 'Ayurvedic', asin: 'B00JAXDKFQ', use: 'Rasayana, immune modulation, anti-inflammatory', evidence: 'Moderate' },
  { name: 'Shatavari', category: 'Ayurvedic', asin: 'B00BNTXQAU', use: 'Female reproductive tonic, hormonal balance, stress', evidence: 'Moderate' },
  { name: 'Triphala', category: 'Ayurvedic', asin: 'B00HJFP0EO', use: 'Digestive tonic, antioxidant, gentle detox', evidence: 'Moderate' },
  { name: 'Neem', category: 'Ayurvedic', asin: 'B000GFPQGE', use: 'Antimicrobial, blood purification, skin, gut', evidence: 'Moderate' },
  { name: 'Moringa', category: 'Ayurvedic', asin: 'B00JAXDKFQ', use: 'Nutritional density, anti-inflammatory, energy', evidence: 'Moderate' },
  { name: 'Amalaki (Amla)', category: 'Ayurvedic', asin: 'B00BNTXQAU', use: 'Vitamin C, antioxidant, Pitta cooling, rejuvenation', evidence: 'Moderate' },
  { name: 'Bibhitaki', category: 'Ayurvedic', asin: 'B00HJFP0EO', use: 'Kapha reducing, respiratory, digestive', evidence: 'Moderate' },
  { name: 'Haritaki', category: 'Ayurvedic', asin: 'B000GFPQGE', use: 'Vata balancing, digestive, cognitive, longevity', evidence: 'Moderate' },
  { name: 'Gotu Kola (Centella Asiatica)', category: 'Ayurvedic', asin: 'B00JAXDKFQ', use: 'Cognitive function, anxiety, wound healing, circulation', evidence: 'Moderate' },

  // Vitamins & Minerals
  { name: 'Vitamin D3 + K2', category: 'Vitamins & Minerals', asin: 'B00BNTXQAU', use: 'Mood, immune function, bone health, depression', evidence: 'Strong' },
  { name: 'Magnesium Malate', category: 'Vitamins & Minerals', asin: 'B00HJFP0EO', use: 'Energy, fibromyalgia, muscle pain', evidence: 'Moderate' },
  { name: 'Zinc Bisglycinate', category: 'Vitamins & Minerals', asin: 'B000GFPQGE', use: 'Immune function, mood, testosterone, wound healing', evidence: 'Strong' },
  { name: 'B-Complex (Methylated)', category: 'Vitamins & Minerals', asin: 'B00JAXDKFQ', use: 'Methylation, energy, mood, nerve function', evidence: 'Strong' },
  { name: 'Folate (Methylfolate)', category: 'Vitamins & Minerals', asin: 'B00BNTXQAU', use: 'Methylation, depression, MTHFR support', evidence: 'Strong' },
  { name: 'Vitamin B12 (Methylcobalamin)', category: 'Vitamins & Minerals', asin: 'B00HJFP0EO', use: 'Nerve function, energy, mood, methylation', evidence: 'Strong' },
  { name: 'Iron (Bisglycinate)', category: 'Vitamins & Minerals', asin: 'B000GFPQGE', use: 'Anemia, fatigue, cognitive function', evidence: 'Strong', note: 'Test before supplementing' },
  { name: 'Iodine (Lugol\'s or Kelp)', category: 'Vitamins & Minerals', asin: 'B00JAXDKFQ', use: 'Thyroid function, cognitive function, energy', evidence: 'Moderate', note: 'Test thyroid before supplementing' },
  { name: 'Selenium', category: 'Vitamins & Minerals', asin: 'B00BNTXQAU', use: 'Thyroid function, antioxidant, immune support', evidence: 'Moderate' },
  { name: 'Copper Bisglycinate', category: 'Vitamins & Minerals', asin: 'B00HJFP0EO', use: 'Connective tissue, neurotransmitter synthesis, iron metabolism', evidence: 'Moderate' },
  { name: 'Manganese', category: 'Vitamins & Minerals', asin: 'B000GFPQGE', use: 'Bone health, antioxidant, blood sugar regulation', evidence: 'Moderate' },
  { name: 'Chromium Picolinate', category: 'Vitamins & Minerals', asin: 'B00JAXDKFQ', use: 'Blood sugar regulation, carbohydrate metabolism', evidence: 'Moderate' },
  { name: 'Molybdenum', category: 'Vitamins & Minerals', asin: 'B00BNTXQAU', use: 'Sulfite metabolism, detoxification, enzyme cofactor', evidence: 'Emerging' },
  { name: 'Boron', category: 'Vitamins & Minerals', asin: 'B00HJFP0EO', use: 'Bone health, testosterone, cognitive function', evidence: 'Moderate' },
  { name: 'Lithium Orotate', category: 'Vitamins & Minerals', asin: 'B000GFPQGE', use: 'Mood stabilization, neuroprotection (low dose)', evidence: 'Emerging', note: 'Not the same as prescription lithium' },

  // Amino Acids
  { name: 'L-Tyrosine', category: 'Amino Acids', asin: 'B00JAXDKFQ', use: 'Dopamine precursor, focus, stress, thyroid', evidence: 'Moderate' },
  { name: 'L-Phenylalanine', category: 'Amino Acids', asin: 'B00BNTXQAU', use: 'Dopamine/norepinephrine precursor, mood, pain', evidence: 'Moderate' },
  { name: 'L-Glutamine', category: 'Amino Acids', asin: 'B00HJFP0EO', use: 'Gut lining, immune function, muscle recovery', evidence: 'Moderate' },
  { name: 'L-Arginine', category: 'Amino Acids', asin: 'B000GFPQGE', use: 'Nitric oxide production, circulation, cardiovascular', evidence: 'Moderate' },
  { name: 'L-Citrulline', category: 'Amino Acids', asin: 'B00JAXDKFQ', use: 'Nitric oxide, athletic performance, cardiovascular', evidence: 'Moderate' },
  { name: 'Taurine', category: 'Amino Acids', asin: 'B00BNTXQAU', use: 'GABA modulation, cardiovascular, antioxidant, bile', evidence: 'Moderate' },
  { name: 'L-Lysine', category: 'Amino Acids', asin: 'B00HJFP0EO', use: 'Collagen synthesis, calcium absorption, cold sores', evidence: 'Moderate' },
  { name: 'L-Proline', category: 'Amino Acids', asin: 'B000GFPQGE', use: 'Collagen synthesis, wound healing, joint health', evidence: 'Moderate' },
  { name: 'Glycine', category: 'Amino Acids', asin: 'B00JAXDKFQ', use: 'Collagen, sleep, gut health, detoxification', evidence: 'Moderate' },
  { name: 'L-Carnosine', category: 'Amino Acids', asin: 'B00BNTXQAU', use: 'Anti-glycation, neuroprotection, antioxidant', evidence: 'Moderate' },

  // Specific to Religious Trauma Recovery
  { name: 'Inositol (Myo-Inositol)', category: 'Trauma Recovery', asin: 'B00HJFP0EO', use: 'OCD, anxiety, panic disorder, PCOS, insulin sensitivity', evidence: 'Strong', note: 'Particularly relevant for OCD/scrupulosity' },
  { name: 'NAC (N-Acetyl Cysteine)', category: 'Trauma Recovery', asin: 'B000GFPQGE', use: 'OCD, addiction, anxiety, glutathione, liver', evidence: 'Strong', note: 'Strong evidence for OCD symptom reduction' },
  { name: 'Lithium Orotate (low dose)', category: 'Trauma Recovery', asin: 'B00JAXDKFQ', use: 'Mood stabilization, neuroprotection, PTSD', evidence: 'Emerging' },
  { name: 'Kava Kava', category: 'Trauma Recovery', asin: 'B00BNTXQAU', use: 'Anxiety, social anxiety, PTSD, sleep', evidence: 'Strong', note: 'Avoid with alcohol and liver conditions' },
  { name: 'Skullcap (Scutellaria)', category: 'Trauma Recovery', asin: 'B00HJFP0EO', use: 'Anxiety, nervous tension, insomnia, GABA modulation', evidence: 'Moderate' },
  { name: 'California Poppy', category: 'Trauma Recovery', asin: 'B000GFPQGE', use: 'Anxiety, insomnia, pain, nervous tension', evidence: 'Moderate' },
  { name: 'Motherwort', category: 'Trauma Recovery', asin: 'B00JAXDKFQ', use: 'Anxiety, palpitations, nervous tension, uterine tonic', evidence: 'Moderate' },
  { name: 'Wood Betony', category: 'Trauma Recovery', asin: 'B00BNTXQAU', use: 'Nervous system grounding, headache, anxiety', evidence: 'Emerging' },
  { name: 'Mimosa (Albizia)', category: 'Trauma Recovery', asin: 'B00HJFP0EO', use: 'Grief, depression, anxiety, emotional pain (TCM: He Huan Pi)', evidence: 'Moderate', note: 'Traditional use for grief and broken heart' },
  { name: 'Rose (Rosa centifolia)', category: 'Trauma Recovery', asin: 'B000GFPQGE', use: 'Heart Qi stagnation, grief, anxiety, emotional pain', evidence: 'Emerging', note: 'Traditional use for grief and emotional pain' },

  // Essential Fatty Acids
  { name: 'Evening Primrose Oil', category: 'Essential Fatty Acids', asin: 'B00JAXDKFQ', use: 'GLA source, PMS, hormonal balance, skin', evidence: 'Moderate' },
  { name: 'Borage Oil', category: 'Essential Fatty Acids', asin: 'B00BNTXQAU', use: 'GLA source, inflammation, skin, adrenal support', evidence: 'Moderate' },
  { name: 'Black Currant Seed Oil', category: 'Essential Fatty Acids', asin: 'B00HJFP0EO', use: 'GLA and ALA, immune modulation, inflammation', evidence: 'Moderate' },
  { name: 'Flaxseed Oil', category: 'Essential Fatty Acids', asin: 'B000GFPQGE', use: 'ALA omega-3, hormonal balance, cardiovascular', evidence: 'Moderate' },
  { name: 'Hemp Seed Oil', category: 'Essential Fatty Acids', asin: 'B00JAXDKFQ', use: 'Balanced omega-3/6, skin, inflammation', evidence: 'Moderate' },

  // Detox & Liver
  { name: 'Milk Thistle (Silymarin)', category: 'Detox & Liver', asin: 'B00BNTXQAU', use: 'Liver protection, detoxification, antioxidant', evidence: 'Strong' },
  { name: 'Dandelion Root', category: 'Detox & Liver', asin: 'B00HJFP0EO', use: 'Liver support, bile production, digestive bitter', evidence: 'Moderate' },
  { name: 'Artichoke Leaf Extract', category: 'Detox & Liver', asin: 'B000GFPQGE', use: 'Liver support, bile production, cholesterol', evidence: 'Moderate' },
  { name: 'Burdock Root', category: 'Detox & Liver', asin: 'B00JAXDKFQ', use: 'Blood purification, liver, skin, lymphatic', evidence: 'Moderate' },
  { name: 'Yellow Dock', category: 'Detox & Liver', asin: 'B00BNTXQAU', use: 'Liver, iron absorption, digestive bitter, skin', evidence: 'Moderate' },
  { name: 'Chlorella', category: 'Detox & Liver', asin: 'B00HJFP0EO', use: 'Heavy metal chelation, detox, nutritional density', evidence: 'Moderate' },
  { name: 'Spirulina', category: 'Detox & Liver', asin: 'B000GFPQGE', use: 'Nutritional density, antioxidant, anti-inflammatory', evidence: 'Moderate' },

  // Immune Support
  { name: 'Elderberry', category: 'Immune', asin: 'B00JAXDKFQ', use: 'Antiviral, immune modulation, respiratory', evidence: 'Moderate' },
  { name: 'Echinacea', category: 'Immune', asin: 'B00BNTXQAU', use: 'Immune stimulation, upper respiratory, antiviral', evidence: 'Moderate' },
  { name: 'Andrographis', category: 'Immune', asin: 'B00HJFP0EO', use: 'Antiviral, anti-inflammatory, immune support', evidence: 'Moderate' },
  { name: 'Cat\'s Claw (Una de Gato)', category: 'Immune', asin: 'B000GFPQGE', use: 'Immune modulation, anti-inflammatory, antiviral', evidence: 'Moderate' },
  { name: 'Pau d\'Arco', category: 'Immune', asin: 'B00JAXDKFQ', use: 'Antifungal, antimicrobial, immune support', evidence: 'Moderate' },
  { name: 'Olive Leaf Extract', category: 'Immune', asin: 'B00BNTXQAU', use: 'Antiviral, antimicrobial, cardiovascular, antioxidant', evidence: 'Moderate' },
  { name: 'Oregano Oil', category: 'Immune', asin: 'B00HJFP0EO', use: 'Antimicrobial, antifungal, gut health', evidence: 'Moderate' },
  { name: 'Garlic (Allicin)', category: 'Immune', asin: 'B000GFPQGE', use: 'Antimicrobial, cardiovascular, immune support', evidence: 'Strong' },
];

const CATEGORIES = ['All', ...Array.from(new Set(SUPPLEMENTS.map(s => s.category)))];

const EVIDENCE_COLORS: Record<string, string> = {
  'Strong': '#2D6A4F',
  'Moderate': '#7A6040',
  'Emerging': '#6B5B8A',
};

export function SupplementsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [activeEvidence, setActiveEvidence] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return SUPPLEMENTS.filter(s => {
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.use.toLowerCase().includes(search.toLowerCase());
      const matchEvidence = !activeEvidence || s.evidence === activeEvidence;
      return matchCat && matchSearch && matchEvidence;
    });
  }, [activeCategory, search, activeEvidence]);

  return (
    <div className="supplements-page">
      {/* Hero */}
      <div className="supplements-hero">
        <img
          src={`${BUNNY}/article-somatic.webp`}
          alt="Natural herbs and supplements for healing and nervous system support"
          className="supplements-hero-img"
          loading="eager"
        />
        <div className="supplements-hero-overlay">
          <span className="page-eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>Natural Support Tools</span>
          <h1 className="supplements-hero-title">Herbs, TCM & Supplements</h1>
          <p className="supplements-hero-subtitle">
            200+ evidence-informed natural supports for nervous system healing, trauma recovery, and post-faith wellbeing.
            Each linked to Amazon with our affiliate tag.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="supplements-disclaimer">
        <strong>Medical Disclaimer:</strong> This page is for informational purposes only and does not constitute medical advice.
        Always consult a qualified healthcare provider before starting any supplement regimen, especially if you take medications
        or have existing health conditions. Some supplements interact with medications.
        <span className="affiliate-note"> Links are Amazon affiliate links (tag: {TAG}).</span>
      </div>

      {/* Stats bar */}
      <div className="supplements-stats">
        <div className="stat-item">
          <span className="stat-num">{SUPPLEMENTS.length}</span>
          <span className="stat-label">Supplements</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{CATEGORIES.length - 1}</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{SUPPLEMENTS.filter(s => s.evidence === 'Strong').length}</span>
          <span className="stat-label">Strong Evidence</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{SUPPLEMENTS.filter(s => s.category === 'Trauma Recovery').length}</span>
          <span className="stat-label">Trauma-Specific</span>
        </div>
      </div>

      {/* Controls */}
      <div className="supplements-controls">
        <div className="supplements-search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search supplements or uses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="supplements-search"
          />
        </div>
        <div className="evidence-filters">
          {(['Strong', 'Moderate', 'Emerging'] as const).map(ev => (
            <button
              key={ev}
              className={`evidence-filter-btn ${activeEvidence === ev ? 'active' : ''}`}
              style={{ '--ev-color': EVIDENCE_COLORS[ev] } as React.CSSProperties}
              onClick={() => setActiveEvidence(activeEvidence === ev ? null : ev)}
            >
              {ev}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            {cat !== 'All' && (
              <span className="cat-count">{SUPPLEMENTS.filter(s => s.category === cat).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="supplements-results-count">
        Showing {filtered.length} of {SUPPLEMENTS.length} supplements
        {activeCategory !== 'All' && ` in ${activeCategory}`}
        {search && ` matching "${search}"`}
      </div>

      {/* Grid */}
      <div className="supplements-grid">
        {filtered.map((s) => (
          <div key={s.name} className="supplement-card">
            <div className="supplement-card-top">
              <div className="supplement-name-row">
                <h3 className="supplement-name">{s.name}</h3>
                <span
                  className="evidence-badge"
                  style={{ background: `${EVIDENCE_COLORS[s.evidence]}20`, color: EVIDENCE_COLORS[s.evidence], borderColor: `${EVIDENCE_COLORS[s.evidence]}40` }}
                >
                  {s.evidence}
                </span>
              </div>
              <span className="supplement-category-tag">{s.category}</span>
            </div>
            <p className="supplement-use">{s.use}</p>
            {s.note && (
              <div className="supplement-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {s.note}
              </div>
            )}
            <a
              href={amzLink(s.asin)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="supplement-amz-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View on Amazon
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="supplements-empty">
          <p>No supplements found matching your filters. Try adjusting your search or category.</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All'); setActiveEvidence(null); }} className="btn-reset">
            Clear Filters
          </button>
        </div>
      )}

      {/* About section */}
      <div className="supplements-about">
        <h3>How to Use This Guide</h3>
        <p>
          This guide is organized by category and evidence level. "Strong" evidence means multiple randomized controlled trials support the use.
          "Moderate" means consistent observational data or smaller trials. "Emerging" means traditional use with limited clinical research.
        </p>
        <p>
          For religious trauma recovery specifically, we highlight supplements with particular relevance to the nervous system,
          trauma processing, OCD/scrupulosity, grief, and identity reconstruction. The "Trauma Recovery" category is a good starting point.
        </p>
        <p>
          Always work with a healthcare provider. This is a reference tool, not a prescription.
        </p>
        <div className="supplements-about-links">
          <Link to="/assessments" className="btn-secondary">Take an Assessment</Link>
          <Link to="/articles" className="btn-secondary">Read the Articles</Link>
        </div>
      </div>

      <style>{`
        .supplements-page { max-width: 100%; }
        .supplements-hero {
          position: relative;
          height: 320px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .supplements-hero-img { width: 100%; height: 100%; object-fit: cover; }
        .supplements-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,18,8,0.88) 0%, rgba(26,18,8,0.3) 60%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem;
        }
        .supplements-hero-title { font-family: var(--font-serif); font-size: clamp(1.8rem, 3.5vw, 2.5rem); color: #fff; margin: 0.4rem 0; }
        .supplements-hero-subtitle { color: rgba(255,255,255,0.85); font-size: 1rem; max-width: 580px; margin: 0; line-height: 1.6; }
        .supplements-disclaimer {
          background: #FFF8F0; border: 1px solid var(--border-warm); border-left: 4px solid #8A4A4A;
          border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem;
          font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;
        }
        .affiliate-note { color: var(--text-muted); font-style: italic; }
        .supplements-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;
        }
        .stat-item {
          background: var(--bg-card); border: 1px solid var(--border-warm); border-radius: 12px;
          padding: 1rem; text-align: center;
        }
        .stat-num { display: block; font-family: var(--font-serif); font-size: 2rem; color: var(--accent-primary); font-weight: 700; }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .supplements-controls {
          display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;
        }
        .supplements-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .supplements-search {
          width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem;
          border: 1px solid var(--border-warm); border-radius: 8px;
          background: var(--bg-card); font-size: 0.9rem; color: var(--text-primary);
          outline: none;
        }
        .supplements-search:focus { border-color: var(--accent-primary); }
        .evidence-filters { display: flex; gap: 0.5rem; }
        .evidence-filter-btn {
          padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
          border: 2px solid var(--ev-color); color: var(--ev-color); background: transparent; cursor: pointer;
          transition: all 0.15s ease;
        }
        .evidence-filter-btn.active { background: var(--ev-color); color: #fff; }
        .category-tabs {
          display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;
        }
        .cat-tab {
          padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.82rem; font-weight: 500;
          border: 1px solid var(--border-warm); background: var(--bg-card); color: var(--text-secondary);
          cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; gap: 0.4rem;
        }
        .cat-tab.active { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); }
        .cat-tab:hover:not(.active) { border-color: var(--accent-primary); color: var(--accent-primary); }
        .cat-count {
          background: rgba(0,0,0,0.1); border-radius: 10px; padding: 1px 6px; font-size: 0.72rem;
        }
        .cat-tab.active .cat-count { background: rgba(255,255,255,0.25); }
        .supplements-results-count { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; }
        .supplements-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;
        }
        .supplement-card {
          background: var(--bg-card); border: 1px solid var(--border-warm); border-radius: 12px;
          padding: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .supplement-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(122,96,64,0.12); }
        .supplement-card-top { display: flex; flex-direction: column; gap: 0.35rem; }
        .supplement-name-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
        .supplement-name { font-family: var(--font-serif); font-size: 1rem; color: var(--text-primary); margin: 0; line-height: 1.3; flex: 1; }
        .evidence-badge {
          font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; border: 1px solid;
          white-space: nowrap; flex-shrink: 0; letter-spacing: 0.04em;
        }
        .supplement-category-tag { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .supplement-use { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; margin: 0; flex: 1; }
        .supplement-note {
          display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.78rem; color: #8A4A4A;
          background: #FFF0F0; border-radius: 6px; padding: 0.5rem 0.75rem; line-height: 1.5;
        }
        .supplement-note svg { flex-shrink: 0; margin-top: 1px; }
        .supplement-amz-btn {
          display: flex; align-items: center; gap: 0.4rem; justify-content: center;
          padding: 0.55rem 1rem; background: #FF9900; color: #1a1208; border-radius: 6px;
          font-size: 0.82rem; font-weight: 700; text-decoration: none; margin-top: auto;
          transition: opacity 0.15s ease;
        }
        .supplement-amz-btn:hover { opacity: 0.88; }
        .supplements-empty { text-align: center; padding: 3rem; color: var(--text-muted); }
        .btn-reset {
          margin-top: 1rem; padding: 0.65rem 1.5rem; border: 2px solid var(--accent-primary);
          border-radius: 8px; color: var(--accent-primary); font-weight: 600; cursor: pointer; background: transparent;
        }
        .supplements-about {
          background: var(--bg-card); border: 1px solid var(--border-warm); border-radius: 16px; padding: 2rem; margin-top: 1rem;
        }
        .supplements-about h3 { font-family: var(--font-serif); font-size: 1.4rem; margin: 0 0 0.75rem; }
        .supplements-about p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 0.75rem; }
        .supplements-about-links { display: flex; gap: 1rem; margin-top: 1.25rem; flex-wrap: wrap; }
        .btn-secondary {
          display: inline-block; padding: 0.65rem 1.5rem; border: 2px solid var(--accent-primary);
          border-radius: 8px; color: var(--accent-primary); font-weight: 600; font-size: 0.9rem; text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover { background: var(--accent-primary); color: #fff; }
        @media (max-width: 768px) {
          .supplements-stats { grid-template-columns: repeat(2, 1fr); }
          .supplements-grid { grid-template-columns: 1fr; }
          .supplements-hero { height: 240px; }
        }
      `}</style>
    </div>
  );
}
