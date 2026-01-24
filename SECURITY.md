# 🔒 ARISE - Security Guide

## ⚠️ CRITICAL: Your Supabase Keys Are Compromised

Your current Supabase credentials have been exposed in git history and **MUST be replaced immediately**.

---

## 🚨 Immediate Actions Required

### 1. Generate New Supabase Keys (5 minutes)

1. Go to your Supabase Dashboard:
   https://app.supabase.com/project/_/settings/api

2. Click **"Reset"** next to the **ANON key** (Public anonymous key)

3. Copy the new credentials:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long JWT token)

4. Open `config.js` in your project root

5. Replace the old values with new ones:
   ```javascript
   const CONFIG = {
       SUPABASE_URL: 'https://YOUR-NEW-PROJECT-ID.supabase.co',
       SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your new key
   };
   ```

6. Save the file

---

### 2. Set Up Row Level Security (RLS)

Even with a public ANON key, you need RLS to protect user data.

1. Go to: https://app.supabase.com/project/_/database/tables

2. Click on the `profiles` table

3. Enable **Row Level Security**

4. Add these policies:

**Policy 1: Users can read only their own profile**
```sql
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

**Policy 2: Users can update only their own profile**
```sql
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**Policy 3: Users can insert their own profile**
```sql
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

---

### 3. Configure Domain Restrictions

1. Go to: https://app.supabase.com/project/_/settings/api

2. Scroll to **"API Settings"** → **"URL Configuration"**

3. Add your production domain to the allowlist:
   ```
   https://yourdomain.com
   http://localhost:5000  (for local development)
   ```

4. This prevents other websites from using your API keys

---

## 🛡️ What We Fixed

### ✅ Removed Password Storage
- **Before**: Passwords saved in `localStorage` (plaintext, easily stolen)
- **After**: Supabase manages authentication via secure tokens

### ✅ Protected API Keys
- **Before**: Keys hardcoded in `js/supabase.js` (visible to everyone)
- **After**: Keys in `config.js` (gitignored, not in repository)

### ✅ Added .gitignore
- **Before**: No protection for sensitive files
- **After**: `config.js` and `.env` excluded from git

---

## 📁 File Structure

```
ARISE/
├── config.js              ← YOUR CREDENTIALS (NOT in git) ⚠️
├── config.example.js      ← Template (safe to commit) ✅
├── .gitignore             ← Protects config.js ✅
├── .env.example           ← Template for environment vars ✅
└── js/
    └── supabase.js        ← Now loads from config.js ✅
```

---

## ⚙️ For New Team Members

If someone clones this repository:

1. Copy the template:
   ```bash
   cp config.example.js config.js
   ```

2. Ask the project owner for credentials

3. Paste them into `config.js`

4. Never commit `config.js` to git!

---

## 🔍 Verify Security

Run these checks:

### ✅ Check 1: config.js is gitignored
```bash
git status
# Should NOT show config.js in "Untracked files"
```

### ✅ Check 2: Old passwords removed from localStorage
Open DevTools → Application → Local Storage → Look for `arise_user_password`
**Expected**: Should NOT exist

### ✅ Check 3: Supabase RLS enabled
Try querying another user's profile:
```javascript
// In browser console
const client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
await client.from('profiles').select('*');
// Should ONLY return YOUR profile, not all users
```

---

## 🆘 Still Have Questions?

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

---

## 📌 Summary Checklist

- [ ] Generated NEW Supabase keys
- [ ] Updated `config.js` with new keys
- [ ] Enabled Row Level Security on `profiles` table
- [ ] Added RLS policies (SELECT, UPDATE, INSERT)
- [ ] Configured domain restrictions
- [ ] Verified config.js is gitignored
- [ ] Cleared old passwords from localStorage (open app once)

**Status**: 🔴 Keys compromised → 🟢 Security hardened
