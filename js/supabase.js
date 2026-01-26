/**
 * ARISE - Supabase Client Module
 * Handles authentication and cloud sync
 */

// Load configuration from config.js (not committed to git)
// If CONFIG is not available, show error
const SUPABASE_URL = window.CONFIG?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.CONFIG?.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('⚠️ CONFIGURATION ERROR: Supabase credentials not found!');
    console.error('📝 Please copy config.example.js to config.js and add your credentials');
}

// Supabase client instance (lazy init)
let _supabase = null;

function getSupabase() {
    if (!_supabase && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _supabase;
}

const SupabaseClient = {
    user: null,
    profile: null,

    init() {
        const sb = getSupabase();
        if (!sb) {
            console.warn('Supabase SDK not loaded');
            return false;
        }

        // Listen for auth state changes (including PASSWORD_RECOVERY)
        sb.auth.onAuthStateChange((event, session) => {
            console.log('Auth state change:', event);
            if (event === 'PASSWORD_RECOVERY') {
                // Dispatch custom event for App to catch
                window.dispatchEvent(new CustomEvent('arise-password-recovery'));
            }
        });

        return true;
    },


    async checkSession() {
        const sb = getSupabase();
        if (!sb) return false;

        const { data: { session } } = await sb.auth.getSession();
        if (session) {
            this.user = session.user;
            await this.loadProfile();
            return true;
        }
        return false;
    },

    async signUp(email, password, hunterName) {
        const sb = getSupabase();
        if (!sb) return { success: false, error: 'Supabase not available' };

        const { data, error } = await sb.auth.signUp({ email, password });

        if (error) {
            return { success: false, error: error.message };
        }

        if (data.user) {
            await sb.from('profiles').update({ hunter_name: hunterName }).eq('id', data.user.id);
        }

        return { success: true, data };
    },

    async signIn(email, password) {
        const sb = getSupabase();
        if (!sb) return { success: false, error: 'Supabase not available' };

        const { data, error } = await sb.auth.signInWithPassword({ email, password });

        if (error) {
            return { success: false, error: error.message };
        }

        this.user = data.user;
        await this.loadProfile();
        return { success: true, data };
    },

    async resetPassword(email) {
        const sb = getSupabase();
        if (!sb) return { success: false, error: 'Supabase not available' };

        const { error } = await sb.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + window.location.pathname
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    },

    async updatePassword(newPassword) {
        const sb = getSupabase();
        if (!sb) return { success: false, error: 'Supabase not available' };

        const { error } = await sb.auth.updateUser({ password: newPassword });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    },


    async signOut() {
        const sb = getSupabase();
        if (sb) await sb.auth.signOut();
        this.user = null;
        this.profile = null;
    },

    async loadProfile() {
        const sb = getSupabase();
        if (!this.user || !sb) return null;

        const { data, error } = await sb
            .from('profiles')
            .select('*')
            .eq('id', this.user.id)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
            return null;
        }

        this.profile = data;

        if (data) {
            Character.data.name = data.hunter_name || 'HUNTER';
            Character.data.level = data.level || 1;
            Character.data.xp = data.xp || 0;
            Character.data.totalXp = data.total_xp || 0;
            Character.data.gold = data.gold || 0;
            Character.data.keys = data.keys || 0;
            Character.data.stats = data.stats || { str: 10, vit: 10, agi: 10, int: 10, sen: 10 };
            Character.data.statPoints = data.stat_points || 0;
            Character.data.streak = data.streak || 0;
            Character.data.bestStreak = data.best_streak || 0;
            Character.data.elixirExpiresAt = data.elixir_expires_at || null;
            Character.save();
        }

        return data;
    },

    async saveProfile() {
        const sb = getSupabase();
        if (!this.user || !sb) return false;

        const { error } = await sb
            .from('profiles')
            .update({
                hunter_name: Character.data.name,
                level: Character.data.level,
                xp: Character.data.xp,
                total_xp: Character.data.totalXp,
                gold: Character.data.gold,
                keys: Character.data.keys,
                stats: Character.data.stats,
                stat_points: Character.data.statPoints,
                streak: Character.data.streak,
                best_streak: Character.data.bestStreak,
                elixir_expires_at: Character.data.elixirExpiresAt,
                shadows: Shadows.collection,
                updated_at: new Date().toISOString()
            })
            .eq('id', this.user.id);

        if (error) {
            console.error('Error saving profile:', error);
            return false;
        }

        return true;
    },

    async updateHunterName(name) {
        const sb = getSupabase();
        if (!this.user || !sb) return false;

        const { error } = await sb
            .from('profiles')
            .update({ hunter_name: name, updated_at: new Date().toISOString() })
            .eq('id', this.user.id);

        if (error) {
            console.error('Error updating hunter name:', error);
            return false;
        }

        if (this.profile) {
            this.profile.hunter_name = name;
        }
        return true;
    },

    isLoggedIn() {
        return this.user !== null;
    }
};

// Expose globally
window.SupabaseClient = SupabaseClient;
