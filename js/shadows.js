/**
 * ARISE - Shadow Army Module
 */

const Shadows = {
    collection: [],

    // Ranks and their power/probability
    ranks: {
        'infantry': { name: 'Infantry', nameRu: 'Пехотинец', power: 10, chance: 0.6, color: '#a0a0a0' },
        'mage': { name: 'Shadow Mage', nameRu: 'Теневой Маг', power: 25, chance: 0.25, color: '#8a2be2' },
        'tank': { name: 'Iron Knight', nameRu: 'Железный Рыцарь', power: 50, chance: 0.1, color: '#4682b4' },
        'commander': { name: 'Commander', nameRu: 'Командир', power: 150, chance: 0.04, color: '#ffd700' },
        'igris': { name: 'Igris', nameRu: 'Игрис', power: 500, chance: 0.01, color: '#ff4500' }
    },

    init() {
        const saved = Storage.load('arise_shadows');
        if (saved) {
            this.collection = saved;
        }
    },

    save() {
        Storage.save('arise_shadows', this.collection);
        // Sync to cloud if logged in
        if (window.SupabaseClient && window.SupabaseClient.isLoggedIn()) {
            window.SupabaseClient.saveProfile();
        }
    },

    extract() {
        const roll = Math.random();
        let cumulative = 0;
        let selectedRank = 'infantry';

        // simple weighted random
        // 0.6 -> infantry
        // 0.85 -> mage
        // 0.95 -> tank
        // 0.99 -> commander
        // 1.00 -> igris

        if (roll < 0.6) selectedRank = 'infantry';
        else if (roll < 0.85) selectedRank = 'mage';
        else if (roll < 0.95) selectedRank = 'tank';
        else if (roll < 0.99) selectedRank = 'commander';
        else selectedRank = 'igris';

        const template = this.ranks[selectedRank];
        const newShadow = {
            id: Date.now().toString(),
            rankKey: selectedRank,
            name: template.name, // Can be renamed later?
            level: 1,
            power: template.power,
            dateObtained: Date.now()
        };

        this.collection.push(newShadow);
        this.save();

        // Return details for UI/Notification
        return {
            success: true,
            shadow: newShadow,
            template: template
        };
    },

    getArmyPower() {
        return this.collection.reduce((total, shadow) => total + shadow.power, 0);
    },

    getCollection() {
        return this.collection;
    }
};
