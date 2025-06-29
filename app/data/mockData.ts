import { DailyTip, Affirmation } from '../types';

export const dailyTips: DailyTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    content: 'Drink at least 8-10 glasses of water daily. Proper hydration supports your baby\'s development and helps prevent common pregnancy discomforts like constipation and swelling.',
    category: 'health',
    isPrime: false
  },
  {
    id: '2',
    title: 'Prenatal Vitamins Matter',
    content: 'Take your prenatal vitamins daily, especially folic acid. These supplements help prevent neural tube defects and support your baby\'s brain and spine development.',
    category: 'nutrition',
    isPrime: false
  },
  {
    id: '3',
    title: 'Gentle Exercise Benefits',
    content: 'Light exercises like walking or prenatal yoga can improve your mood, reduce back pain, and prepare your body for labor. Always consult your healthcare provider first.',
    category: 'wellness',
    isPrime: false
  },
  {
    id: '4',
    title: 'Create Your Birth Plan',
    content: 'Start thinking about your birth preferences. Consider pain management options, who you want present, and your postpartum care wishes. Discuss with your healthcare team.',
    category: 'preparation',
    isPrime: true
  },
  {
    id: '5',
    title: 'Baby\'s Sleep Patterns',
    content: 'Your baby can hear your voice and heartbeat in the womb. Talk or sing to them - it helps with bonding and can be soothing after birth.',
    category: 'wellness',
    isPrime: false
  }
];

export const affirmations: Affirmation[] = [
  {
    id: '1',
    text: 'You are enough, mama. Your body is doing miraculous work.',
    category: 'confidence'
  },
  {
    id: '2',
    text: 'Each day, you grow stronger and more prepared for motherhood.',
    category: 'strength'
  },
  {
    id: '3',
    text: 'Your love for your baby is already infinite and beautiful.',
    category: 'love'
  },
  {
    id: '4',
    text: 'Trust your instincts - you already know how to be a wonderful mother.',
    category: 'confidence'
  },
  {
    id: '5',
    text: 'Take a deep breath. You and your baby are safe and loved.',
    category: 'peace'
  }
];

export const pregnancyMilestones = {
  1: { babySize: 'Poppy seed', milestone: 'Your journey begins! The miracle of life starts here.' },
  2: { babySize: 'Sesame seed', milestone: 'Baby is just a tiny cluster of cells, but growth is rapid!' },
  3: { babySize: 'Sesame seed', milestone: 'Neural tube is forming - this will become baby\'s brain and spine.' },
  4: { babySize: 'Sesame seed', milestone: 'Baby\'s heart begins to beat!' },
  5: { babySize: 'Apple seed', milestone: 'Tiny limb buds are starting to appear.' },
  6: { babySize: 'Lentil', milestone: 'Baby\'s heart is beating regularly now.' },
  7: { babySize: 'Blueberry', milestone: 'Baby has doubled in size this week!' },
  8: { babySize: 'Raspberry', milestone: 'Tiny fingers and toes are forming.' },
  9: { babySize: 'Cherry', milestone: 'Baby\'s tail disappears and muscles are developing.' },
  10: { babySize: 'Strawberry', milestone: 'Baby\'s vital organs are functional!' },
  11: { babySize: 'Lime', milestone: 'Baby can hiccup, though you can\'t feel it yet.' },
  12: { babySize: 'Plum', milestone: 'End of first trimester - major organs are developing.' },
  13: { babySize: 'Peach', milestone: 'Second trimester begins - baby\'s fingerprints are forming!' },
  14: { babySize: 'Lemon', milestone: 'Baby can make facial expressions now.' },
  15: { babySize: 'Apple', milestone: 'Baby is moving constantly, though you might not feel it yet.' },
  16: { babySize: 'Avocado', milestone: 'You might feel baby\'s first movements!' },
  17: { babySize: 'Pear', milestone: 'Baby can hear sounds from outside the womb.' },
  18: { babySize: 'Sweet potato', milestone: 'Baby is yawning and making facial expressions.' },
  19: { babySize: 'Mango', milestone: 'Baby\'s senses are developing rapidly.' },
  20: { babySize: 'Banana', milestone: 'Halfway there! Time for anatomy scan.' },
  21: { babySize: 'Carrot', milestone: 'Baby can taste what you eat through amniotic fluid.' },
  22: { babySize: 'Spaghetti squash', milestone: 'Baby\'s sense of touch is developing.' },
  23: { babySize: 'Grapefruit', milestone: 'Baby can hear your heartbeat and voice clearly.' },
  24: { babySize: 'Corn cob', milestone: 'Baby can hear your voice clearly now.' },
  25: { babySize: 'Rutabaga', milestone: 'Baby may respond to familiar voices.' },
  26: { babySize: 'Red bell pepper', milestone: 'Baby\'s eyes are beginning to open.' },
  27: { babySize: 'Cauliflower', milestone: 'Baby can recognize your voice!' },
  28: { babySize: 'Eggplant', milestone: 'Third trimester begins - baby\'s eyes can open!' },
  29: { babySize: 'Butternut squash', milestone: 'Baby\'s bones are hardening.' },
  30: { babySize: 'Large cabbage', milestone: 'Baby\'s lanugo (fine hair) starts to disappear.' },
  31: { babySize: 'Coconut', milestone: 'Baby is gaining weight rapidly now.' },
  32: { babySize: 'Jicama', milestone: 'Baby\'s bones are hardening, gaining weight rapidly.' },
  33: { babySize: 'Pineapple', milestone: 'Baby\'s immune system is developing.' },
  34: { babySize: 'Cantaloupe', milestone: 'Baby\'s lungs are maturing for breathing.' },
  35: { babySize: 'Honeydew melon', milestone: 'Baby\'s kidneys are fully developed.' },
  36: { babySize: 'Papaya', milestone: 'Baby is considered full-term in 1 more week!' },
  37: { babySize: 'Winter melon', milestone: 'Baby is now considered early term!' },
  38: { babySize: 'Leek', milestone: 'Baby is full-term and ready to be born!' },
  39: { babySize: 'Small pumpkin', milestone: 'Baby is gaining about an ounce per day.' },
  40: { babySize: 'Watermelon', milestone: 'Your due date is here - ready to meet your little one!' },
  41: { babySize: 'Watermelon', milestone: 'Baby is ready when they are - some go past due date.' },
  42: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  43: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  44: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  45: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  46: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  47: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  48: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
  49: { babySize: 'Watermelon', milestone: 'Your doctor will likely discuss induction soon.' },
};

export const translations = {
  en: {
    welcome: 'Welcome to Materna AI',
    subtitle: 'Your Trusted Voice in Motherhood',
    askQuestion: 'Ask a Question',
    pregnancyTracker: 'Pregnancy Tracker',
    dailyTip: 'Daily Tip',
    tryPrime: 'Try Materna Prime Free',
    home: 'Home',
    ask: 'Ask',
    tracker: 'Tracker',
    tips: 'Tips',
    affirmations: 'Affirmations',
    prime: 'Prime',
    notes: 'Notes'
  },
  sw: {
    welcome: 'Karibu Materna AI',
    subtitle: 'Sauti Yako ya Kuaminika katika Uongozi',
    askQuestion: 'Uliza Swali',
    pregnancyTracker: 'Kufuatilia Uja Uzito',
    dailyTip: 'Kidokezo cha Kila Siku',
    tryPrime: 'Jaribu Materna Prime Bure',
    home: 'Nyumbani',
    ask: 'Uliza',
    tracker: 'Fuatilia',
    tips: 'Vidokezo',
    affirmations: 'Uthibitisho',
    prime: 'Prime',
    notes: 'Maelezo'
  }
};