/**
 * ARISE - Dungeon Module (Raid System)
 */

const Dungeon = {
    activeRaid: null,

    bosses: {
        'e': {
            nameKey: 'e',
            hp: 50,
            rewardXp: 50,
            rewardGold: 100,
            color: '#808080',
            // Progressive assets
            assets: {
                normal: 'assets/goblin.png',
                damaged: 'assets/goblin_damaged.png',
                critical: 'assets/goblin_critical.png',
                defeated: 'assets/goblin_defeated.png'
            },
            // Fallback for others currently
            image: '<img src="assets/goblin.png" alt="Goblin" style="max-height: 45vh; max-width: 100%; object-fit: contain;">'
        },
        'd': {
            nameKey: 'd',
            hp: 150,
            rewardXp: 100,
            rewardGold: 150,
            color: '#d63031', // Red color for demon
            assets: {
                normal: 'assets/bertork_normal.png',
                damaged: 'assets/bertork_damaged.png',
                critical: 'assets/bertork_critical.png',
                defeated: 'assets/bertork_defeated.png'
            },
            image: '<img src="assets/bertork_normal.png" alt="High Bertork" style="max-height: 45vh; max-width: 100%; object-fit: contain;">',
            quotes: [
                "Я заберу весь твой снюс..."
            ]
        },
        'c': {
            nameKey: 'c',
            hp: 400,
            rewardXp: 150,
            rewardGold: 200,
            color: '#00d9ff',
            assets: {
                normal: 'assets/wizard_normal.png',
                damaged: 'assets/wizard_damaged.png',
                critical: 'assets/wizard_critical.png',
                defeated: 'assets/wizard_defeated.png'
            },
            image: '<img src="assets/wizard_normal.png" alt="Stariy Wizard" style="max-height: 45vh; max-width: 100%; object-fit: contain;">',
            quotes: [
                "Узри силу моей МЕТЕОРЫ!"
            ]
        },
        'b': {
            nameKey: 'b',
            hp: 1000,
            rewardXp: 200,
            rewardGold: 250,
            color: '#00ff88',
            assets: {
                normal: 'assets/vital_normal.png',
                damaged: 'assets/vital_damaged.png',
                critical: 'assets/vital_critical.png',
                defeated: 'assets/vital_defeated.png'
            },
            image: '<img src="assets/vital_normal.png" alt="Vital the Bandit" style="max-height: 45vh; max-width: 100%; object-fit: contain;">',
            quotes: [
                "Пошло добро.."
            ]
        },
        'a': {
            nameKey: 'a',
            hp: 2500,
            rewardXp: 250,
            rewardGold: 300,
            color: '#ffd700',
            assets: {
                normal: 'assets/zombie_normal.png',
                damaged: 'assets/zombie_damaged.png',
                critical: 'assets/zombie_critical.png',
                defeated: 'assets/zombie_defeated.png'
            },
            image: '<img src="assets/zombie_normal.png" alt="Infected Manager" style="max-height: 45vh; max-width: 100%; object-fit: contain;">',
            quotes: [
                "Сыграем на щелбан?"
            ]
        },
        's': {
            nameKey: 's',
            hp: 10000,
            rewardXp: 300,
            rewardGold: 350,
            color: '#ff4757',
            assets: {
                normal: 'assets/vlad_normal.png',
                damaged: 'assets/vlad_damaged.png',
                critical: 'assets/vlad_critical.png',
                defeated: 'assets/vlad_defeated.png'
            },
            image: '<img src="assets/vlad_normal.png" alt="Vlad the Narcissus Knight" style="max-height: 45vh; max-width: 100%; object-fit: contain;">',
            quotes: [
                "Тебе точно есть 16?"
            ]
        }
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

        // Trigger visual update event if App methods are available
        if (window.App && App.renderRaidView) {
            App.renderRaidView();
            // Trigger shake
            const bossImg = document.querySelector('#boss-image img') || document.getElementById('boss-image');
            if (bossImg) {
                bossImg.classList.remove('boss-hit');
                void bossImg.offsetWidth; // Trigger reflow
                bossImg.classList.add('boss-hit');
            }
        }

        if (this.activeRaid.currentHp === 0) {
            return { success: true, victory: true, damage: quest.damage };
        }

        return { success: true, victory: false, damage: quest.damage };
    },

    claimVictory() {
        if (!this.activeRaid || this.activeRaid.currentHp > 0) return;

        const rank = this.activeRaid.rank;
        const xp = this.bosses[rank].rewardXp;
        const gold = this.bosses[rank].rewardGold;

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
    },

    getBossQuote(rank) {
        const boss = this.bosses[rank];
        if (!boss || !boss.quotes || boss.quotes.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * boss.quotes.length);
        return boss.quotes[randomIndex];
    },

    // Helper to get current asset based on HP %
    getBossAsset(rank, currentHp, maxHp) {
        const boss = this.bosses[rank];
        if (!boss.assets) return boss.image; // Fallback

        const pct = (currentHp / maxHp) * 100;

        if (currentHp <= 0) return `<img src="${boss.assets.defeated}" alt="${boss.nameKey}" class="boss-dead" style="max-height: 45vh; max-width: 100%; object-fit: contain;">`;
        if (pct <= 50) return `<img src="${boss.assets.critical}" alt="${boss.nameKey}" class="boss-critical" style="max-height: 45vh; max-width: 100%; object-fit: contain;">`;
        if (pct <= 70) return `<img src="${boss.assets.damaged}" alt="${boss.nameKey}" style="max-height: 45vh; max-width: 100%; object-fit: contain;">`;

        return `<img src="${boss.assets.normal}" alt="${boss.nameKey}" style="max-height: 45vh; max-width: 100%; object-fit: contain;">`;
    }
};

