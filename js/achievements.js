/**
 * ARISE - Achievements Module
 */

const Achievements = {
    list: [
        { id: 'first_steps', tier: 'bronze', icon: '🐣' },
        { id: 'getting_stronger', tier: 'bronze', icon: '💪' },
        { id: 'quest_novice', tier: 'bronze', icon: '📝' },
        { id: 'big_spender', tier: 'bronze', icon: '💰' },
        { id: 'streak_3', tier: 'bronze', icon: '🔥' },
        { id: 'stat_15', tier: 'bronze', icon: '📊' },
        { id: 'rank_d', tier: 'silver', icon: '🛡️' },
        { id: 'level_10', tier: 'silver', icon: '⭐' },
        { id: 'goblin_slayer', tier: 'silver', icon: '👹' },
        { id: 'rich_hunter', tier: 'silver', icon: '💎' },
        { id: 'quest_expert', tier: 'silver', icon: '📜' },
        { id: 'streak_7', tier: 'silver', icon: '🔥🔥' },
        { id: 'key_master', tier: 'silver', icon: '🔑' },
        { id: 'rank_s', tier: 'gold', icon: '👑' },
        { id: 'level_50', tier: 'gold', icon: '🌟' },
        { id: 'shadow_monarch', tier: 'gold', icon: '🌑' },
        { id: 'millionaire', tier: 'gold', icon: '🏦' },
        { id: 'streak_30', tier: 'gold', icon: '📅' },
        { id: 'quest_master', tier: 'gold', icon: '⚔️' },
        { id: 'stat_100', tier: 'gold', icon: '⚡' }
    ],

    unlocked: [],

    init() {
        this.unlocked = Storage.load(Storage.KEYS.ACHIEVEMENTS) || [];
    },

    isUnlocked(id) {
        return this.unlocked.includes(id);
    },

    unlock(id) {
        if (this.isUnlocked(id)) return false;

        const achievement = this.list.find(a => a.id === id);
        if (!achievement) return false;

        this.unlocked.push(id);
        this.save();

        const details = i18n.t('achievements')[id] || { title: id, desc: '' };
        History.add('ACHIEVEMENT', `Unlocked: ${details.title}`);

        return { ...achievement, title: details.title, desc: details.desc };
    },

    check() {
        const newlyUnlocked = [];
        const data = Character.data;

        if (data.level >= 2) this._tryUnlock('first_steps', newlyUnlocked);
        if (data.level >= 5) this._tryUnlock('getting_stronger', newlyUnlocked);
        if (data.level >= 10) this._tryUnlock('level_10', newlyUnlocked);
        if (data.level >= 50) this._tryUnlock('level_50', newlyUnlocked);

        const rank = Character.getRank();
        if (['d', 'c', 'b', 'a', 's'].includes(rank.id)) this._tryUnlock('rank_d', newlyUnlocked);
        if (rank.id === 's') this._tryUnlock('rank_s', newlyUnlocked);

        if (data.gold >= 5000) this._tryUnlock('rich_hunter', newlyUnlocked);
        if (data.gold >= 50000) this._tryUnlock('millionaire', newlyUnlocked);

        if (data.streak >= 3) this._tryUnlock('streak_3', newlyUnlocked);
        if (data.streak >= 7) this._tryUnlock('streak_7', newlyUnlocked);
        if (data.streak >= 30) this._tryUnlock('streak_30', newlyUnlocked);

        if (data.keys >= 3) this._tryUnlock('key_master', newlyUnlocked);

        const maxStat = Math.max(data.stats.str, data.stats.vit, data.stats.agi, data.stats.int, data.stats.sen);
        if (maxStat >= 15) this._tryUnlock('stat_15', newlyUnlocked);
        if (maxStat >= 100) this._tryUnlock('stat_100', newlyUnlocked);

        return newlyUnlocked;
    },

    _tryUnlock(id, list) {
        if (!this.isUnlocked(id)) {
            const ach = this.unlock(id);
            if (ach) list.push(ach);
        }
    },

    save() {
        Storage.save(Storage.KEYS.ACHIEVEMENTS, this.unlocked);
    }
};
