
// =====================================
// VEHICLE MANAGER - USER AUTHENTICATION
// =====================================

const authSection = document.getElementById("authSection");
const appContainer = document.getElementById("appContainer");

const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");

const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");


// OPEN APP AFTER LOADING USER DATA
async function openVehicleApp(user) {

    authMessage.textContent = "Loading your vehicles...";

    try {
        await initializeVehicleApp(user.id);

        authSection.style.display = "none";
        appContainer.style.display = "block";

    } catch (error) {
        console.error("App initialization error:", error);

        authMessage.textContent =
            "Could not load your vehicles. Please try again.";
    }
}


// CREATE ACCOUNT
signUpBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent =
            "Please enter email and password.";
        return;
    }

    authMessage.textContent = "Creating account...";

    const { data, error } = await vehicleCloud.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    if (data.session) {
        await openVehicleApp(data.user);
    } else {
        authMessage.textContent =
            "Account created! Please check your email to confirm your account, then sign in.";
    }
});


// SIGN IN
signInBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent =
            "Please enter email and password.";
        return;
    }

    authMessage.textContent = "Signing in...";

    const { data, error } =
        await vehicleCloud.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    await openVehicleApp(data.user);
});


// CHECK EXISTING LOGIN SESSION
vehicleCloud.auth.getSession().then(async ({ data, error }) => {

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    if (data.session) {
        await openVehicleApp(data.session.user);
    }

});
