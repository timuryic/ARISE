/**
 * ARISE - Internationalization (i18n) Module
 */

const i18n = {
    currentLang: 'ru',

    strings: {
        ru: {
            navProfile: 'Профиль', navQuests: 'Квесты', navRewards: 'Награды', navShop: 'Магазин', navGates: 'Врата', navHistory: 'История',
            questTitle: 'КВЕСТЫ', questSubtitle: '[Ежедневный квест: <strong>Режим тренировки начался.</strong>]',
            questGoals: 'ЦЕЛИ', questWarning: '<strong>ВНИМАНИЕ:</strong> Невыполнение квеста приведёт к <strong>штрафу</strong>.',
            profileStats: 'ХАРАКТЕРИСТИКИ', profileStreak: 'дней подряд', profileNextRank: 'До', profileLevels: 'уровней',
            rewardsTitle: 'НАГРАДЫ', rewardsDesc: 'Выполняй квесты и получай полезный контент',
            rewardsLocked: '⚠️ ДОСТУП ОГРАНИЧЕН. Условие:', rewardsClose: 'Закрыть', rewardsDownload: '📥 Скачать материалы',
            settingsTitle: 'НАСТРОЙКИ КВЕСТОВ', settingsAdd: '+ Добавить квест', settingsJournal: 'ЖУРНАЛ ИЗМЕНЕНИЙ',
            settingsReset: 'Сбросить к стандартным', settingsEdit: 'РЕДАКТИРОВАТЬ', settingsNew: 'НОВЫЙ КВЕСТ',
            settingsName: 'Название', settingsIcon: 'Иконка', settingsTarget: 'Цель (количество)',
            settingsUnit: 'Единица измерения', settingsStat: 'Характеристика', settingsCancel: 'Отмена',
            settingsSave: 'Сохранить', settingsDelete: 'Удалить квест',
            raidStarted: 'РЕЙД НАЧАЛСЯ', raidDesc: 'Победите босса за 24 часа!', attack: 'АТАКА!',
            damageDealt: 'Нанесен урон', victory: 'ПОБЕДА!', gained: 'Получено',
            dailyLogin: 'ЕЖЕДНЕВНЫЙ ВХОД', streakReward: 'Награда', streakActive: 'АКТИВНЫЙ СТРИК',
            streakDays: 'дней', achievementUnlocked: 'ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО',
            achievements: {
                first_steps: { title: 'Первые шаги', desc: 'Достигните 2 уровня' },
                getting_stronger: { title: 'Становясь сильнее', desc: 'Достигните 5 уровня' },
                quest_novice: { title: 'Новичок', desc: 'Выполните 10 квестов' },
                big_spender: { title: 'Транжира', desc: 'Потратьте 500 золота' },
                streak_3: { title: 'Режим', desc: '3 дня подряд' },
                stat_15: { title: 'Потенциал', desc: '15 в любой характеристике' },
                rank_d: { title: 'Охотник D-ранга', desc: 'Получите ранг D' },
                level_10: { title: 'Двузначные числа', desc: 'Достигните 10 уровня' },
                goblin_slayer: { title: 'Убийца Гоблинов', desc: 'Победите босса E-ранга' },
                rich_hunter: { title: 'Богач', desc: 'Накопите 5000 золота' },
                quest_expert: { title: 'Эксперт', desc: 'Выполните 50 квестов' },
                streak_7: { title: 'Посвященный', desc: '7 дней подряд' },
                key_master: { title: 'Мастер ключей', desc: 'Иметь 3 ключа' },
                rank_s: { title: 'Охотник S-ранга', desc: 'Получите ранг S' },
                level_50: { title: 'Национальный уровень', desc: 'Достигните 50 уровня' },
                shadow_monarch: { title: 'Теневой Монарх', desc: 'Разблокируйте Экстрактор' },
                millionaire: { title: 'Миллионер', desc: 'Накопите 50,000 золота' },
                streak_30: { title: 'Неудержимый', desc: '30 дней подряд' },
                quest_master: { title: 'Мастер квестов', desc: 'Выполните 200 квестов' },
                stat_100: { title: 'Божественная сила', desc: '100 в любой характеристике' }
            },
            historyTitle: 'ИСТОРИЯ', historyAchievements: 'ДОСТИЖЕНИЯ',
            levelUp: 'LEVEL UP!', levelUpMsg: 'Ты стал сильнее!', levelUpPoints: 'очков характеристик',
            rankUp: 'RANK UP!', arise: 'ARISE!',
            ranks: {
                e: { name: 'E-РАНГ', desc: 'Самый слабый уровень. Сон Джин-Ву начинал здесь.' },
                d: { name: 'D-РАНГ', desc: 'Немного сильнее обычных людей.' },
                c: { name: 'C-РАНГ', desc: 'Боевые охотники. Работают в гильдиях.' },
                b: { name: 'B-РАНГ', desc: 'Сильные и редкие охотники.' },
                a: { name: 'A-РАНГ', desc: 'Элита. Национально известные личности.' },
                s: { name: 'S-РАНГ', desc: 'Сильнейшие. Могут изменить исход рейда.' }
            },
            damageToBoss: 'Урон боссу', completed: 'ВЫПОЛНЕНО', complete: 'ВЫПОЛНИТЬ',
            diff: { easy: 'Легко', normal: 'Нормально', hard: 'Сложно', expert: 'Эксперт', master: 'Мастер', nightmare: 'Кошмар' },
            shopTitle: 'МАГАЗИН', buy: 'Купить', soldOut: 'Продано', price: 'Цена',
            shopItems: {
                elixir_hp: { name: 'Эликсир Жизни', desc: 'Восстанавливает здоровье' },
                dungeon_key: { name: 'Ключ Врат', desc: 'Доступ в подземелья' },
                shadow_extract: { name: 'Экстрактор Теней', desc: 'Извлечение теней' }
            },
            shopMsgs: { notFound: 'Предмет не найден', unavailable: 'Предмет недоступен', bought: 'Вы купили', noGold: 'Недостаточно золота!' },
            dungeonsTitle: 'ВРАТА', keys: 'Ключи', enterGate: 'Войти', bossHp: 'HP',
            raidQuests: 'ЗАДАЧИ РЕЙДА', leaveDungeon: 'Покинуть подземелье', surrenderConfirm: 'Вы уверены? Ключ будет потерян.',
            raidErrors: { active: 'Рейд уже идет', noKeys: 'Нет ключей' },
            exercises: { pushups: 'Отжимания', squats: 'Приседания', run: 'Бег', km: 'км' },
            bosses: { e: 'ГОБЛИН-РАЗВЕДЧИК', d: 'HIGH BERTORK', c: 'STARIY WIZARD', b: 'VITAL THE BANDIT', a: 'ZOMBOMIKE', s: 'VLAD THE NARCISSUS KNIGHT' },
            stats: {
                str: { short: 'СИЛ', full: 'Сила', tooltip: 'Сила — силовые упражнения' },
                vit: { short: 'ВЫН', full: 'Выносливость', tooltip: 'Выносливость — кардио и бег' },
                agi: { short: 'ЛОВ', full: 'Ловкость', tooltip: 'Ловкость — активность' },
                int: { short: 'ИНТ', full: 'Интеллект', tooltip: 'Интеллект — чтение, медитация' },
                sen: { short: 'ДИС', full: 'Дисциплина', tooltip: 'Дисциплина — режим дня' }
            },
            ' мин': ' мин', ' км': ' км', ' шагов': ' шагов', ' стаканов': ' стаканов', 'км': 'км',
            // Account modal
            accountTitle: 'АККАУНТ', accountEmail: 'Email', accountPassword: 'Пароль', accountNickname: 'Никнейм',
            accountCreated: 'Дата регистрации', accountPlaytime: 'Время в игре', accountTotalXp: 'Всего XP',
            accountQuests: 'Квестов', accountBestStreak: 'Лучшая серия', accountLogout: 'ВЫЙТИ', accountDays: 'дн.'
        },
        en: {
            navProfile: 'Profile', navQuests: 'Quests', navRewards: 'Rewards', navShop: 'Shop', navGates: 'Gates', navHistory: 'History',
            questTitle: 'QUESTS', questSubtitle: '[Daily Quest: <strong>Training mode activated.</strong>]',
            questGoals: 'GOALS', questWarning: '<strong>WARNING:</strong> Failure to complete quest will result in <strong>penalty</strong>.',
            profileStats: 'STATS', profileStreak: 'day streak', profileNextRank: 'Until', profileLevels: 'levels',
            rewardsTitle: 'REWARDS', rewardsDesc: 'Complete quests and unlock valuable content',
            rewardsLocked: '⚠️ ACCESS DENIED. Condition:', rewardsClose: 'Close', rewardsDownload: '📥 Download materials',
            settingsTitle: 'QUEST SETTINGS', settingsAdd: '+ Add Quest', settingsJournal: 'CHANGE LOG',
            settingsReset: 'Reset to defaults', settingsEdit: 'EDIT', settingsNew: 'NEW QUEST',
            settingsName: 'Name', settingsIcon: 'Icon', settingsTarget: 'Target (amount)',
            settingsUnit: 'Unit', settingsStat: 'Stat', settingsCancel: 'Cancel',
            settingsSave: 'Save', settingsDelete: 'Delete quest',
            raidStarted: 'RAID STARTED', raidDesc: 'Defeat the boss in 24 hours!', attack: 'ATTACK!',
            damageDealt: 'Damage dealt', victory: 'VICTORY!', gained: 'Gained',
            dailyLogin: 'DAILY LOGIN', streakReward: 'Reward', streakActive: 'STREAK ACTIVE',
            streakDays: 'days', achievementUnlocked: 'ACHIEVEMENT UNLOCKED',
            achievements: {
                first_steps: { title: 'First Steps', desc: 'Reach Level 2' },
                getting_stronger: { title: 'Getting Stronger', desc: 'Reach Level 5' },
                quest_novice: { title: 'Novice Hunter', desc: 'Complete 10 Quests' },
                big_spender: { title: 'Big Spender', desc: 'Spend 500 Gold' },
                streak_3: { title: 'Routine', desc: '3 Day Login Streak' },
                stat_15: { title: 'Potent', desc: 'Reach 15 in any Stat' },
                rank_d: { title: 'D-Rank Hunter', desc: 'Reach D-Rank' },
                level_10: { title: 'Double Digits', desc: 'Reach Level 10' },
                goblin_slayer: { title: 'Goblin Slayer', desc: 'Defeat E-Rank Boss' },
                rich_hunter: { title: 'Rich Hunter', desc: 'Hold 5000 Gold' },
                quest_expert: { title: 'Expert Hunter', desc: 'Complete 50 Quests' },
                streak_7: { title: 'Dedicated', desc: '7 Day Login Streak' },
                key_master: { title: 'Key Master', desc: 'Hold 3 Dungeon Keys' },
                rank_s: { title: 'S-Rank Hunter', desc: 'Reach S-Rank' },
                level_50: { title: 'National Level', desc: 'Reach Level 50' },
                shadow_monarch: { title: 'Shadow Monarch', desc: 'Unlock Shadow Extraction' },
                millionaire: { title: 'Millionaire', desc: 'Hold 50,000 Gold' },
                streak_30: { title: 'Unstoppable', desc: '30 Day Login Streak' },
                quest_master: { title: 'Quest Master', desc: 'Complete 200 Quests' },
                stat_100: { title: 'Godlike Power', desc: 'Reach 100 in any Stat' }
            },
            historyTitle: 'HISTORY', historyAchievements: 'ACHIEVEMENTS',
            levelUp: 'LEVEL UP!', levelUpMsg: 'You got stronger!', levelUpPoints: 'stat points',
            rankUp: 'RANK UP!', arise: 'ARISE!',
            ranks: {
                e: { name: 'E-RANK', desc: 'Weakest level. Sung Jin-Woo started here.' },
                d: { name: 'D-RANK', desc: 'Slightly stronger than normal humans.' },
                c: { name: 'C-RANK', desc: 'Combat hunters. Work in guilds.' },
                b: { name: 'B-RANK', desc: 'Strong and rare hunters.' },
                a: { name: 'A-RANK', desc: 'Elite. Nationally famous.' },
                s: { name: 'S-RANK', desc: 'Strongest. Can change raid outcome alone.' }
            },
            damageToBoss: 'Damage to Boss', completed: 'COMPLETED', complete: 'COMPLETE',
            diff: { easy: 'Easy', normal: 'Normal', hard: 'Hard', expert: 'Expert', master: 'Master', nightmare: 'Nightmare' },
            shopTitle: 'SHOP', buy: 'Buy', soldOut: 'Sold Out', price: 'Price',
            shopItems: {
                elixir_hp: { name: 'Elixir of Life', desc: 'Restores health' },
                dungeon_key: { name: 'Dungeon Key', desc: 'Access to dungeons' },
                shadow_extract: { name: 'Shadow Extract', desc: 'Extract shadows' }
            },
            shopMsgs: { notFound: 'Item not found', unavailable: 'Item unavailable', bought: 'You bought', noGold: 'Not enough gold!' },
            dungeonsTitle: 'GATES', keys: 'Keys', enterGate: 'Enter', bossHp: 'HP',
            raidQuests: 'RAID QUESTS', leaveDungeon: 'Leave Dungeon', surrenderConfirm: 'Are you sure? Key will be lost.',
            raidErrors: { active: 'Raid already active', noKeys: 'No keys available' },
            exercises: { pushups: 'Pushups', squats: 'Squats', run: 'Run', km: 'km' },
            bosses: { e: 'GOBLIN SCOUT', d: 'HIGH BERTORK', c: 'STARIY WIZARD', b: 'VITAL THE BANDIT', a: 'ZOMBOMIKE', s: 'VLAD THE NARCISSUS KNIGHT' },
            stats: {
                str: { short: 'STR', full: 'Strength', tooltip: 'Strength — strength exercises' },
                vit: { short: 'VIT', full: 'Vitality', tooltip: 'Vitality — cardio and running' },
                agi: { short: 'AGI', full: 'Agility', tooltip: 'Agility — daily activity' },
                int: { short: 'INT', full: 'Intelligence', tooltip: 'Intelligence — reading, meditation' },
                sen: { short: 'SEN', full: 'Discipline', tooltip: 'Discipline — daily routine' }
            },
            ' мин': ' min', ' км': ' km', ' шагов': ' steps', ' стаканов': ' cups', 'км': 'km',
            // Account modal
            accountTitle: 'ACCOUNT', accountEmail: 'Email', accountPassword: 'Password', accountNickname: 'Nickname',
            accountCreated: 'Registered', accountPlaytime: 'Play time', accountTotalXp: 'Total XP',
            accountQuests: 'Quests', accountBestStreak: 'Best streak', accountLogout: 'LOGOUT', accountDays: 'days'
        }
    },

    init() {
        const saved = localStorage.getItem('arise_lang');
        if (saved && (saved === 'ru' || saved === 'en')) {
            this.currentLang = saved;
        }
        return this.currentLang;
    },

    t(key) {
        return this.strings[this.currentLang][key] || this.strings['ru'][key] || key;
    },

    getQuestName(quest) {
        return this.currentLang === 'ru' ? quest.nameRu : quest.name;
    },

    toggle() {
        this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('arise_lang', this.currentLang);
        return this.currentLang;
    },

    getLang() {
        return this.currentLang;
    }
};
