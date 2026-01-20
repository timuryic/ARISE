/**
 * ARISE - Quest Editor Module
 */

const QuestEditor = {
    STORAGE_KEY: 'arise_custom_quests',
    JOURNAL_KEY: 'arise_quest_journal',

    defaultTemplates: [
        { id: 'pushups', name: 'Push-ups', nameRu: 'Отжимания', icon: '💪', target: 100, unit: '', xp: 10, stat: 'str', category: 'strength' },
        { id: 'situps', name: 'Sit-ups', nameRu: 'Пресс', icon: '🔥', target: 100, unit: '', xp: 10, stat: 'str', category: 'strength' },
        { id: 'squats', name: 'Squats', nameRu: 'Приседания', icon: '🦵', target: 100, unit: '', xp: 10, stat: 'str', category: 'strength' },
        { id: 'running', name: 'Running', nameRu: 'Бег', icon: '🏃', target: 10, unit: 'км', xp: 10, stat: 'vit', category: 'cardio' },
        { id: 'walking', name: 'Walking', nameRu: 'Ходьба', icon: '🚶', target: 10000, unit: ' шагов', xp: 10, stat: 'agi', category: 'cardio' },
        { id: 'early_rise', name: 'Early Rise', nameRu: 'Ранний подъём', icon: '🌅', target: 1, unit: '', xp: 10, stat: 'sen', category: 'discipline' },
        { id: 'sleep_schedule', name: 'Sleep Schedule', nameRu: 'Режим сна', icon: '🌙', target: 1, unit: '', xp: 10, stat: 'sen', category: 'discipline' },
        { id: 'hydration', name: 'Hydration', nameRu: 'Водный баланс', icon: '💧', target: 8, unit: ' стаканов', xp: 10, stat: 'vit', category: 'discipline' },
        { id: 'reading', name: 'Reading', nameRu: 'Чтение', icon: '📚', target: 30, unit: ' мин', xp: 10, stat: 'int', category: 'intelligence' },
        { id: 'meditation', name: 'Meditation', nameRu: 'Медитация', icon: '🧘', target: 10, unit: ' мин', xp: 10, stat: 'int', category: 'intelligence' }
    ],

    icons: ['💪', '🔥', '🦵', '🏃', '🚶', '🌅', '🌙', '💧', '📚', '🧘', '⚡', '🎯', '🏋️', '🧗', '🚴', '🏊', '⏰', '🍎', '💤', '🧠'],

    getQuests() {
        const saved = Storage.load(this.STORAGE_KEY);
        if (saved && saved.length > 0) {
            return saved;
        }
        return JSON.parse(JSON.stringify(this.defaultTemplates));
    },

    saveQuests(quests) {
        Storage.save(this.STORAGE_KEY, quests);
        if (typeof Quests !== 'undefined') {
            Quests.definitions = quests;
        }
    },

    addQuest(quest) {
        const quests = this.getQuests();
        quest.id = 'custom_' + Date.now();
        quest.category = 'custom';
        quests.push(quest);
        this.saveQuests(quests);
        this.logChange('add', quest, null);
        return quest;
    },

    updateQuest(questId, updates) {
        const quests = this.getQuests();
        const index = quests.findIndex(q => q.id === questId);
        if (index !== -1) {
            const oldQuest = { ...quests[index] };
            quests[index] = { ...quests[index], ...updates };
            this.saveQuests(quests);
            this.logChange('update', quests[index], oldQuest);
            return quests[index];
        }
        return null;
    },

    deleteQuest(questId) {
        const quests = this.getQuests();
        const index = quests.findIndex(q => q.id === questId);
        if (index !== -1) {
            const deleted = quests.splice(index, 1)[0];
            this.saveQuests(quests);
            this.logChange('delete', null, deleted);
            return true;
        }
        return false;
    },

    resetToDefaults() {
        this.logChange('reset', null, this.getQuests());
        Storage.remove(this.STORAGE_KEY);
        if (typeof Quests !== 'undefined') {
            Quests.definitions = this.getQuests();
        }
    },

    logChange(action, newValue, oldValue) {
        const journal = this.getJournal();
        journal.push({
            timestamp: new Date().toISOString(),
            action: action,
            questName: newValue?.nameRu || oldValue?.nameRu || 'Unknown',
            details: this.getChangeDetails(action, newValue, oldValue)
        });

        if (journal.length > 100) {
            journal.shift();
        }

        Storage.save(this.JOURNAL_KEY, journal);
    },

    getChangeDetails(action, newValue, oldValue) {
        switch (action) {
            case 'add':
                return `Добавлен квест "${newValue.nameRu}" (цель: ${newValue.target}${newValue.unit})`;
            case 'delete':
                return `Удалён квест "${oldValue.nameRu}"`;
            case 'update':
                return `Изменён квест "${newValue.nameRu}"`;
            case 'reset':
                return 'Сброс к стандартным квестам';
            default:
                return action;
        }
    },

    getJournal() {
        return Storage.load(this.JOURNAL_KEY) || [];
    },

    clearJournal() {
        Storage.remove(this.JOURNAL_KEY);
    }
};
