/**
 * ARISE - Storage Module
 * Handles all localStorage operations
 */

const Storage = {
  KEYS: {
    CHARACTER: 'arise_character',
    QUESTS: 'arise_quests',
    REWARDS: 'arise_rewards',
    HISTORY: 'arise_history',
    SETTINGS: 'arise_settings',
    LAST_DATE: 'arise_last_date'
  },

  /**
   * Initialize Storage
   */
  init() {
    console.log('Storage Module Initializing...');
    return true;
  },

  /**
   * Save data to localStorage
   */
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  /**
   * Load data from localStorage
   */
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  /**
   * Remove data from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  /**
   * Clear all ARISE data
   */
  clearAll() {
    Object.values(this.KEYS).forEach(key => {
      this.remove(key);
    });
  },

  /**
   * Get today's date string (YYYY-MM-DD)
   */
  getTodayString() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Check if it's a new day since last check
   */
  isNewDay() {
    const lastDate = this.load(this.KEYS.LAST_DATE);
    const today = this.getTodayString();

    if (lastDate !== today) {
      this.save(this.KEYS.LAST_DATE, today);
      return true;
    }
    return false;
  },

  /**
   * Export all data as JSON
   */
  exportData() {
    const data = {};
    Object.entries(this.KEYS).forEach(([name, key]) => {
      data[name] = this.load(key);
    });
    return JSON.stringify(data, null, 2);
  },

  /**
   * Import data from JSON
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(this.KEYS).forEach(([name, key]) => {
        if (data[name]) {
          this.save(key, data[name]);
        }
      });
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
};
