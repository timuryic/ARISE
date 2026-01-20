/**
 * ARISE - Rewards Module
 */

const Rewards = {
  list: [
    {
      id: 'book_atomic_habits',
      category: 'книга',
      title: 'Атомные привычки (Джеймс Клир)',
      icon: '📚',
      condition: { type: 'level', value: 5 },
      conditionText: 'Уровень 5',
      content: '<p>Легендарная книга о том, как маленькие изменения приводят к выдающимся результатам.</p>',
      downloadUrl: 'https://archive.org/download/atomic-habits-pdf/Atomic%20Habits.pdf'
    },
    {
      id: 'book_cant_hurt_me',
      category: 'книга',
      title: "Can't Hurt Me (Дэвид Гоггинс)",
      icon: '💪',
      condition: { type: 'level', value: 10 },
      conditionText: 'Уровень 10',
      content: '<p>История самого выносливого человека в мире.</p>',
      downloadUrl: 'https://archive.org/download/david-goggins-cant-hurt-me/David%20Goggins%20-%20Can%27t%20Hurt%20Me.pdf'
    },
    {
      id: 'book_deep_work',
      category: 'книга',
      title: 'В работу с головой (Кэл Ньюпорт)',
      icon: '🧠',
      condition: { type: 'level', value: 15 },
      conditionText: 'Уровень 15',
      content: '<p>Книга о том, как достичь максимальной концентрации.</p>',
      downloadUrl: 'https://archive.org/download/deep-work-cal-newport/Deep%20Work.pdf'
    },
    {
      id: 'person_goggins',
      category: 'личность',
      title: 'Дэвид Гоггинс',
      icon: '🎖️',
      condition: { type: 'streak', value: 7 },
      conditionText: '7 дней подряд',
      content: '<p>Бывший морской котик, ультрамарафонец, рекордсмен по подтягиваниям.</p>'
    },
    {
      id: 'person_musashi',
      category: 'личность',
      title: 'Миямото Мусаси',
      icon: '⚔️',
      condition: { type: 'streak', value: 14 },
      conditionText: '14 дней подряд',
      content: '<p>Величайший самурай в истории, мастер меча и стратег.</p>'
    },
    {
      id: 'meditation_box',
      category: 'техника',
      title: 'Box Breathing (Квадратное дыхание)',
      icon: '🌬️',
      condition: { type: 'stat', stat: 'int', value: 15 },
      conditionText: 'INT 15',
      content: '<ol><li>Вдох — 4 сек</li><li>Задержка — 4 сек</li><li>Выдох — 4 сек</li><li>Задержка — 4 сек</li></ol>'
    }
  ],

  quotes: [
    "Проснись. Пришло время поднять свой уровень.",
    "Единственный предел — это твой разум.",
    "Тяжелая работа сегодня — это сила завтра.",
    "Ты охотник или добыча?",
    "ARISE."
  ],

  init() {
    console.log('Rewards Module Initializing...');
    return true;
  },

  getAllRewards() {
    return this.list;
  },

  getReward(id) {
    return this.list.find(r => r.id === id);
  },

  isUnlocked(rewardId) {
    const reward = this.getReward(rewardId);
    if (!reward) return false;

    const charData = Character.data;
    const cond = reward.condition;

    switch (cond.type) {
      case 'level':
        return charData.level >= cond.value;
      case 'streak':
        return charData.streak >= cond.value;
      case 'stat':
        return charData.stats[cond.stat] >= cond.value;
      default:
        return false;
    }
  },

  getRandomQuote() {
    const index = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[index];
  }
};
