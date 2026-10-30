
// =====================================
// VEHICLE MANAGER - USER AUTHENTICATION
// =====================================

const authSection = document.getElementById("authSection");
const appContainer = document.getElementById("appContainer");

const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");

const emailStatus = document.getElementById("emailStatus");
const emailMessage = document.getElementById("emailMessage");
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

if (!emailPattern.test(email)) {
    authMessage.textContent = "Please enter a valid email address.";
    return;
}

    authMessage.textContent = "Creating account...";

    const { data, error } = await vehicleCloud.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
    console.error("Account creation error:", error);

    if (error.message.toLowerCase().includes("password")) {
        authMessage.innerHTML = `
    <div class="password-guidance">
        <strong>Password requirements</strong>

        <p>Your password should contain at least:</p>

        <ul>
            <li>One capital letter (A–Z)</li>
            <li>One small letter (a–z)</li>
            <li>One number (0–9)</li>
            <li>One special symbol (@, #, $, etc.)</li>
        </ul>
    </div>
`;
    } else {
        authMessage.textContent = error.message;
    }

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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

if (!emailPattern.test(email)) {
    authMessage.textContent = "Please enter a valid email address.";
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


// SIGN OUT
document.getElementById("signOutBtn").addEventListener("click", async () => {

    const confirmed = confirm(
        "Are you sure you want to sign out? Your saved vehicle data will remain safe."
    );

    if (!confirmed) return;

    await cloudSaveQueue;

    const { error } = await vehicleCloud.auth.signOut();

    if (error) {
        alert("Could not sign out. Please try again.");
        console.error("Sign out error:", error);
        return;
    }

    currentUserId = null;
    vehicles = [];
    activeVehicleId = null;

    appContainer.style.display = "none";
    authSection.style.display = "block";

    passwordInput.value = "";
    authMessage.textContent = "You have been signed out.";

    document.getElementById("welcomePage").style.display = "block";
});



// =====================================
// LIVE PASSWORD STRENGTH CHECKER
// =====================================

const passwordStrength = document.getElementById("passwordStrength");
const strengthLabel = document.getElementById("strengthLabel");
const strengthBarFill = document.getElementById("strengthBarFill");

passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;

    if (password.length === 0) {
        passwordStrength.hidden = true;
        return;
    }

    passwordStrength.hidden = false;

    const checks = {
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    document.getElementById("ruleUpper").classList.toggle("valid", checks.upper);
    document.getElementById("ruleLower").classList.toggle("valid", checks.lower);
    document.getElementById("ruleNumber").classList.toggle("valid", checks.number);
    document.getElementById("ruleSymbol").classList.toggle("valid", checks.symbol);

    const score = Object.values(checks).filter(Boolean).length;
const hasMinimumLength = password.length >= 8;

    if (score <= 1) {
        strengthLabel.textContent = "Password strength: Weak";
        strengthLabel.style.color = "#dc2626";
        strengthBarFill.style.width = "25%";
        strengthBarFill.style.background = "#dc2626";

    } else if (score <= 3 || (score === 4 && !hasMinimumLength)) {
        strengthLabel.textContent = "Password strength: Medium";
        strengthLabel.style.color = "#d97706";
        strengthBarFill.style.width = "60%";
        strengthBarFill.style.background = "#d97706";

} else if (score === 4 && hasMinimumLength) {
        strengthLabel.textContent = "Password strength: Strong";
        strengthLabel.style.color = "#16a34a";
        strengthBarFill.style.width = "100%";
        strengthBarFill.style.background = "#16a34a";
    }

});



// EMAIL ADDRESS VALIDATION

emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();

    if (email === "") {
        emailStatus.textContent = "";
        emailStatus.className = "email-status";
        emailMessage.textContent = "";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const isValid = emailPattern.test(email);

    if (isValid) {
        emailStatus.textContent = "✓";
        emailStatus.className = "email-status valid";
        emailMessage.textContent = "Email format looks correct.";
        emailMessage.style.color = "#16a34a";
    } else {
        emailStatus.textContent = "✕";
        emailStatus.className = "email-status invalid";
        emailMessage.textContent = "Please enter a valid email address.";
        emailMessage.style.color = "#dc2626";
    }
});


