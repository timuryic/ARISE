/**
 * ARISE - Dungeon Module (Raid System)
 */

const Dungeon = {
    activeRaid: null,

    bosses: {
        'e': { nameKey: 'e', hp: 50, color: '#808080', image: '<img src="assets/goblin.png" alt="Goblin" style="max-height: 200px;">' },
        'd': { nameKey: 'd', hp: 150, color: '#4a9eff', image: '🐅' },
        'c': { nameKey: 'c', hp: 400, color: '#00d9ff', image: '🕷️' },
        'b': { nameKey: 'b', hp: 1000, color: '#00ff88', image: '🐕' },
        'a': { nameKey: 'a', hp: 2500, color: '#ffd700', image: '⚔️' },
        's': { nameKey: 's', hp: 10000, color: '#ff4757', image: '🐜' }
    },

    init() {
        this.activeRaid = Storage.load('arise_active_raid');
        if (this.activeRaid) {
            const now = new Date().getTime();
            if (now > this.activeRaid.deadline) {
                this.failRaid("Time limit exceeded");
            }
        }
    },

    isActive() {
        return !!this.activeRaid;
    },

    startRaid(rankId) {
        if (this.activeRaid) return { success: false, message: i18n.t('raidErrors').active };
        if (!Character.useKey()) return { success: false, message: i18n.t('raidErrors').noKeys };

        const bossTemplate = this.bosses[rankId];
        const quests = this.generateRaidQuests(rankId);

        this.activeRaid = {
            rank: rankId,
            boss: { ...bossTemplate, name: i18n.t('bosses')[rankId], maxHp: bossTemplate.hp },
            currentHp: bossTemplate.hp,
            quests: quests,
            startTime: new Date().getTime(),
            deadline: new Date().getTime() + (24 * 60 * 60 * 1000)
        };

        this.save();
        return { success: true };
    },

    generateRaidQuests(rankId) {
        const multipliers = { 'e': 1, 'd': 2, 'c': 5, 'b': 10, 'a': 25, 's': 100 };
        const mult = multipliers[rankId] || 1;
        const bossHp = this.bosses[rankId].hp;

        return [
            { id: `rq_${Date.now()}_1`, text: `${25 * mult} ${i18n.t('exercises').pushups}`, damage: Math.floor(bossHp * 0.3), completed: false },
            { id: `rq_${Date.now()}_2`, text: `${25 * mult} ${i18n.t('exercises').squats}`, damage: Math.floor(bossHp * 0.3), completed: false },
            { id: `rq_${Date.now()}_3`, text: `${1 * mult} ${i18n.t('exercises').km} ${i18n.t('exercises').run}`, damage: Math.ceil(bossHp * 0.4), completed: false }
        ];
    },

    completeQuest(questId) {
        if (!this.activeRaid) return;

        const quest = this.activeRaid.quests.find(q => q.id === questId);
        if (!quest || quest.completed) return;

        quest.completed = true;
        this.activeRaid.currentHp -= quest.damage;
        if (this.activeRaid.currentHp < 0) this.activeRaid.currentHp = 0;

        this.save();

        if (this.activeRaid.currentHp === 0) {
            return { success: true, victory: true, damage: quest.damage };
        }

        return { success: true, victory: false, damage: quest.damage };
    },

    claimVictory() {
        if (!this.activeRaid || this.activeRaid.currentHp > 0) return;

        const rank = this.activeRaid.rank;
        const xp = this.bosses[rank].hp * 2;
        const gold = this.bosses[rank].hp;

        Character.addXp(xp);
        Character.addGold(gold);

        this.activeRaid = null;
        this.save();

        return { xp, gold };
    },

    failRaid(reason) {
        console.log("Raid Failed:", reason);
        this.activeRaid = null;
        this.save();
    },

    save() {
        Storage.save('arise_active_raid', this.activeRaid);
    }
};
