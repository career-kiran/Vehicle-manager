

function showImportantReminders() {
    const reminderBox = document.getElementById("importantReminders");

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const insurance = vehicle.insurance;

    if (!insurance || !insurance.expiryDate) {
        reminderBox.innerHTML = `
            <h2>🔔 Important Reminders</h2>
            <p>No upcoming reminders.</p>
        `;
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(insurance.expiryDate + "T00:00:00");
    const daysLeft = Math.ceil(
    (Date.UTC(
        Number(insurance.expiryDate.slice(0, 4)),
        Number(insurance.expiryDate.slice(5, 7)) - 1,
        Number(insurance.expiryDate.slice(8, 10))
    ) - Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    )) / (1000 * 60 * 60 * 24)
);