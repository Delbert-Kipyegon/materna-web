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
  4: { babySize: 'Sesame seed', milestone: 'Baby\'s heart begins to beat!' },
  8: { babySize: 'Raspberry', milestone: 'Tiny fingers and toes are forming.' },
  12: { babySize: 'Plum', milestone: 'End of first trimester - major organs are developing.' },
  16: { babySize: 'Avocado', milestone: 'You might feel baby\'s first movements!' },
  20: { babySize: 'Sweet potato', milestone: 'Halfway there! Time for anatomy scan.' },
  24: { babySize: 'Corn cob', milestone: 'Baby can hear your voice clearly now.' },
  28: { babySize: 'Eggplant', milestone: 'Third trimester begins - baby\'s eyes can open!' },
  32: { babySize: 'Coconut', milestone: 'Baby\'s bones are hardening, gaining weight rapidly.' },
  36: { babySize: 'Papaya', milestone: 'Baby is considered full-term in 1 more week!' },
  40: { babySize: 'Watermelon', milestone: 'Your due date is here - ready to meet your little one!' }
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