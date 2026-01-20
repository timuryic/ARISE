/**
 * ARISE - History Module
 */

const History = {
    logs: [],
    MAX_LOGS: 50,

    init() {
        this.logs = Storage.load(Storage.KEYS.HISTORY) || [];
    },

    add(type, details) {
        const entry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            timestamp: new Date().getTime(),
            type: type,
            details: details
        };

        this.logs.unshift(entry);

        if (this.logs.length > this.MAX_LOGS) {
            this.logs = this.logs.slice(0, this.MAX_LOGS);
        }

        this.save();
        return entry;
    },

    getLogs() {
        return this.logs;
    },

    clear() {
        this.logs = [];
        this.save();
    },

    save() {
        Storage.save(Storage.KEYS.HISTORY, this.logs);
    }
};
