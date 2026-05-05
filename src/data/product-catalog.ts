export interface Product {
  asin: string;
  name: string;
  category: string;
  tags: string[];
  description?: string;
}

export const productCatalog: Product[] = [
  // === RELIGIOUS TRAUMA RECOVERY BOOKS ===
  {
    asin: '0062641794',
    name: 'Leaving the Fold: A Guide for Former Fundamentalists and Others Leaving Their Religion',
    category: 'religious-trauma',
    tags: ['religious-trauma', 'leaving-religion', 'fundamentalism', 'recovery'],
    description: 'Marlene Winell\'s foundational guide for those leaving high-control religion'
  },
  {
    asin: '0062641786',
    name: 'Faith After Doubt: Why Your Beliefs Stopped Working and What to Do About It',
    category: 'deconstruction',
    tags: ['deconstruction', 'faith-doubt', 'brian-mclaren', 'spiritual-growth'],
    description: 'Brian McLaren\'s compassionate guide through faith transitions'
  },
  {
    asin: '0062300253',
    name: 'The Sin of Certainty: Why God Desires Our Trust More Than Our "Correct" Beliefs',
    category: 'deconstruction',
    tags: ['deconstruction', 'certainty', 'peter-enns', 'biblical-faith'],
    description: 'Peter Enns on moving beyond rigid belief systems'
  },
  {
    asin: '0062300261',
    name: 'The Bible Tells Me So: Why Defending Scripture Has Made Us Unable to Read It',
    category: 'deconstruction',
    tags: ['deconstruction', 'bible', 'peter-enns', 'scripture'],
    description: 'Peter Enns on reading the Bible with fresh eyes'
  },
  {
    asin: '1451698453',
    name: 'Trusting Doubt: A Former Evangelical Looks at Old Beliefs in a New Light',
    category: 'religious-trauma',
    tags: ['religious-trauma', 'evangelical', 'doubt', 'valerie-tarico'],
    description: 'Valerie Tarico\'s journey through evangelical deconstruction'
  },
  {
    asin: '1455559822',
    name: 'Post-Traumatic Church Syndrome: A Memoir of Humor and Healing',
    category: 'religious-trauma',
    tags: ['religious-trauma', 'church', 'healing', 'memoir', 'reba-riley'],
    description: 'Reba Riley\'s humorous and healing memoir of church trauma'
  },
  {
    asin: '0062300288',
    name: 'How the Bible Actually Works: In Which I Explain How An Ancient, Ambiguous, and Diverse Book Leads Us to Wisdom Rather Than Answers',
    category: 'deconstruction',
    tags: ['deconstruction', 'bible', 'peter-enns', 'wisdom'],
    description: 'Peter Enns on the Bible as a wisdom book'
  },
  {
    asin: '1400205549',
    name: 'A New Kind of Christianity: Ten Questions That Are Transforming the Faith',
    category: 'deconstruction',
    tags: ['deconstruction', 'christianity', 'brian-mclaren', 'transformation'],
    description: 'Brian McLaren reimagining Christianity for the modern world'
  },

  // === PURITY CULTURE & BODY HEALING ===
  {
    asin: '1587433494',
    name: 'Damaged Goods: New Perspectives on Christian Purity Culture',
    category: 'purity-culture',
    tags: ['purity-culture', 'sexuality', 'shame', 'healing', 'christianity'],
    description: 'Dianna Anderson on reclaiming sexuality after purity culture'
  },
  {
    asin: '0807014273',
    name: 'Pure: Inside the Evangelical Movement That Shamed a Generation of Young Women and How I Broke Free',
    category: 'purity-culture',
    tags: ['purity-culture', 'evangelical', 'shame', 'women', 'healing'],
    description: 'Linda Kay Klein on the harm of evangelical purity culture'
  },
  {
    asin: '0062885308',
    name: 'The Body Is Not an Apology: The Power of Radical Self-Love',
    category: 'body-healing',
    tags: ['body-healing', 'shame', 'self-love', 'purity-culture', 'identity'],
    description: 'Sonya Renee Taylor on radical body acceptance'
  },
  {
    asin: '0738285390',
    name: 'The Body Keeps the Score: Brain, Mind, and Body in the Healing of Trauma',
    category: 'trauma-healing',
    tags: ['trauma', 'body', 'ptsd', 'healing', 'nervous-system'],
    description: 'Bessel van der Kolk\'s landmark work on trauma and the body'
  },

  // === IDENTITY & MEANING-MAKING ===
  {
    asin: '1572245530',
    name: 'The Values Clarification Handbook',
    category: 'identity',
    tags: ['identity', 'values', 'meaning', 'post-faith', 'self-discovery'],
    description: 'Practical guide to clarifying personal values after leaving religion'
  },
  {
    asin: '1626258406',
    name: 'Get Out of Your Mind and Into Your Life: The New Acceptance and Commitment Therapy',
    category: 'therapy',
    tags: ['act', 'therapy', 'identity', 'values', 'psychological-flexibility'],
    description: 'ACT workbook for identity transitions and psychological flexibility'
  },
  {
    asin: '1572244259',
    name: 'The Mindfulness and Acceptance Workbook for Anxiety',
    category: 'therapy',
    tags: ['anxiety', 'act', 'mindfulness', 'religious-trauma', 'ocd'],
    description: 'ACT-based workbook for anxiety, including religious scrupulosity'
  },
  {
    asin: '0140449337',
    name: 'Meditations by Marcus Aurelius',
    category: 'secular-philosophy',
    tags: ['stoicism', 'secular-philosophy', 'meaning', 'post-faith', 'wisdom'],
    description: 'Stoic philosophy as a secular meaning-making framework'
  },
  {
    asin: '0062316095',
    name: 'Man\'s Search for Meaning',
    category: 'secular-philosophy',
    tags: ['meaning', 'secular-philosophy', 'post-faith', 'existentialism', 'identity'],
    description: 'Viktor Frankl on finding meaning beyond religious frameworks'
  },

  // === GRIEF & COMMUNITY ===
  {
    asin: '0062349260',
    name: 'It\'s OK That You\'re Not OK: Meeting Grief and Loss in a Culture That Doesn\'t Understand',
    category: 'grief',
    tags: ['grief', 'loss', 'community', 'leaving-religion', 'belonging'],
    description: 'Megan Devine on grief that doesn\'t fit cultural expectations'
  },
  {
    asin: '1250301939',
    name: 'The Grieving Brain: The Surprising Science of How We Learn from Love and Loss',
    category: 'grief',
    tags: ['grief', 'neuroscience', 'loss', 'leaving-religion', 'healing'],
    description: 'Mary-Frances O\'Connor on the neuroscience of grief'
  },
  {
    asin: '1250301947',
    name: 'Good Grief: Finding Peace After Pet Loss',
    category: 'grief',
    tags: ['grief', 'loss', 'healing'],
    description: 'Grief support and healing'
  },

  // === THERAPY & MENTAL HEALTH TOOLS ===
  {
    asin: '1572245468',
    name: 'Overcoming Unwanted Intrusive Thoughts: A CBT-Based Guide',
    category: 'ocd-scrupulosity',
    tags: ['ocd', 'scrupulosity', 'intrusive-thoughts', 'cbt', 'religious-trauma'],
    description: 'CBT guide for OCD and religious scrupulosity'
  },
  {
    asin: '1626253129',
    name: 'The OCD Workbook: Your Guide to Breaking Free from Obsessive-Compulsive Disorder',
    category: 'ocd-scrupulosity',
    tags: ['ocd', 'scrupulosity', 'religious-trauma', 'workbook'],
    description: 'Comprehensive OCD workbook including religious scrupulosity'
  },
  {
    asin: '1572244240',
    name: 'Coping with Trauma-Related Dissociation: Skills Training for Patients and Therapists',
    category: 'trauma-healing',
    tags: ['trauma', 'dissociation', 'ptsd', 'religious-trauma', 'therapy'],
    description: 'Skills for healing trauma-related dissociation'
  },
  {
    asin: '1572245573',
    name: 'The PTSD Workbook: Simple, Effective Techniques for Overcoming Traumatic Stress Symptoms',
    category: 'trauma-healing',
    tags: ['ptsd', 'trauma', 'religious-trauma', 'workbook', 'healing'],
    description: 'Evidence-based PTSD workbook for trauma survivors'
  },

  // === JOURNALS & WORKBOOKS ===
  {
    asin: '1523505745',
    name: 'The Five-Minute Journal: A Happier You in 5 Minutes a Day',
    category: 'journaling',
    tags: ['journaling', 'healing', 'identity', 'post-faith', 'daily-practice'],
    description: 'Daily journaling practice for healing and identity work'
  },
  {
    asin: '1572244216',
    name: 'Trauma and Recovery: The Aftermath of Violence',
    category: 'trauma-healing',
    tags: ['trauma', 'recovery', 'healing', 'religious-trauma', 'ptsd'],
    description: 'Judith Herman\'s landmark work on trauma recovery'
  },
  {
    asin: '0062300245',
    name: 'Searching for Sunday: Loving, Leaving, and Finding the Church',
    category: 'leaving-church',
    tags: ['leaving-church', 'community', 'belonging', 'deconstruction', 'memoir'],
    description: 'Rachel Held Evans on leaving and searching for community'
  },
  {
    asin: '0062300237',
    name: 'Inspired: Slaying Giants, Walking on Water, and Loving the Bible Again',
    category: 'deconstruction',
    tags: ['deconstruction', 'bible', 'rachel-held-evans', 'faith'],
    description: 'Rachel Held Evans on reclaiming a love for scripture'
  },

  // === SECULAR SPIRITUALITY ===
  {
    asin: '0060935162',
    name: 'The Hero with a Thousand Faces',
    category: 'secular-spirituality',
    tags: ['mythology', 'joseph-campbell', 'meaning', 'secular-spirituality', 'identity'],
    description: 'Joseph Campbell on the universal patterns of human meaning-making'
  },
  {
    asin: '0691017756',
    name: 'The Power of Myth',
    category: 'secular-spirituality',
    tags: ['mythology', 'joseph-campbell', 'meaning', 'secular-spirituality', 'ritual'],
    description: 'Joseph Campbell on myth and meaning beyond religion'
  },
  {
    asin: '0691019835',
    name: 'Memories, Dreams, Reflections',
    category: 'secular-spirituality',
    tags: ['jung', 'psychology', 'secular-spirituality', 'identity', 'meaning'],
    description: 'Carl Jung\'s autobiography and exploration of the psyche'
  },

  // === HIGH-CONTROL GROUPS ===
  {
    asin: '0316166685',
    name: 'Combating Cult Mind Control: The Guide to Protection, Rescue, and Recovery',
    category: 'high-control-groups',
    tags: ['cults', 'high-control', 'mind-control', 'recovery', 'leaving-religion'],
    description: 'Steven Hassan\'s guide to cult recovery'
  },
  {
    asin: '0316166677',
    name: 'Traumatic Narcissism: Relational Systems of Subjugation',
    category: 'high-control-groups',
    tags: ['narcissism', 'high-control', 'abuse', 'religious-trauma', 'recovery'],
    description: 'Understanding narcissistic systems in religious contexts'
  },

  // === FAMILY & RELATIONSHIPS ===
  {
    asin: '0062300229',
    name: 'Boundaries: When to Say Yes, How to Say No to Take Control of Your Life',
    category: 'relationships',
    tags: ['boundaries', 'family', 'relationships', 'leaving-religion', 'healing'],
    description: 'Cloud and Townsend on healthy boundaries with religious family'
  },
  {
    asin: '1572245050',
    name: 'The Emotionally Absent Mother: A Guide to Self-Healing and Getting the Love You Missed',
    category: 'relationships',
    tags: ['family', 'healing', 'attachment', 'religious-trauma', 'identity'],
    description: 'Healing from emotionally absent parenting in religious contexts'
  },

  // === SECULAR RITUAL & COMMUNITY ===
  {
    asin: '1250301955',
    name: 'How to Be a Secular Humanist: A Guide to Living Well Without Religion',
    category: 'secular-community',
    tags: ['secular-humanism', 'community', 'ritual', 'post-faith', 'meaning'],
    description: 'Building a meaningful life outside religious community'
  },
  {
    asin: '0525559574',
    name: 'Ritual: How Seemingly Senseless Acts Make Life Worth Living',
    category: 'secular-community',
    tags: ['ritual', 'secular', 'meaning', 'community', 'post-faith'],
    description: 'Dimitris Xygalatas on the science and value of ritual'
  },

  // === CHILDREN & PARENTING ===
  {
    asin: '0807014281',
    name: 'Raising Freethinkers: A Practical Guide for Parenting Beyond Belief',
    category: 'parenting',
    tags: ['parenting', 'children', 'secular', 'post-faith', 'raising-children'],
    description: 'Practical guide for raising children outside religious frameworks'
  },
  {
    asin: '0807014273',
    name: 'Parenting Beyond Belief: On Raising Ethical, Caring Kids Without Religion',
    category: 'parenting',
    tags: ['parenting', 'children', 'secular', 'ethics', 'post-faith'],
    description: 'Dale McGowan on secular parenting and ethics'
  },

  // === ANGER & FORGIVENESS ===
  {
    asin: '1572245573',
    name: 'The Dance of Anger: A Woman\'s Guide to Changing the Patterns of Intimate Relationships',
    category: 'anger',
    tags: ['anger', 'healing', 'relationships', 'religious-trauma', 'patterns'],
    description: 'Harriet Lerner on healthy anger and relationship patterns'
  },
  {
    asin: '0062641808',
    name: 'Forgiveness Is a Choice: A Step-by-Step Process for Resolving Anger and Restoring Hope',
    category: 'forgiveness',
    tags: ['forgiveness', 'anger', 'healing', 'religious-trauma', 'recovery'],
    description: 'Robert Enright on the process of genuine forgiveness'
  },

  // === ATHEISM & AGNOSTICISM ===
  {
    asin: '0618918248',
    name: 'The God Delusion',
    category: 'atheism-agnosticism',
    tags: ['atheism', 'secular', 'post-faith', 'agnosticism', 'leaving-religion'],
    description: 'Richard Dawkins on atheism and secular worldview'
  },
  {
    asin: '0743276965',
    name: 'Letter to a Christian Nation',
    category: 'atheism-agnosticism',
    tags: ['atheism', 'secular', 'post-faith', 'christianity', 'leaving-religion'],
    description: 'Sam Harris on secular alternatives to religious belief'
  },
];

export default productCatalog;
