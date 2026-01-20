/**
 * ARISE - Shop Module
 */

const Shop = {
    items: [
        { id: 'elixir_hp', nameKey: 'elixir_hp', price: 100, icon: '🧪', available: true },
        { id: 'dungeon_key', nameKey: 'dungeon_key', price: 500, icon: '🔑', available: true },
        { id: 'shadow_extract', nameKey: 'shadow_extract', price: 5000, icon: '🌑', available: false }
    ],

    init() {},

    getItems() {
        return this.items;
    },

    buyItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return { success: false, message: i18n.t('shopMsgs').notFound };

        if (!item.available) {
            return { success: false, message: i18n.t('shopMsgs').unavailable };
        }

        if (Character.spendGold(item.price)) {
            if (itemId === 'dungeon_key') {
                Character.addKey(1);
            }
            const details = i18n.t('shopItems')[item.nameKey];
            const name = details ? details.name : item.id;
            return { success: true, message: `${i18n.t('shopMsgs').bought} ${name}!` };
        } else {
            return { success: false, message: i18n.t('shopMsgs').noGold };
        }
    }
};
