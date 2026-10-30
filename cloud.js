
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


// ========================================
// LOAD VEHICLES FROM CLOUD
// ========================================

async function loadVehiclesFromCloud(userId) {

    const { data, error } = await vehicleCloud
        .from("user_vehicle_data")
        .select("vehicles")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Cloud loading error:", error);
        throw error;
    }

    if (!data) {
        return null;
    }

    return data.vehicles;
}


// ========================================
// SAVE VEHICLES TO CLOUD
// ========================================

async function saveVehiclesToCloud(userId, vehiclesData) {

    const { error } = await vehicleCloud
        .from("user_vehicle_data")
        .upsert({
            user_id: userId,
            vehicles: vehiclesData,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "user_id"
        });

    if (error) {
        console.error("Cloud saving error:", error);
        throw error;
    }

    console.log("Vehicle Manager: Cloud data saved successfully");

    return true;
}
