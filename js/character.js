/**
 * ARISE - Character Module
 * Handles player stats, level, experience, and ranks
 */

const Character = {
    // Default character data
    defaults: {
        name: 'HUNTER',
        level: 1,
        xp: 0,
        totalXp: 0,
        gold: 0,
        keys: 0,
        stats: {
            str: 10,
            vit: 10,
            agi: 10,
            int: 10,
            sen: 10
        },
        statPoints: 0,
        streak: 0,
        bestStreak: 0,
        lastLoginDate: null,
        createdAt: null
    },

    checkDailyLogin() {
        const today = new Date().toDateString();
        const lastLogin = this.data.lastLoginDate;

        // Already claimed today?
        if (lastLogin === today) {
            return {
                claimed: true,
                streak: this.data.streak,
                reward: 0,
                canClaim: false
            };
        }

        // Calculate potential streak but DO NOT save yet
        let potentialStreak = this.data.streak;

        if (lastLogin) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLogin === yesterday.toDateString()) {
                potentialStreak++;
            } else {
                potentialStreak = 1;
            }
        } else {
            potentialStreak = 1;
        }

        // Calculate reward
        let reward = 0;
        const day = potentialStreak;

        if (day >= 7) reward = 1000;
        else if (day === 6) reward = 600;
        else if (day === 5) reward = 500;
        else if (day === 4) reward = 400;
        else if (day === 3) reward = 300;
        else if (day === 2) reward = 200;
        else reward = 100;

        return {
            claimed: false,
            canClaim: true,
            streak: potentialStreak,
            reward: reward,
            isBest: potentialStreak > this.data.bestStreak
        };
    },

    claimDailyReward() {
        const status = this.checkDailyLogin();
        if (!status.canClaim) return false;

        const today = new Date().toDateString();

        this.data.streak = status.streak;
        if (this.data.streak > this.data.bestStreak) {
            this.data.bestStreak = this.data.streak;
        }

        this.addGold(status.reward);
        this.data.lastLoginDate = today;
        this.save();

        return status;
    },

    addGold(amount) {
        this.data.gold = (this.data.gold || 0) + amount;
        this.save();
        return this.data.gold;
    },

    spendGold(amount) {
        if ((this.data.gold || 0) >= amount) {
            this.data.gold -= amount;
            this.save();
            return true;
        }
        return false;
    },

    addKey(amount = 1) {
        this.data.keys = (this.data.keys || 0) + amount;
        this.save();
        return this.data.keys;
    },

    hasKey() {
        return (this.data.keys || 0) > 0;
    },

    useKey() {
        if (this.hasKey()) {
            this.data.keys--;
            this.save();
            return true;
        }
        return false;
    },

    ranks: [
        { id: 'e', minLevel: 1, color: '#808080', glowColor: 'rgba(128, 128, 128, 0.5)', avatar: 'assets/rank-e.png' },
        { id: 'd', minLevel: 5, color: '#4a9eff', glowColor: 'rgba(74, 158, 255, 0.5)', avatar: 'assets/rank-d.png' },
        { id: 'c', minLevel: 15, color: '#00d9ff', glowColor: 'rgba(0, 217, 255, 0.5)', avatar: 'assets/rank-c.png' },
        { id: 'b', minLevel: 30, color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.5)', avatar: 'assets/rank-b.png' },
        { id: 'a', minLevel: 50, color: '#ffd700', glowColor: 'rgba(255, 215, 0, 0.5)', avatar: 'assets/rank-a.png' },
        { id: 's', minLevel: 75, color: '#ff4757', glowColor: 'rgba(255, 71, 87, 0.6)', avatar: 'assets/rank-s.png' }
    ],

    data: null,

    init() {
        this.data = Storage.load(Storage.KEYS.CHARACTER) || {
            ...this.defaults,
            createdAt: new Date().toISOString()
        };
        // Grant requested gold
        this.addGold(500);

        if ((this.data.gold || 0) < 500) {
            this.data.gold = 500;
        }
        this.save();
        return this.data;
    },

    save() {
        Storage.save(Storage.KEYS.CHARACTER, this.data);
        // Sync to cloud if logged in
        if (window.SupabaseClient && window.SupabaseClient.isLoggedIn()) {
            window.SupabaseClient.saveProfile();
        }
    },

    getXpForLevel(level) {
        if (level <= 10) return 100;
        if (level <= 25) return 200;
        if (level <= 50) return 350;
        return 500;
    },

    getStatPointsForLevel(level) {
        if (level <= 10) return 2;
        if (level <= 25) return 3;
        if (level <= 50) return 4;
        return 5;
    },

    addXp(amount, statType = null) {
        this.data.xp += amount;
        this.data.totalXp += amount;

        const xpNeeded = this.getXpForLevel(this.data.level);
        let leveledUp = false;
        let newLevel = this.data.level;
        let rankChanged = false;
        const oldRank = this.getRank();

        while (this.data.xp >= xpNeeded) {
            this.data.xp -= xpNeeded;
            this.data.level++;
            newLevel = this.data.level;
            leveledUp = true;
            const points = this.getStatPointsForLevel(this.data.level);
            this.data.statPoints += points;
        }

        if (statType && this.data.stats[statType] !== undefined) {
            this.data.stats[statType] += 1;
        }

        const newRank = this.getRank();
        rankChanged = oldRank.id !== newRank.id;

        this.save();

        return {
            leveledUp,
            newLevel,
            rankChanged,
            newRank,
            currentXp: this.data.xp,
            maxXp: this.getXpForLevel(this.data.level)
        };
    },

    removeXp(amount, statType) {
        this.data.xp = Math.max(0, this.data.xp - amount);
        this.data.totalXp = Math.max(0, this.data.totalXp - amount);

        if (statType && this.data.stats[statType] !== undefined) {
            this.data.stats[statType] = Math.max(0, this.data.stats[statType] - 1);
        }

        this.save();
        return {
            currentXp: this.data.xp,
            maxXp: this.getXpForLevel(this.data.level)
        };
    },

    getRank() {
        let currentRank = this.ranks[0];
        for (const rank of this.ranks) {
            if (this.data.level >= rank.minLevel) {
                currentRank = rank;
            }
        }
        const details = i18n.t('ranks')[currentRank.id];
        return { ...currentRank, name: details.name, description: details.desc };
    },

    getNextRank() {
        const currentRank = this.getRank();
        const currentIndex = this.ranks.findIndex(r => r.id === currentRank.id);
        if (currentIndex < this.ranks.length - 1) {
            const next = this.ranks[currentIndex + 1];
            const details = i18n.t('ranks')[next.id];
            return { ...next, name: details.name, description: details.desc };
        }
        return null;
    },

    getLevelsToNextRank() {
        const nextRank = this.getNextRank();
        if (nextRank) {
            return nextRank.minLevel - this.data.level;
        }
        return 0;
    },

    getTitle() {
        return this.getRank().name;
    },

    incrementStreak() {
        this.data.streak++;
        if (this.data.streak > this.data.bestStreak) {
            this.data.bestStreak = this.data.streak;
        }
        this.save();
        return this.data.streak;
    },

    resetStreak() {
        this.data.streak = 0;
        this.save();
    },

    allocateStat(statType) {
        if (this.data.statPoints > 0 && this.data.stats[statType] !== undefined) {
            this.data.stats[statType]++;
            this.data.statPoints--;
            this.save();
            return true;
        }
        return false;
    },

    getXpProgress() {
        const maxXp = this.getXpForLevel(this.data.level);
        return (this.data.xp / maxXp) * 100;
    },

    reset() {
        this.data = {
            ...this.defaults,
            createdAt: new Date().toISOString()
        };
        this.save();
    }
};
