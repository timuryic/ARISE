/**
 * ARISE - Quests Module
 */

const Quests = {
    definitions: [
        { id: 'pushups', name: 'Push-ups', nameRu: 'Отжимания', icon: '💪', target: 100, unit: '', xp: 50, stat: 'str', category: 'strength' },
        { id: 'situps', name: 'Sit-ups', nameRu: 'Пресс', icon: '🔥', target: 100, unit: '', xp: 50, stat: 'str', category: 'strength' },
        { id: 'squats', name: 'Squats', nameRu: 'Приседания', icon: '🦵', target: 100, unit: '', xp: 50, stat: 'str', category: 'strength' },
        { id: 'running', name: 'Running', nameRu: 'Бег', icon: '🏃', target: 10, unit: 'км', xp: 100, stat: 'vit', category: 'cardio' },
        { id: 'walking', name: 'Walking', nameRu: 'Ходьба', icon: '🚶', target: 10000, unit: ' шагов', xp: 40, stat: 'agi', category: 'cardio' },
        { id: 'early_rise', name: 'Early Rise', nameRu: 'Ранний подъём', icon: '🌅', target: 1, unit: '', xp: 30, stat: 'sen', category: 'discipline' },
        { id: 'sleep_schedule', name: 'Sleep Schedule', nameRu: 'Режим сна', icon: '🌙', target: 1, unit: '', xp: 30, stat: 'sen', category: 'discipline' },
        { id: 'hydration', name: 'Hydration', nameRu: 'Водный баланс', icon: '💧', target: 8, unit: ' стаканов', xp: 20, stat: 'vit', category: 'discipline' },
        { id: 'reading', name: 'Reading', nameRu: 'Чтение', icon: '📚', target: 30, unit: ' мин', xp: 40, stat: 'int', category: 'intelligence' },
        { id: 'meditation', name: 'Meditation', nameRu: 'Медитация', icon: '🧘', target: 10, unit: ' мин', xp: 30, stat: 'int', category: 'intelligence' }
    ],

    todayProgress: null,

    init() {
        const isNewDay = Storage.isNewDay();
        if (isNewDay) {
            this.resetDailyProgress();
        } else {
            this.todayProgress = Storage.load(Storage.KEYS.QUESTS) || this.getEmptyProgress();
        }
        return this.todayProgress;
    },

    getEmptyProgress() {
        const progress = { date: Storage.getTodayString(), quests: {} };
        this.definitions.forEach(quest => {
            progress.quests[quest.id] = { current: 0, completed: false };
        });
        return progress;
    },

    resetDailyProgress() {
        const oldProgress = Storage.load(Storage.KEYS.QUESTS);
        if (oldProgress && oldProgress.date !== Storage.getTodayString()) {
            this.saveToHistory(oldProgress);
            const allCompleted = this.definitions.every(q => oldProgress.quests[q.id]?.completed);
            if (allCompleted) {
                Character.incrementStreak();
            } else {
                Character.resetStreak();
            }
        }
        this.todayProgress = this.getEmptyProgress();
        this.save();
    },

    save() {
        Storage.save(Storage.KEYS.QUESTS, this.todayProgress);
    },

    saveToHistory(progress) {
        const history = Storage.load(Storage.KEYS.HISTORY) || [];
        const totalQuests = this.definitions.length;
        const completedQuests = this.definitions.filter(q => progress.quests[q.id]?.completed).length;
        history.push({
            date: progress.date,
            completed: completedQuests,
            total: totalQuests,
            percentage: Math.round((completedQuests / totalQuests) * 100)
        });
        if (history.length > 30) { history.shift(); }
        Storage.save(Storage.KEYS.HISTORY, history);
    },

    toggleQuest(questId) {
        const FIXED_XP = 10;
        const quest = this.definitions.find(q => q.id === questId);
        if (!quest) return null;

        const progress = this.todayProgress.quests[questId];
        const wasCompleted = progress.completed;

        if (!wasCompleted) {
            progress.current = quest.target;
            progress.completed = true;
            const result = Character.addXp(FIXED_XP, quest.stat);
            this.save();
            return { completed: true, xpChange: FIXED_XP, statGained: quest.stat, characterUpdate: result };
        } else {
            progress.current = 0;
            progress.completed = false;
            Character.removeXp(FIXED_XP, quest.stat);
            this.save();
            return { completed: false, xpChange: -FIXED_XP, statGained: quest.stat, characterUpdate: { leveledUp: false, rankChanged: false } };
        }
    },

    getQuestsWithProgress() {
        return this.definitions.map(quest => ({
            ...quest,
            current: this.todayProgress.quests[quest.id]?.current || 0,
            completed: this.todayProgress.quests[quest.id]?.completed || false
        }));
    },

    getDailyQuests() {
        return this.getQuestsWithProgress();
    },

    getQuest(questId) {
        return this.definitions.find(q => q.id === questId);
    },

    getTodayCompletion() {
        const completed = this.definitions.filter(q => this.todayProgress.quests[q.id]?.completed).length;
        return Math.round((completed / this.definitions.length) * 100);
    },

    isAllCompleted() {
        return this.definitions.every(q => this.todayProgress.quests[q.id]?.completed);
    }
};
