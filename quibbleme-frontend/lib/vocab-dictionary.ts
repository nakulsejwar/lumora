/**
 * Centralized Curated Vocabulary Library for Lumora Reading Missions (Grades 3–7)
 * 100% Client-side. Zero API/AI dependency.
 * Expanded to 135+ Grade 3–7 vocabulary terms across Mystery, Science, Social Studies,
 * Narrative Description, Character Traits, and Logical Reasoning.
 */

export interface WordClueData {
  word: string;
  displayWord: string;
  definition: string;
  storyContext: string;
}

export interface VocabEntry {
  definition: string;
  storyContext: string;
  priority: number; // Higher priority = preferred vocabulary word for comprehension
}

export const VOCAB_DICTIONARY: Record<string, VocabEntry> = {
  // Detective, Mystery & Evidence
  reluctant: {
    definition: "Not willing or hesitant to do something.",
    storyContext: "The character shows doubt or hesitation before acting in the story.",
    priority: 10,
  },
  reluctantly: {
    definition: "Doing something with hesitation or unwillingness.",
    storyContext: "The character acts with hesitation despite feeling unsure.",
    priority: 10,
  },
  reluctance: {
    definition: "Unwillingness or hesitation to do something.",
    storyContext: "A feeling of hesitation before making a key choice.",
    priority: 9,
  },
  investigate: {
    definition: "To examine details carefully in order to discover facts or truth.",
    storyContext: "Characters examine clues and inspect evidence to solve a mystery.",
    priority: 9,
  },
  investigation: {
    definition: "A detailed inquiry or search for evidence and truth.",
    storyContext: "The search for evidence to uncover what really happened in the case.",
    priority: 9,
  },
  inference: {
    definition: "A conclusion reached by combining text evidence with reasoning.",
    storyContext: "Connecting story clues to understand facts not directly stated.",
    priority: 9,
  },
  evidence: {
    definition: "Facts, clues, or details in a text that prove an idea is true.",
    storyContext: "Specific proof found directly inside the story passage.",
    priority: 9,
  },
  heirloom: {
    definition: "A valuable family object passed down through generations.",
    storyContext: "A prized historical artifact central to the family mystery.",
    priority: 10,
  },
  intricate: {
    definition: "Very detailed, complicated, or carefully designed.",
    storyContext: "Features complex patterns or details requiring close inspection.",
    priority: 8,
  },
  relocated: {
    definition: "Moved to a new or different place.",
    storyContext: "Objects or items were moved from their original location.",
    priority: 8,
  },
  suspicious: {
    definition: "Giving the impression that something is questionable or wrong.",
    storyContext: "Behavior or details that cause detectives to question the truth.",
    priority: 9,
  },
  accomplice: {
    definition: "A person who helps another commit a wrongdoing or crime.",
    storyContext: "Someone who assisted or cooperated in the mystery event.",
    priority: 10,
  },
  vanished: {
    definition: "Disappeared suddenly and completely.",
    storyContext: "An item or character disappeared without leaving an obvious trace.",
    priority: 8,
  },
  observation: {
    definition: "The act of noticing details carefully using one's senses.",
    storyContext: "Noticing subtle text details and physical evidence during reading.",
    priority: 8,
  },
  invaluable: {
    definition: "Extremely useful or irreplaceable; priceless.",
    storyContext: "Extremely helpful evidence or a highly prized object in the story.",
    priority: 9,
  },
  concealed: {
    definition: "Hidden or kept out of sight.",
    storyContext: "Items or clues deliberately hidden from view.",
    priority: 9,
  },
  resembled: {
    definition: "Looked like or was similar to something else.",
    storyContext: "A clue or object that shared features with something known.",
    priority: 7,
  },
  peculiar: {
    definition: "Strange, unusual, or out of the ordinary.",
    storyContext: "An odd or unexpected detail in the passage that draws attention.",
    priority: 8,
  },
  decipher: {
    definition: "To succeed in understanding, interpreting, or decoding something.",
    storyContext: "Figuring out the hidden meaning of secret notes or complex clues.",
    priority: 10,
  },
  subtle: {
    definition: "Fine, delicate, or small so that it is not immediately obvious.",
    storyContext: "Small, quiet details in the story that require close attention to spot.",
    priority: 9,
  },
  anonymous: {
    definition: "From an unknown or unrevealed source or name.",
    storyContext: "A note or tip sent without revealing who wrote it.",
    priority: 8,
  },
  alibi: {
    definition: "Claim or proof that someone was elsewhere when an event occurred.",
    storyContext: "A statement showing a character could not have caused the incident.",
    priority: 10,
  },
  baffled: {
    definition: "Totally confused, puzzled, or perplexed.",
    storyContext: "Characters struggling to make sense of strange evidence.",
    priority: 8,
  },
  cryptic: {
    definition: "Having a mysterious or hidden meaning.",
    storyContext: "A puzzling message or clue with a secret meaning.",
    priority: 9,
  },
  deduction: {
    definition: "Reaching a logical conclusion based on available facts.",
    storyContext: "Putting clues together to reach a smart, logical conclusion.",
    priority: 10,
  },
  disguise: {
    definition: "Clothes or appearance altered to hide one's identity.",
    storyContext: "Appearance changed to conceal who someone really is.",
    priority: 8,
  },
  enigma: {
    definition: "A person or thing that is mysterious, puzzling, or hard to understand.",
    storyContext: "A baffling puzzle or person shrouded in mystery.",
    priority: 9,
  },
  interrogate: {
    definition: "To question someone thoroughly and aggressively.",
    storyContext: "Asking detailed questions to discover the truth from a witness.",
    priority: 9,
  },
  motive: {
    definition: "A reason for doing something, especially one that is hidden.",
    storyContext: "The secret reason or goal behind a character's actions.",
    priority: 10,
  },
  perplexed: {
    definition: "Completely baffled or puzzled by something unexpected.",
    storyContext: "Feeling confused by strange or contradictory evidence.",
    priority: 8,
  },
  sleuth: {
    definition: "A detective or investigator who solves mysteries.",
    storyContext: "A clever investigator following clues step-by-step.",
    priority: 9,
  },
  surveillance: {
    definition: "Close observation of a person, place, or object.",
    storyContext: "Watching a location carefully to catch unexpected activity.",
    priority: 8,
  },
  uncover: {
    definition: "To reveal, expose, or bring to light something hidden.",
    storyContext: "Discovering hidden evidence or bringing truth to light.",
    priority: 8,
  },

  // Atmosphere & Descriptive Settings
  abandoned: {
    definition: "Left behind, deserted, or no longer used.",
    storyContext: "A location or building left empty and deserted for years.",
    priority: 7,
  },
  ancient: {
    definition: "Belonging to the very distant past; extremely old.",
    storyContext: "An old object or place dating back centuries in history.",
    priority: 7,
  },
  astonishing: {
    definition: "Extremely surprising or impressive; amazing.",
    storyContext: "A surprising event or discovery that leaves characters amazed.",
    priority: 8,
  },
  bewildered: {
    definition: "Deeply confused and indecisive.",
    storyContext: "Feeling overwhelmed and confused by sudden events.",
    priority: 8,
  },
  cautious: {
    definition: "Careful to avoid potential problems or dangers.",
    storyContext: "Proceeding carefully to avoid making mistakes or triggering danger.",
    priority: 7,
  },
  clandestine: {
    definition: "Kept secret or done secretively.",
    storyContext: "Secret meetings or hidden activities taking place in dark corners.",
    priority: 9,
  },
  conspicuous: {
    definition: "Attracting attention by being clearly visible or striking.",
    storyContext: "An object or clue so obvious that it stands out immediately.",
    priority: 8,
  },
  dismal: {
    definition: "Gloomy, depressing, or dreary.",
    storyContext: "A dark, cheerless setting that creates a solemn atmosphere.",
    priority: 8,
  },
  eerie: {
    definition: "Strange and frightening in a mysterious way.",
    storyContext: "A creepy sound or setting that makes characters uneasy.",
    priority: 8,
  },
  elaborate: {
    definition: "Detailed and complicated in design or planning.",
    storyContext: "A complex plan or decorated object with many intricate parts.",
    priority: 8,
  },
  exquisite: {
    definition: "Extremely beautiful and delicate.",
    storyContext: "A finely crafted object of great beauty and high quality.",
    priority: 8,
  },
  formidable: {
    definition: "Inspiring fear or respect through being impressively large or powerful.",
    storyContext: "A tough challenge or powerful opponent standing in the way.",
    priority: 9,
  },
  hazardous: {
    definition: "Risky, dangerous, or full of peril.",
    storyContext: "A dangerous situation or environment requiring extreme care.",
    priority: 8,
  },
  illuminated: {
    definition: "Lit up or made bright with light.",
    storyContext: "A light shining suddenly to reveal dark areas or hidden paths.",
    priority: 7,
  },
  immense: {
    definition: "Extremely large, huge, or vast.",
    storyContext: "An enormous structure, space, or amount of effort.",
    priority: 7,
  },
  luminous: {
    definition: "Full of light, glowing, or shining brightly in the dark.",
    storyContext: "Objects or markings that glow brightly in low light.",
    priority: 8,
  },
  majestic: {
    definition: "Having or showing impressive beauty or dignity.",
    storyContext: "A grand, beautiful natural scene or grand structure.",
    priority: 8,
  },
  monumental: {
    definition: "Great in size, extent, or importance.",
    storyContext: "A massive achievement or historically important discovery.",
    priority: 8,
  },
  obscure: {
    definition: "Not discovered or known about; uncertain.",
    storyContext: "Details that are hard to see or understand clearly.",
    priority: 8,
  },
  ominous: {
    definition: "Giving the impression that something bad is going to happen.",
    storyContext: "Threatening signs or dark clouds warning of upcoming trouble.",
    priority: 9,
  },
  radiant: {
    definition: "Shining or glowing brightly.",
    storyContext: "A bright light or happy expression radiating energy.",
    priority: 7,
  },
  remarkable: {
    definition: "Worthy of attention; extraordinary or striking.",
    storyContext: "An unusual quality or accomplishment that stands out.",
    priority: 7,
  },
  sinister: {
    definition: "Giving the impression that something harmful or evil is happening.",
    storyContext: "A threatening figure or dark plot behind the scenes.",
    priority: 9,
  },
  solitary: {
    definition: "Existing, living, or produced alone.",
    storyContext: "A lone figure or isolated building away from everyone else.",
    priority: 7,
  },
  spectacular: {
    definition: "Beautiful in a dramatic and eye-catching way.",
    storyContext: "A dramatic sight or impressive display that captivates viewers.",
    priority: 7,
  },
  treacherous: {
    definition: "Hazardous, unpredictable, or presenting hidden dangers.",
    storyContext: "Dangerous ground, steep trails, or slippery paths.",
    priority: 9,
  },
  vivid: {
    definition: "Producing powerful, clear, or detailed mental images.",
    storyContext: "Clear, colorful descriptions that make story scenes come alive.",
    priority: 8,
  },

  // Character Traits, Actions & Emotions
  adamant: {
    definition: "Refusing to be persuaded or to change one's mind.",
    storyContext: "A character holding firmly to their decision despite pressure.",
    priority: 9,
  },
  ambitious: {
    definition: "Having or showing a strong desire and determination to succeed.",
    storyContext: "Setting high goals and working tirelessly to achieve them.",
    priority: 8,
  },
  apprehensive: {
    definition: "Anxious or fearful that something bad or unpleasant will happen.",
    storyContext: "Feeling nervous before stepping into an unknown or risky situation.",
    priority: 9,
  },
  audacious: {
    definition: "Showing a willingness to take surprisingly bold risks.",
    storyContext: "Making a daring, fearless move when others hesitate.",
    priority: 9,
  },
  compassionate: {
    definition: "Feeling or showing sympathy and concern for others.",
    storyContext: "Helping someone in distress with kindness and understanding.",
    priority: 8,
  },
  defiant: {
    definition: "Showing open resistance or bold disobedience.",
    storyContext: "Standing up boldly against unfair rules or opponents.",
    priority: 8,
  },
  determined: {
    definition: "Having made a firm decision and being resolved not to change it.",
    storyContext: "Pushing forward past obstacles without giving up.",
    priority: 8,
  },
  diligent: {
    definition: "Having or showing care and conscientious effort in one's work.",
    storyContext: "Working carefully and thoroughly to check every detail.",
    priority: 8,
  },
  empathy: {
    definition: "The ability to understand and share the feelings of another.",
    storyContext: "Understanding how another character feels deep down.",
    priority: 8,
  },
  hesitant: {
    definition: "Tentative, slow, or unwilling to act due to uncertainty.",
    storyContext: "Pausing before speaking or moving forward due to doubt.",
    priority: 7,
  },
  indignant: {
    definition: "Feeling or showing anger at what is perceived as unfair treatment.",
    storyContext: "Reacting with outrage to an unfair accusation or rule.",
    priority: 9,
  },
  meticulous: {
    definition: "Showing great attention to detail; extremely careful and precise.",
    storyContext: "Checking every clue and note with extreme precision.",
    priority: 9,
  },
  pensive: {
    definition: "Engaged in, involving, or reflecting deep or serious thought.",
    storyContext: "Sitting quietly while pondering a difficult decision or puzzle.",
    priority: 8,
  },
  persistent: {
    definition: "Continuing firmly in a course of action despite difficulty or opposition.",
    storyContext: "Continuing to search for truth even when progress is slow.",
    priority: 8,
  },
  relentless: {
    definition: "Unceasingly intense or harsh; never giving up.",
    storyContext: "Working tirelessly without stopping until the task is complete.",
    priority: 9,
  },
  resourceful: {
    definition: "Having the ability to find quick and clever ways to overcome difficulties.",
    storyContext: "Using everyday items in clever ways to solve unexpected problems.",
    priority: 8,
  },
  skeptical: {
    definition: "Not easily convinced; having doubts or reservations.",
    storyContext: "Questioning claims until solid proof is presented.",
    priority: 9,
  },
  stubborn: {
    definition: "Unreasonably obstinate; refusing to change one's stance.",
    storyContext: "Holding tightly to an opinion even when presented with new facts.",
    priority: 7,
  },
  timid: {
    definition: "Showing a lack of courage or confidence; easily frightened.",
    storyContext: "Stepping back quietly due to shyness or fear.",
    priority: 7,
  },
  valiant: {
    definition: "Possessing or showing courage or determination; brave.",
    storyContext: "Showing bravery in the face of danger to protect others.",
    priority: 9,
  },
  vigilant: {
    definition: "Keeping careful watch for possible danger or difficulties.",
    storyContext: "Staying alert and watchful to spot any unexpected movement.",
    priority: 9,
  },

  // Movement, Change & Navigation
  accelerated: {
    definition: "Sped up or moved faster.",
    storyContext: "Events or motion picking up speed rapidly.",
    priority: 7,
  },
  accumulated: {
    definition: "Gathered or built up gradually over time.",
    storyContext: "Dust, clues, or evidence collecting over many days.",
    priority: 7,
  },
  ascended: {
    definition: "Moved up or climbed upward.",
    storyContext: "Climbing stairs or rising higher into the air.",
    priority: 7,
  },
  collapsed: {
    definition: "Fell down or caved in suddenly.",
    storyContext: "A weak wooden structure or plan falling apart.",
    priority: 7,
  },
  descended: {
    definition: "Moved downward or fallen to a lower level.",
    storyContext: "Going down into dark basements or valleys.",
    priority: 7,
  },
  dwindled: {
    definition: "Diminished gradually in size, amount, or strength.",
    storyContext: "Supplies or daylight shrinking slowly over time.",
    priority: 8,
  },
  emerged: {
    definition: "Came into view or became known after being hidden.",
    storyContext: "Stepping out from shadows or coming into clear view.",
    priority: 7,
  },
  evaporated: {
    definition: "Turned from liquid into vapor, or vanished quickly.",
    storyContext: "Disappearing quickly like steam in the air.",
    priority: 7,
  },
  gradually: {
    definition: "Slowly over a period of time; little by little.",
    storyContext: "Changes unfolding steadily over time.",
    priority: 7,
  },
  maneuvered: {
    definition: "Moved skillfully or carefully around obstacles.",
    storyContext: "Navigating tight turns or tricky situations with skill.",
    priority: 8,
  },
  navigated: {
    definition: "Planned and directed a route or course.",
    storyContext: "Finding the correct path through complex territory or maps.",
    priority: 7,
  },
  plunged: {
    definition: "Dived or fell quickly into something.",
    storyContext: "Jumping or falling suddenly into water or darkness.",
    priority: 7,
  },
  receded: {
    definition: "Go or move back or further away from a previous position.",
    storyContext: "Floodwaters or shadows pulling back gradually.",
    priority: 8,
  },
  simultaneously: {
    definition: "At the exact same time.",
    storyContext: "Two events taking place together at the same moment.",
    priority: 8,
  },
  swiftly: {
    definition: "At high speed; quickly and smoothly.",
    storyContext: "Moving fast without delay.",
    priority: 7,
  },
  transformed: {
    definition: "Changed completely in form, appearance, or character.",
    storyContext: "Undergoing a complete change in look or nature.",
    priority: 7,
  },
  traversed: {
    definition: "Traveled across or through an area.",
    storyContext: "Crossing wide fields, oceans, or mountain ranges.",
    priority: 8,
  },

  // Science, Nature & Environment
  adaptation: {
    definition: "A change by which an organism becomes better suited to its environment.",
    storyContext: "How living things adjust to survive in their surroundings.",
    priority: 8,
  },
  biodiversity: {
    definition: "The variety of plant and animal life in a particular habitat.",
    storyContext: "The rich variety of living species in an ecosystem.",
    priority: 9,
  },
  camouflage: {
    definition: "Disguise or markings that help blend into surroundings.",
    storyContext: "Blending into trees or shadows to stay hidden.",
    priority: 8,
  },
  conservation: {
    definition: "The protection and preservation of natural resources and wildlife.",
    storyContext: "Protecting forests and animals from harm or destruction.",
    priority: 8,
  },
  ecosystem: {
    definition: "A biological community of interacting organisms and their environment.",
    storyContext: "A community where plants, animals, and weather work together.",
    priority: 8,
  },
  erosion: {
    definition: "The gradual wearing away of soil and rock by water, wind, or ice.",
    storyContext: "Wind and water slowly wearing down rock over time.",
    priority: 8,
  },
  habitat: {
    definition: "The natural home or environment of an animal, plant, or organism.",
    storyContext: "The natural environment where a species sleeps and feeds.",
    priority: 7,
  },
  migration: {
    definition: "Seasonal movement of animals from one region to another.",
    storyContext: "Birds or animals traveling long distances for warm weather.",
    priority: 8,
  },
  phenomenon: {
    definition: "A remarkable fact or event that can be observed and studied.",
    storyContext: "An unusual natural occurrence that invites scientific study.",
    priority: 9,
  },
  precipitation: {
    definition: "Rain, snow, sleet, or hail that falls to the ground.",
    storyContext: "Water falling from clouds in rain or snow storms.",
    priority: 8,
  },
  predator: {
    definition: "An animal that naturally preys on or hunts other animals.",
    storyContext: "A hunter animal searching for food in the wild.",
    priority: 7,
  },
  prey: {
    definition: "An animal that is hunted and killed by another for food.",
    storyContext: "Animals targeted by hunters in natural habitats.",
    priority: 7,
  },
  sanctuary: {
    definition: "A place of safety, protection, or refuge for wildlife.",
    storyContext: "A safe haven where animals or characters are protected.",
    priority: 8,
  },
  terrain: {
    definition: "A stretch of land, especially regarding its physical features.",
    storyContext: "The ground or landscape being traveled across.",
    priority: 7,
  },
  vegetation: {
    definition: "Plants considered collectively, especially those found in a particular area.",
    storyContext: "Lush plant life growing wild in the surroundings.",
    priority: 7,
  },

  // History & Cultural Heritage
  artifact: {
    definition: "An object made by a human being, typically of historical interest.",
    storyContext: "An ancient tool or relic discovered in an archaeological site.",
    priority: 9,
  },
  civilization: {
    definition: "An advanced stage of human social and cultural development.",
    storyContext: "An ancient society with cities, culture, and organized life.",
    priority: 8,
  },
  expedition: {
    definition: "A journey undertaken by a group with a particular purpose.",
    storyContext: "A planned journey to explore unknown lands or uncover relics.",
    priority: 8,
  },
  heritage: {
    definition: "Valued objects, traditions, or qualities passed down through generations.",
    storyContext: "Cultural traditions and history inherited from ancestors.",
    priority: 8,
  },
  indigenous: {
    definition: "Originating or occurring naturally in a particular place; native.",
    storyContext: "Native plants, animals, or communities original to a land.",
    priority: 9,
  },
  legacy: {
    definition: "Something handed down from an ancestor or predecessor.",
    storyContext: "Important gifts or achievements left behind for future generations.",
    priority: 8,
  },
  monument: {
    definition: "A statue, building, or structure built to honor a famous person or event.",
    storyContext: "A historic stone structure standing in honor of past events.",
    priority: 7,
  },
  tradition: {
    definition: "The transmission of customs or beliefs from generation to generation.",
    storyContext: "Customs practiced repeatedly over many years.",
    priority: 7,
  },
  voyage: {
    definition: "A long journey involving travel by sea or in space.",
    storyContext: "A long sea travel filled with adventure and discovery.",
    priority: 7,
  },

  // Reasoning, Analysis & Academic Terms
  analyze: {
    definition: "To examine methodically by breaking into parts to understand fully.",
    storyContext: "Studying details carefully to understand how things work.",
    priority: 8,
  },
  analysis: {
    definition: "Detailed examination of the elements or structure of something.",
    storyContext: "A careful study of facts to draw meaningful conclusions.",
    priority: 8,
  },
  assert: {
    definition: "To state a fact or belief confidently and forcefully.",
    storyContext: "Stating an opinion or claim clearly and strongly.",
    priority: 8,
  },
  clarify: {
    definition: "To make a statement or situation less confused and more comprehensible.",
    storyContext: "Explaining details so everyone understands clearly.",
    priority: 7,
  },
  comprehend: {
    definition: "To grasp mentally; understand fully.",
    storyContext: "Fully understanding the meaning of complex ideas.",
    priority: 8,
  },
  conclude: {
    definition: "To arrive at a judgment or decision by reasoning.",
    storyContext: "Forming a final opinion after reviewing all clues.",
    priority: 8,
  },
  conclusion: {
    definition: "A judgment or decision reached after considering facts.",
    storyContext: "The final decision made at the end of an investigation.",
    priority: 8,
  },
  contrast: {
    definition: "To compare two things to highlight their differences.",
    storyContext: "Looking at differences between two ideas or clues.",
    priority: 7,
  },
  evaluate: {
    definition: "To form an idea of the amount, number, or value of something; assess.",
    storyContext: "Judging how reliable or important a piece of evidence is.",
    priority: 8,
  },
  hypothesis: {
    definition: "A proposed explanation made on the basis of limited evidence as a starting point.",
    storyContext: "An educated guess tested against new clues.",
    priority: 9,
  },
  illustrate: {
    definition: "To explain or make something clear by using examples, charts, or stories.",
    storyContext: "Using examples or pictures to show what happened.",
    priority: 7,
  },
  imply: {
    definition: "To strongly suggest the truth or existence of something not expressly stated.",
    storyContext: "Hinting at a secret truth without saying it directly.",
    priority: 8,
  },
  indicate: {
    definition: "To point out, show, or serve as a sign of something.",
    storyContext: "Signs or details pointing toward a specific answer.",
    priority: 7,
  },
  interpret: {
    definition: "To explain the meaning of information, words, or actions.",
    storyContext: "Explaining what a hidden clue or code really means.",
    priority: 8,
  },
  perspective: {
    definition: "A particular attitude toward or way of regarding something; point of view.",
    storyContext: "A character's unique point of view on story events.",
    priority: 8,
  },
  significance: {
    definition: "The quality of being worthy of attention; importance.",
    storyContext: "The special importance of a hidden clue or detail.",
    priority: 8,
  },
  summarize: {
    definition: "To give a brief statement of the main points of something.",
    storyContext: "Stating the main points of the story concisely.",
    priority: 7,
  },
};

/**
 * Selects 1 to 3 meaningful target vocabulary words present in passageText.
 * Prioritizes high-value comprehension terms.
 */
export function getPassageVocabWords(passageText: string): string[] {
  if (!passageText) return [];

  // Normalize passage words
  const rawWords = passageText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/);

  const wordSet = new Set(rawWords);

  // Filter dictionary keys that exist in passage
  const matches = Object.keys(VOCAB_DICTIONARY).filter((key) => wordSet.has(key));

  // Sort matches by priority descending, then length descending
  matches.sort((a, b) => {
    const prioA = VOCAB_DICTIONARY[a]?.priority || 0;
    const prioB = VOCAB_DICTIONARY[b]?.priority || 0;
    if (prioB !== prioA) return prioB - prioA;
    return b.length - a.length;
  });

  // Limit to at most 3 words per passage
  return matches.slice(0, 3);
}

/**
 * Retrieves full WordClueData for a given matched word.
 */
export function getWordClueData(word: string, passageContextSnippet?: string): WordClueData | null {
  const normalized = word.toLowerCase().trim();
  const entry = VOCAB_DICTIONARY[normalized];
  if (!entry) return null;

  return {
    word: normalized,
    displayWord: normalized.toUpperCase(),
    definition: entry.definition,
    storyContext: passageContextSnippet || entry.storyContext,
  };
}
