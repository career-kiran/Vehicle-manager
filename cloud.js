// ========================================
// VEHICLE MANAGER - SUPABASE CONNECTION
// ========================================

const SUPABASE_URL = "https://cttumjunrpbeeyutqehq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_GYhH6aS9fejXeWnT9pIdlw_Qs7jKzga";

const vehicleCloud = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Vehicle Manager: Supabase connection initialized");
