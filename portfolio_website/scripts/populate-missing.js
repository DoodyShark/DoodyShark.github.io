const { MongoClient } = require('mongodb');
const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}
const client = new MongoClient(uri);

client.connect().then(async () => {
  const db = client.db('portfolio');
  const now = new Date().toISOString();

  // 1. Fix existing UQ survey venue
  const uqResult = await db.collection('publications').updateOne(
    { title: 'Uncertainty Quantification for Machine Learning in Healthcare: A Survey' },
    { $set: { venue: 'AHLI CHIL 2025', link: 'https://proceedings.mlr.press/v287/lopez25a.html', updatedAt: now } }
  );
  console.log('UQ venue fix:', uqResult.modifiedCount, 'modified');

  // 2. Fix stale position dates
  const oxaiResult = await db.collection('cards').updateMany(
    { slug: 'oxai' },
    { $set: { description: 'May 2025 – Sep 2025', updatedAt: now } }
  );
  console.log('oxai date fix:', oxaiResult.modifiedCount, 'modified');

  const clinicalResult = await db.collection('cards').updateMany(
    { slug: 'clinical' },
    { $set: { description: 'Aug 2024 – Jan 2026', updatedAt: now } }
  );
  console.log('clinical date fix:', clinicalResult.modifiedCount, 'modified');

  // 3. Insert 5 missing publications
  const newPubs = [
    {
      year: 2025,
      title: 'Causal Graph Fusion for Incomplete Spinal Cord Injury Data',
      authors: 'Y. Li, D. Al Jorf, A. Ighissou, A. Scheel-Sailer, J. Pannek, R. Riener, & D. Paez-Granados',
      venue: 'In Review',
      image: '',
      link: '',
      createdAt: now,
      updatedAt: now,
    },
    {
      year: 2026,
      title: 'Pathway-guided Multi-omic AI Reconstructs Missing RNA and DNA Methylation Profiles Across 34 Cancer Types',
      authors: 'D. Al Jorf, G. Ghosheh',
      venue: 'Abstract submitted to ESMO 2026',
      image: '',
      link: '',
      createdAt: now,
      updatedAt: now,
    },
    {
      year: 2026,
      title: 'Leveraging Agonistic-Antagonistic Coactivation in Single-Grid HDsEMG for Hand Gesture Recognition',
      authors: 'F. Darwish*, D. Al Jorf*, E. Tyacke, C. Armanini, F. E. Shamout',
      venue: 'Accepted at IEEE EMBC 2026',
      image: '',
      link: '',
      createdAt: now,
      updatedAt: now,
    },
    {
      year: 2026,
      title: 'Modular Multimodal Alignment using Time-Series EHR Data for Enhancing Medical Image Classification',
      authors: 'S. Elsharief, L. J. Lechuga Lopez, F. Darwish*, D. Al Jorf*, M. A. Andargei, A. Subanya, C. Ma, F. E. Shamout',
      venue: 'In Review',
      image: '',
      link: '',
      createdAt: now,
      updatedAt: now,
    },
    {
      year: 2025,
      title: 'Enhancing the Efficiency of Hand Gesture Classification by Harnessing Muscle Synergies',
      authors: 'D. Al Jorf*, F. Darwish*, C. Armanini',
      venue: 'One-page abstract presented at IEEE EMBC 2025',
      image: '',
      link: '',
      createdAt: now,
      updatedAt: now,
    },
  ];
  const pubResult = await db.collection('publications').insertMany(newPubs);
  console.log('Publications inserted:', pubResult.insertedCount);

  // 4. Insert 3 missing positions (en + ar)
  const newPositions = [
    {
      slug: 'epfl-nlp', collection: 'positions', locale: 'en', order: 1,
      title: 'Research Intern — NLP Lab, EPFL',
      description: 'Jun 2026 – Present',
      image: '/img/epfl_logo.png',
      linked: true, link: 'https://nlp.epfl.ch/',
      body: '## [NLP Lab](https://nlp.epfl.ch/) — EPFL\n\n*Summer@EPFL Research Internship, Lausanne, Switzerland*\n\n• Leading a research project under Prof. Antoine Bosselut, supervised by postdocs Clara Meister and Tiago Pimentel.\n\n• Extending the [ACL 2024 Best Paper](https://aclanthology.org/2024.acl-long.834/) on causal estimation of memorisation profiles in language models.\n\n• Targeting a full paper submission by end of summer 2026.',
      createdAt: now, updatedAt: now,
    },
    {
      slug: 'epfl-nlp', collection: 'positions', locale: 'ar', order: 1,
      title: 'باحث متدرب — مختبر معالجة اللغة الطبيعية، EPFL',
      description: 'يونيو 2026 – حاضر',
      image: '/img/epfl_logo.png',
      linked: true, link: 'https://nlp.epfl.ch/',
      body: '## [مختبر NLP](https://nlp.epfl.ch/) — EPFL\n\n*تدريب بحثي صيفي، لوزان، سويسرا*\n\n• قيادة مشروع بحثي تحت إشراف البروفيسور أنطوان بوسيلو.\n\n• توسيع ورقة ACL 2024 الحائزة على جائزة أفضل ورقة بحثية حول التقدير السببي لملامح الحفظ في نماذج اللغة.\n\n• الهدف تقديم ورقة بحثية كاملة بنهاية صيف 2026.',
      createdAt: now, updatedAt: now,
    },
    {
      slug: 'sci-ai-eth', collection: 'positions', locale: 'en', order: 2,
      title: 'Semester Project — SCI AI Lab, ETH Zürich',
      description: 'Dec 2025 – Present',
      image: '/img/eth_logo.png',
      linked: true, link: 'https://scai.ethz.ch/',
      body: '## [Spinal Cord Injury & AI Lab](https://scai.ethz.ch/) — ETH Zürich\n\n*Semester Project, Zürich, Switzerland*\n\n• Led a project on **causal steering of TabPFN** via explainable soft attention masking for improved downstream task performance; drove the project from proposal to paper.\n\n• Co-led the **causal graph fusion** project for incomplete Spinal Cord Injury data, currently in review.',
      createdAt: now, updatedAt: now,
    },
    {
      slug: 'sci-ai-eth', collection: 'positions', locale: 'ar', order: 2,
      title: 'مشروع فصلي — مختبر الذكاء الاصطناعي وإصابات الحبل الشوكي، ETH',
      description: 'ديسمبر 2025 – حاضر',
      image: '/img/eth_logo.png',
      linked: true, link: 'https://scai.ethz.ch/',
      body: '## [مختبر SCI AI](https://scai.ethz.ch/) — ETH زيورخ\n\n*مشروع فصلي، زيورخ، سويسرا*\n\n• قيادة مشروع حول التوجيه السببي لـ TabPFN عبر إخفاء الانتباه القابل للتفسير.\n\n• المشاركة في قيادة مشروع دمج الرسم البياني السببي لبيانات إصابات الحبل الشوكي غير المكتملة، قيد المراجعة حاليًا.',
      createdAt: now, updatedAt: now,
    },
    {
      slug: 'nexomic', collection: 'positions', locale: 'en', order: 3,
      title: 'ML Research Engineer — Nexomic',
      description: 'Feb 2026 – Present',
      image: '/img/nexomic_logo.png',
      linked: true, link: 'https://nexomic.com/',
      body: '## [Nexomic](https://nexomic.com/)\n\n*(Remote) Dublin, Ireland*\n\n• Leading end-to-end research in **causally-informed synthetic data generation** for multi-omic cancer data, spanning method design, experimentation, and implementation.\n\n• Research output includes an abstract accepted at *ESMO 2026*.',
      createdAt: now, updatedAt: now,
    },
    {
      slug: 'nexomic', collection: 'positions', locale: 'ar', order: 3,
      title: 'مهندس أبحاث تعلم الآلة — Nexomic',
      description: 'فبراير 2026 – حاضر',
      image: '/img/nexomic_logo.png',
      linked: true, link: 'https://nexomic.com/',
      body: '## [Nexomic](https://nexomic.com/)\n\n*(عن بُعد) دبلن، أيرلندا*\n\n• قيادة أبحاث شاملة في **توليد البيانات الاصطناعية المُوجَّهة سببيًا** لبيانات السرطان متعددة الأوميك.\n\n• نتائج البحث تشمل ملخصًا مقبولًا في *ESMO 2026*.',
      createdAt: now, updatedAt: now,
    },
  ];
  const posResult = await db.collection('cards').insertMany(newPositions);
  console.log('Positions inserted:', posResult.insertedCount);

  await client.close();
  console.log('Done.');
}).catch(err => { console.error('ERROR:', err.message); process.exit(1); });
