"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const supabase_1 = require("../config/supabase");
const helpers_1 = require("../utils/helpers");
class SettingsService {
    // ── Preferences ──
    static async getPreferences(userId) {
        const { data, error } = await supabase_1.supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code === 'PGRST116') {
            // No row exists, create defaults
            const { data: newRow, error: insertErr } = await supabase_1.supabase
                .from('user_preferences')
                .insert({ user_id: userId })
                .select('*')
                .single();
            if (insertErr)
                throw new helpers_1.AppError('Failed to create preferences', 500);
            return newRow;
        }
        if (error)
            throw new helpers_1.AppError('Failed to fetch preferences', 500);
        return data;
    }
    static async updatePreferences(userId, updates) {
        const allowed = ['genres', 'language', 'autoplay', 'quality', 'mature_content'];
        const filtered = {};
        for (const key of allowed) {
            if (updates[key] !== undefined)
                filtered[key] = updates[key];
        }
        filtered.updated_at = new Date().toISOString();
        const { data, error } = await supabase_1.supabase
            .from('user_preferences')
            .upsert({ user_id: userId, ...filtered }, { onConflict: 'user_id' })
            .select('*')
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update preferences', 500);
        return data;
    }
    // ── Privacy ──
    static async getPrivacy(userId) {
        const { data, error } = await supabase_1.supabase
            .from('user_privacy')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code === 'PGRST116') {
            const { data: newRow, error: insertErr } = await supabase_1.supabase
                .from('user_privacy')
                .insert({ user_id: userId })
                .select('*')
                .single();
            if (insertErr)
                throw new helpers_1.AppError('Failed to create privacy settings', 500);
            return newRow;
        }
        if (error)
            throw new helpers_1.AppError('Failed to fetch privacy settings', 500);
        return data;
    }
    static async updatePrivacy(userId, updates) {
        const allowed = ['visibility', 'show_status', 'allow_requests'];
        const filtered = {};
        for (const key of allowed) {
            if (updates[key] !== undefined)
                filtered[key] = updates[key];
        }
        filtered.updated_at = new Date().toISOString();
        const { data, error } = await supabase_1.supabase
            .from('user_privacy')
            .upsert({ user_id: userId, ...filtered }, { onConflict: 'user_id' })
            .select('*')
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update privacy settings', 500);
        return data;
    }
    // ── Notifications ──
    static async getNotifications(userId) {
        const { data, error } = await supabase_1.supabase
            .from('user_notifications')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code === 'PGRST116') {
            const { data: newRow, error: insertErr } = await supabase_1.supabase
                .from('user_notifications')
                .insert({ user_id: userId })
                .select('*')
                .single();
            if (insertErr)
                throw new helpers_1.AppError('Failed to create notification settings', 500);
            return newRow;
        }
        if (error)
            throw new helpers_1.AppError('Failed to fetch notification settings', 500);
        return data;
    }
    static async updateNotifications(userId, updates) {
        const allowed = ['email_notifications', 'push_notifications', 'episode_alerts', 'comment_replies', 'friend_requests'];
        const filtered = {};
        for (const key of allowed) {
            if (updates[key] !== undefined)
                filtered[key] = updates[key];
        }
        filtered.updated_at = new Date().toISOString();
        const { data, error } = await supabase_1.supabase
            .from('user_notifications')
            .upsert({ user_id: userId, ...filtered }, { onConflict: 'user_id' })
            .select('*')
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update notification settings', 500);
        return data;
    }
    // ── Blocked Users ──
    static async getBlockedUsers(userId) {
        const { data, error } = await supabase_1.supabase
            .from('blocked_users')
            .select('id, blocked_user_id, created_at, users!blocked_users_blocked_user_id_fkey(id, name, avatar_url)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw new helpers_1.AppError('Failed to fetch blocked users', 500);
        return data || [];
    }
    static async unblockUser(userId, blockId) {
        const { error } = await supabase_1.supabase
            .from('blocked_users')
            .delete()
            .eq('id', blockId)
            .eq('user_id', userId);
        if (error)
            throw new helpers_1.AppError('Failed to unblock user', 500);
        return { message: 'User unblocked successfully' };
    }
    // ── Watch History ──
    static async clearWatchHistory(userId) {
        const { error } = await supabase_1.supabase
            .from('watch_history')
            .delete()
            .eq('user_id', userId);
        if (error)
            throw new helpers_1.AppError('Failed to clear watch history', 500);
        return { message: 'Watch history cleared' };
    }
    static async exportWatchHistory(userId) {
        const { data, error } = await supabase_1.supabase
            .from('watch_history')
            .select('*, anime(id, title, thumbnail_url)')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
        if (error)
            throw new helpers_1.AppError('Failed to export watch history', 500);
        return data || [];
    }
    // ── Account ──
    static async updateProfile(userId, updates) {
        const allowed = ['name', 'bio', 'gender', 'country', 'dob'];
        const filtered = {};
        for (const key of allowed) {
            if (updates[key] !== undefined)
                filtered[key] = updates[key];
        }
        if (Object.keys(filtered).length === 0) {
            throw new helpers_1.AppError('No valid fields to update', 400);
        }
        const { data, error } = await supabase_1.supabase
            .from('users')
            .update(filtered)
            .eq('id', userId)
            .select('id, name, email, role, avatar_url, bio, gender, country, dob, created_at')
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update profile', 500);
        return data;
    }
    static async deleteAccount(userId) {
        // Soft delete — mark as deleted, recoverable for 30 days
        const { error } = await supabase_1.supabase
            .from('users')
            .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
        })
            .eq('id', userId);
        if (error)
            throw new helpers_1.AppError('Failed to delete account', 500);
        return { message: 'Account scheduled for deletion. You have 30 days to recover.' };
    }
    static async exportAccountData(userId) {
        const [userRes, prefsRes, privacyRes, notifsRes, historyRes, savedRes] = await Promise.all([
            supabase_1.supabase.from('users').select('id, name, email, role, avatar_url, bio, gender, country, dob, created_at').eq('id', userId).single(),
            supabase_1.supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
            supabase_1.supabase.from('user_privacy').select('*').eq('user_id', userId).single(),
            supabase_1.supabase.from('user_notifications').select('*').eq('user_id', userId).single(),
            supabase_1.supabase.from('watch_history').select('*, anime(id, title)').eq('user_id', userId),
            supabase_1.supabase.from('saved_anime').select('*, anime(id, title)').eq('user_id', userId),
        ]);
        return {
            user: userRes.data,
            preferences: prefsRes.data,
            privacy: privacyRes.data,
            notifications: notifsRes.data,
            watch_history: historyRes.data || [],
            saved_anime: savedRes.data || [],
            exported_at: new Date().toISOString(),
        };
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map