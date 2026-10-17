



const vehicleListPage = document.getElementById("vehicleListPage");
const addVehiclePage = document.getElementById("addVehiclePage");
const vehicleDashboard = document.getElementById("vehicleDashboard");
const basicDetailsPage = document.getElementById("basicDetailsPage");
const insurancePage = document.getElementById("insurancePage");
const pollutionDetailsPage = document.getElementById("pollutionDetailsPage");

const totalVehicleExpensePage =
    document.getElementById("totalVehicleExpensePage");

const backFromTotalExpense = document.getElementById("backFromTotalExpense");

const fuelHistoryPage = document.getElementById("fuelHistoryPage");

const servicePage = document.getElementById("servicePage");
const oilChangePage = document.getElementById("oilChangePage");
const tyreHistoryPage = document.getElementById("tyreHistoryPage");
const alignmentPage = document.getElementById("alignmentPage");
const alignmentDetailsPage = document.getElementById("alignmentDetailsPage");

const vehicleList = document.getElementById("vehicleList");
const vehicleSummary = document.getElementById("vehicleSummary");
const vehicleCare = document.getElementById("vehicleCare");

let vehicles = [];
let activeVehicleId = null;
let editingTyreIndex = null;
let editingFuelIndex = null;
let editingInsuranceIndex = null;
let editingOilChangeIndex = null;
let editingServiceIndex = null;
let editingPollutionIndex = null;

function showOnlyPage(pageToShow) {
    [
        vehicleListPage,
        addVehiclePage,
        vehicleDashboard,
        basicDetailsPage,
        insurancePage,
        document.getElementById("insuranceDetailsPage"),
        document.getElementById("pollutionDetailsPage"),
document.getElementById("pollutionPage"),
fuelHistoryPage,
servicePage,

document.getElementById("serviceDetailsPage"),
oilChangePage,
document.getElementById("oilChangeDetailsPage"),
alignmentPage,
document.getElementById("alignmentDetailsPage"),
tyreHistoryPage,
document.getElementById("tyreFormPage"),

document.getElementById("fuelMonthlyUsagePage"),
document.getElementById("savedFuelHistoryPage"),
document.getElementById("importantDatesPage"),
document.getElementById("totalVehicleExpensePage"),

    ].forEach(page => page.classList.add("hidden"));

    pageToShow.classList.remove("hidden");
}

// LOAD SAVED VEHICLES
function initApp() {
    const savedVehicles = localStorage.getItem("vehicles");

    if (savedVehicles) {
        try {
            vehicles = JSON.parse(savedVehicles);
        } catch {
            vehicles = [];
        }
    } else {
        // Recover a vehicle saved in the earlier version
        const oldVehicle = localStorage.getItem("vehicle");

        if (oldVehicle) {
            try {
                const vehicle = JSON.parse(oldVehicle);

                vehicles = [{
                    ...vehicle,
                    id: String(Date.now())
                }];

                saveVehicles();
            } catch {
                vehicles = [];
            }
        }
    }

    // Give older saved vehicles an ID if needed
    vehicles = vehicles.map(vehicle => ({
        ...vehicle,
        id: vehicle.id || String(Date.now() + Math.random())
    }));

    saveVehicles();
    renderVehicleList();
}

// SAVE VEHICLES
function saveVehicles() {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
}

// SHOW THE VEHICLE LIST
function renderVehicleList() {
    activeVehicleId = null;

    vehicleListPage.classList.remove("hidden");
    addVehiclePage.classList.add("hidden");
    vehicleDashboard.classList.add("hidden");

    vehicleList.innerHTML = "";

    vehicles.forEach(vehicle => {
        const card = document.createElement("div");
        card.className = "vehicle-card vehicle-list-card";

        card.innerHTML = `
 <div class="vehicle-card-header">
    <div>
        <div class="care-title">
            ${escapeHTML(vehicle.name)}
        </div>
    </div>

    <button type="button"
            class="delete-vehicle-btn"
            data-id="${vehicle.id}">
        Delete
    </button>
</div>

<div class="care-details home-detail-row">
    <span>Registration</span>
    <span>:</span>
    <span>${escapeHTML(vehicle.registration)}</span>
</div>


<div class="care-details home-detail-row">
    <span>Fuel Type</span>
    <span>:</span>
    <span>${escapeHTML(vehicle.fuelType || "Not specified")}</span>
</div>


<div class="care-details home-detail-row">
    <span>Current KM</span>
    <span>:</span>
    <span>${escapeHTML(vehicle.km)} km</span>
</div>


<div class="vehicle-card-footer">
    <span class="vehicle-open">View details →</span>
</div>
`;

        card.addEventListener("click", (event) => {
    if (event.target.closest(".delete-vehicle-btn")) {
        return;
    }

    showDashboard(vehicle.id);
});

card.querySelector(".delete-vehicle-btn")
    .addEventListener("click", (event) => {
        event.stopPropagation();

        const confirmed = confirm(
            `Delete "${vehicle.name}" permanently? This will remove its saved records too.`
        );

        if (!confirmed) return;

        vehicles = vehicles.filter(
            item => item.id !== vehicle.id
        );

        saveVehicles();
        renderVehicleList();
    });





        vehicleList.appendChild(card);
    });
}

// SHOW THE ADD VEHICLE FORM
function showVehicleForm() {

activeVehicleId = null;
    vehicleListPage.classList.add("hidden");
    addVehiclePage.classList.remove("hidden");
    vehicleDashboard.classList.add("hidden");

    document.getElementById("vehicleForm").reset();
}


function editVehicle(vehicleId) {
    const vehicle = vehicles.find(item => item.id === vehicleId);

    if (!vehicle) return;
activeVehicleId = vehicleId;

    showOnlyPage(addVehiclePage);

    document.getElementById("vehicleName").value = vehicle.name;
    document.getElementById("registration").value = vehicle.registration;
    document.getElementById("currentKm").value = vehicle.km;
    document.getElementById("fuelType").value = vehicle.fuelType || "";
}

// SAVE A NEW VEHICLE
function saveVehicle(event) {
    event.preventDefault();

    const name = document.getElementById("vehicleName").value.trim();
    const registration = document.getElementById("registration").value.trim();
    const km = document.getElementById("currentKm").value;
const fuelType = document.getElementById("fuelType").value;

    if (activeVehicleId) {
        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (!vehicle) return;

        vehicle.name = name;
        vehicle.registration = registration;
        vehicle.km = km;
        vehicle.fuelType = fuelType;

        
    } else {
        const vehicle = {
            id: String(Date.now()),
            name: name,
            registration: registration,
            km: km,
            fuelType: fuelType
        };

        vehicles.push(vehicle);
    }

    saveVehicles();

if (activeVehicleId) {
    showDashboard(activeVehicleId);
} else {
    renderVehicleList();
}

}





function updateTotalVehicleExpense() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    const amountDisplay = document.getElementById(
        "totalVehicleExpenseAmount"
    );

    if (!amountDisplay) return;

    if (!vehicle) {
        amountDisplay.textContent = "₹0";
        return;
    }

    let total = 0;

    function addExpenses(history, fallbackRecord, amountField) {
        const records =
            Array.isArray(history) && history.length > 0
                ? history
                : fallbackRecord
                    ? [fallbackRecord]
                    : [];

        records.forEach(record => {
            if (!record) return;

            const amount = Number(record[amountField]);

            if (Number.isFinite(amount) && amount > 0) {
                total += amount;
            }
        });
    }

    addExpenses(vehicle.fuelHistory, null, "amount");

    addExpenses(
        vehicle.insuranceHistory,
        vehicle.insurance,
        "premium"
    );

    addExpenses(
        vehicle.pollutionHistory,
        vehicle.pollutionCertificate,
        "amount"
    );

    addExpenses(
        vehicle.serviceHistory,
        vehicle.service,
        "serviceAmount"
    );

    addExpenses(
        vehicle.oilChangeHistory,
        vehicle.oilChange,
        "amount"
    );

    addExpenses(vehicle.tyreHistory, null, "amount");

    addExpenses(
        vehicle.alignmentHistory,
        vehicle.alignment,
        "amount"
    );

    amountDisplay.textContent = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(total);
}







function updateTotalVehicleExpensePage() {
    updateTotalVehicleExpense();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    const dashboardTotal = document.getElementById(
        "totalVehicleExpenseAmount"
    );

    const pageTotal = document.getElementById(
        "expensePageGrandTotal"
    );

    const breakdown = document.getElementById(
        "expenseCategoryBreakdown"
    );



    const expensePeriod = document.getElementById("expensePeriod");
    const expenseFromDate = document.getElementById("expenseFromDate");
    const expenseToDate = document.getElementById("expenseToDate");

    const selectedPeriod = expensePeriod ? expensePeriod.value : "all";

    let filterFromDate = null;
    let filterToDate = null;

    if (selectedPeriod === "custom") {
        filterFromDate = expenseFromDate?.value || null;
        filterToDate = expenseToDate?.value || null;
    
    } else if (selectedPeriod !== "all") {
        const months = Number(selectedPeriod);
const today = new Date();

filterToDate =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

const fromDate = new Date(
    today.getFullYear(),
    today.getMonth() - months,
    today.getDate()
);

// Correct dates that overflow at the end of a month
if (fromDate.getDate() !== today.getDate()) {
    fromDate.setDate(0);
}

filterFromDate =
    fromDate.getFullYear() + "-" +
    String(fromDate.getMonth() + 1).padStart(2, "0") + "-" +
    String(fromDate.getDate()).padStart(2, "0");
    }



    if (!vehicle || !dashboardTotal || !pageTotal || !breakdown) {
        return;
    }


if (
    selectedPeriod === "custom" &&
    filterFromDate &&
    filterToDate &&
    filterFromDate > filterToDate
) {
    breakdown.innerHTML =
    '<p class="expense-validation-message">Please select a valid date range.</p>';

    pageTotal.textContent = "";

    return;
}

    const categories = [
        {
            name: "Fuel",
            history: vehicle.fuelHistory,
            fallback: null,
            field: "amount",
            dateField: "date"
        },
        {
            name: "Insurance",
            history: vehicle.insuranceHistory,
            fallback: vehicle.insurance,
            field: "premium",
            dateField: "startDate"
        },
        {
            name: "Pollution Certificate",
            history: vehicle.pollutionHistory,
            fallback: vehicle.pollutionCertificate,
            field: "amount",
            dateField: "startDate"
        },
        {
            name: "Service",
            history: vehicle.serviceHistory,
            fallback: vehicle.service,
            field: "serviceAmount",
            dateField: "lastServiceDate"
        },
        {
            name: "Oil Change",
            history: vehicle.oilChangeHistory,
            fallback: vehicle.oilChange,
            field: "amount",
            dateField: "lastOilChangeDate"
        },
        {
            name: "Tyre Replacement",
            history: vehicle.tyreHistory,
            fallback: null,
            field: "amount",
            dateField: "date"
        },
        {
            name: "Wheel Alignment",
            history: vehicle.alignmentHistory,
            fallback: vehicle.alignment,
            field: "amount",
            dateField: "lastAlignmentDate"
        }
    ];

    const formatExpense = amount =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount);

    

    breakdown.innerHTML = "<h3>Expense Breakdown</h3>";

    categories.forEach(category => {
        const records =
            Array.isArray(category.history) &&
            category.history.length > 0
                ? category.history
                : category.fallback
                    ? [category.fallback]
                    : [];

        const filteredRecords = records.filter(record => {
    if (!record) return false;

    const recordDate = record[category.dateField];



    if (selectedPeriod === "all") return true;
    if (!recordDate) return false;

    if (filterFromDate && recordDate < filterFromDate) {
        return false;
    }

    if (filterToDate && recordDate > filterToDate) {
        return false;
    }

    return true;
});

const total = filteredRecords.reduce((sum, record) => {
    const amount = Number(record[category.field]);

    return Number.isFinite(amount) && amount > 0
        ? sum + amount
        : sum;
}, 0);

        const row = document.createElement("div");
        row.className = "vehicle-card";
        row.innerHTML = `
            <strong>${category.name}</strong>
            <span>${formatExpense(total)}</span>
        `;

        breakdown.appendChild(row);
    });

        
    const filteredGrandTotal = categories.reduce((sum, category) => {
        const records =
            Array.isArray(category.history) &&
            category.history.length > 0
                ? category.history
                : category.fallback
                    ? [category.fallback]
                    : [];

        const filteredRecords = records.filter(record => {
            if (!record) return false;

            const recordDate = record[category.dateField];

console.log(
    category.name,
    recordDate,
    filterFromDate,
    filterToDate
);


            if (selectedPeriod === "all") return true;
            if (!recordDate) return false;

            if (filterFromDate && recordDate < filterFromDate) {
                return false;
            }

            if (filterToDate && recordDate > filterToDate) {
                return false;
            }

            return true;
        });

        return sum + filteredRecords.reduce((categorySum, record) => {
            const amount = Number(record[category.field]);

            return Number.isFinite(amount) && amount > 0
                ? categorySum + amount
                : categorySum;
        }, 0);
    }, 0);

    pageTotal.textContent = formatExpense(filteredGrandTotal);
}





const expensePeriodFilter = document.getElementById("expensePeriod");
const expenseFromDateFilter = document.getElementById("expenseFromDate");
const expenseToDateFilter = document.getElementById("expenseToDate");

if (expensePeriodFilter) {
    expensePeriodFilter.addEventListener("change", () => {
        const customDates = document.getElementById("customExpenseDates");

        if (customDates) {
            customDates.style.display =
                expensePeriodFilter.value === "custom" ? "block" : "none";
        }

        updateTotalVehicleExpensePage();
    });
}

if (expenseFromDateFilter) {
    expenseFromDateFilter.addEventListener("change", updateTotalVehicleExpensePage);
}

if (expenseToDateFilter) {
    expenseToDateFilter.addEventListener("change", updateTotalVehicleExpensePage);
}








// SHOW A VEHICLE DASHBOARD
function showDashboard(vehicleId) {
    const vehicle = vehicles.find(item => item.id === vehicleId);

    if (!vehicle) {
        renderVehicleList();
        return;
    }

    activeVehicleId = vehicleId;

    showOnlyPage(vehicleDashboard);

    vehicleSummary.innerHTML = `
        <h2> ${escapeHTML(vehicle.name)}</h2>

        <div class="care-details">
                     <div class="detail-row">
                <span class="detail-label">Registration</span>
                <span class="detail-colon">:</span>
                <span class="detail-value">${escapeHTML(vehicle.registration)}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Fuel Type</span>
                <span class="detail-colon">:</span>
                <span class="detail-value">${escapeHTML(vehicle.fuelType || "Not specified")}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Current KM</span>
                <span class="detail-colon">:</span>
                <span class="detail-value"><span id="currentKmDisplay">${escapeHTML(vehicle.km)}</span> km</span>
            </div>
<button type="button" class="secondary-button" id="updateKmBtn">
    Update KM
</button>

        </div>

<div class="vehicle-summary-header">
    <button type="button" id="editVehicleBtn"
        class="edit-icon-btn" aria-label="Edit vehicle"
        title="Edit vehicle">
        Edit
    </button>
</div>
    `;

    showVehicleCare();
showImportantReminders();
updateTotalVehicleExpense();

document.getElementById("editVehicleBtn")
    .addEventListener("click", () => {
        editVehicle(vehicleId);
    });

document.getElementById("updateKmBtn")
    .addEventListener("click", () => {
        const newKm = prompt("Enter current kilometres:");

        if (newKm === null || newKm.trim() === "") return;

        const km = Number(newKm);

        if (!Number.isFinite(km) || km < 0) {
            alert("Please enter valid kilometres.");
            return;
        }

        const vehicle = vehicles.find(item => item.id === vehicleId);

        if (!vehicle) return;

        vehicle.km = km;
        saveVehicles();
        showDashboard(vehicleId);
    });


if (backFromTotalExpense) {
    backFromTotalExpense.onclick = () => {
        showDashboard(activeVehicleId);
    };
}



}

document.getElementById("totalVehicleExpenseBtn")
    .addEventListener("click", () => {
        showOnlyPage(totalVehicleExpensePage);
        updateTotalVehicleExpensePage();
    });











function showImportantDatesPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const content = document.getElementById(
        "importantDatesContent"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const items = [];

    function addDateItem(title, date) {
        if (!date) return;

        const parts = date.split("-").map(Number);

        if (parts.length !== 3) return;

        const dueDate = new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );

        if (
            dueDate.getFullYear() !== parts[0] ||
            dueDate.getMonth() !== parts[1] - 1 ||
            dueDate.getDate() !== parts[2]
        ) return;

        const daysLeft = Math.round(
            (dueDate - today) / 86400000
        );

        let status;

        if (daysLeft < 0) {
            status = `Expired ${Math.abs(daysLeft)} day(s) ago`;
        } else if (daysLeft === 0) {
            status = "Due today";
        } else {
            status = `${daysLeft} day(s) left`;
        }

        items.push({
            title,
            date: formatDate(date),
            status
        });
    }

    function addKmItem(title, targetKm) {
        if (
            targetKm === "" ||
            targetKm === null ||
            targetKm === undefined ||
            !Number.isFinite(Number(targetKm)) ||
            vehicle.km === "" ||
            vehicle.km === null ||
            vehicle.km === undefined ||
            !Number.isFinite(Number(vehicle.km))
        ) return;

        const kmLeft = Number(targetKm) - Number(vehicle.km);

        items.push({
            title,
            date: `${targetKm} km`,
            status: kmLeft <= 0
                ? "KM limit reached!"
                : `${kmLeft} km remaining`
        });
    }

    function latestRecord(history, fallback) {
        return Array.isArray(history) && history.length
            ? history[history.length - 1]
            : fallback;
    }

    const insurance = latestRecord(
        vehicle.insuranceHistory,
        vehicle.insurance
    );

    if (insurance) {
        addDateItem(
            "Insurance expiry",
            insurance.expiryDate
        );
    }

    const pollution = latestRecord(
        vehicle.pollutionHistory,
        vehicle.pollutionCertificate
    );

    if (pollution) {
        addDateItem(
            "Pollution Certificate expiry",
            pollution.expiryDate
        );
    }

    const service = latestRecord(
        vehicle.serviceHistory,
        vehicle.service
    );

    if (service) {
        addDateItem(
            "Next Service",
            service.nextServiceDate
        );

        addKmItem(
            "Next Service KM",
            service.nextServiceKm
        );
    }

    const oilChange = latestRecord(
        vehicle.oilChangeHistory,
        vehicle.oilChange
    );

    if (oilChange) {
        addDateItem(
            "Next Oil Change",
            oilChange.nextOilChangeDate
        );

        addKmItem(
            "Next Oil Change KM",
            oilChange.nextOilChangeKm
        );
    }

    const alignment = latestRecord(
        vehicle.alignmentHistory,
        vehicle.alignment
    );

    if (alignment) {
        addDateItem(
            "Next Wheel Alignment",
            alignment.nextAlignmentDate
        );

        addKmItem(
            "Next Wheel Alignment KM",
            alignment.nextAlignmentKm
        );
    }

    const tyreHistory = vehicle.tyreHistory || [];

    if (tyreHistory.length > 0) {
        const tyre = tyreHistory[tyreHistory.length - 1];

        addKmItem(
            "Next Tyre Check KM",
            tyre.targetKm
        );
    }

    content.innerHTML = items.length
        ? items.map(item => `
            <div class="alignment-history-record">
             <h3 style="color: #2874C8;">
    ${escapeHTML(item.title)}
</h3>

                <div class="detail-row">
                    <span class="detail-label">Date / Target</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">
                        ${escapeHTML(item.date)}
                    </span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">
                      <span style="color: ${
    item.status.includes("Expired") ||
    item.status.includes("KM limit reached")
        ? "#D93025"
        : "#444444"
};">
    ${escapeHTML(item.status)}
</span>
                    </span>
                </div>
            </div>
        `).join("")
        : "<p>No important dates or KM targets saved yet.</p>";

    showOnlyPage(
        document.getElementById("importantDatesPage")
    );
}







// OPEN IMPORTANT DATES PAGE
document.querySelector(".important-dates-panel")
    .addEventListener("click", () => {
        showImportantDatesPage();
    });








function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;

    const [year, month, day] = parts;
    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
    ) {
        return dateString;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}






function showInsuranceDetailsPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Support both history and older saved insurance data
    let insuranceHistory = Array.isArray(vehicle.insuranceHistory)
        ? vehicle.insuranceHistory
        : [];

    if (insuranceHistory.length === 0 && vehicle.insurance) {
        insuranceHistory = [vehicle.insurance];
    }

    const content = document.getElementById(
        "insuranceDetailsContent"
    );

    content.innerHTML = insuranceHistory.length
    ? [...insuranceHistory].reverse().map((insurance, index) => {
            const rows = [
                ["Insurance type",
                    insurance.type === "comprehensive"
                        ? "Comprehensive (Full coverage)"
                        : insurance.type === "third-party"
                        ? "Third-party only" : ""],
                ["Company", insurance.company],
                ["Policy number", insurance.policyNumber],
                ["Start date", formatDate(insurance.startDate)],
                ["Expiry date", formatDate(insurance.expiryDate)],
                ["Premium",
                    insurance.premium ? "₹" + insurance.premium : ""]
            ];

            return `
                                            <div class="alignment-history-record">
                    <div class="insurance-details-header">
                        <h3>Insurance ${index + 1}</h3>

                        <button type="button"
                            class="edit-icon-btn edit-insurance-record"
                            data-index="${index}">
                            Edit
                        </button>

                        <button type="button"
                            class="edit-icon-btn delete-insurance-record"
                            data-index="${index}">
                            Delete
                        </button>
                    </div>

                    ${rows
                        .filter(([label, value]) => value)
                        .map(([label, value]) => `
                            <div class="detail-row">
                                <span class="detail-label">${escapeHTML(label)}</span>
                                <span class="detail-colon">:</span>
                                <span class="detail-value">${escapeHTML(value)}</span>
                            </div>
                        `).join("")}
                </div>
                <hr>
            `;
        }).join("")
        : "<p>No insurance records added yet.</p>";

    // Keep the latest policy available to reminder code
    vehicle.insurance = insuranceHistory.length > 0
        ? insuranceHistory[insuranceHistory.length - 1]
        : null;

    showOnlyPage(insuranceDetailsPage);
}



// SHOW BASIC DETAILS PAGE
function showBasicDetailsPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const content = document.getElementById("basicDetailsContent");
    const details = vehicle.basicDetails || {};

    const rows = [
        ["Ownership", details.ownership],
        ["Brand", details.brand],
        ["Model", details.model],
        ["Registration Number", vehicle.registration],
        ["Fuel Type", vehicle.fuelType],
        ["Year of Manufacture", details.manufactureYear],
      ["Purchase Date", details.purchaseDate
    ? new Date(details.purchaseDate + "T00:00:00")
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    : ""],
        [
            "Amount Paid",
            details.amountPaid !== undefined &&
            details.amountPaid !== null &&
            details.amountPaid !== ""
                ? "₹" + details.amountPaid
                : ""
        ]
    ];

    content.innerHTML = rows.some(([label, value]) => value)
        ? rows
            .filter(([label, value]) => value !== undefined && value !== null && value !== "")
            .map(([label, value]) => `
                <div class="detail-row">
                    <span class="detail-label">${escapeHTML(label)}</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">${escapeHTML(String(value))}</span>
                </div>
            `).join("")
        : "<p>No basic details added yet. Tap Edit / Add Details to enter them.</p>";

    showOnlyPage(basicDetailsPage);
}




function showBasicDetailsForm() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const details = vehicle.basicDetails || {};

    document.getElementById("basicDetailsFormContainer").innerHTML = `
        <form id="basicDetailsForm">

            <label for="basicOwnership">Ownership</label>
            <select id="basicOwnership">
                <option value="">Select ownership</option>
                <option value="New" ${details.ownership === "New" ? "selected" : ""}>New</option>
                <option value="Used" ${details.ownership === "Used" ? "selected" : ""}>Used</option>
            </select>

            <label for="basicBrand">Brand</label>
            <input type="text" id="basicBrand"
                value="${escapeHTML(details.brand || "")}">

            <label for="basicModel">Model</label>
            <input type="text" id="basicModel"
                value="${escapeHTML(details.model || "")}">

            <label for="basicRegistration">Registration Number</label>
            <input type="text" id="basicRegistration"
                value="${escapeHTML(vehicle.registration || "")}">

            <label for="basicFuelType">Fuel Type</label>
            <select id="basicFuelType">
                <option value="">Select fuel type</option>
                <option value="Petrol" ${vehicle.fuelType === "Petrol" ? "selected" : ""}>Petrol</option>
                <option value="Diesel" ${vehicle.fuelType === "Diesel" ? "selected" : ""}>Diesel</option>
                <option value="Electric" ${vehicle.fuelType === "Electric" ? "selected" : ""}>Electric</option>
                <option value="Hybrid" ${vehicle.fuelType === "Hybrid" ? "selected" : ""}>Hybrid</option>
                <option value="Gas" ${vehicle.fuelType === "Gas" ? "selected" : ""}>Gas</option>
            </select>

            <label for="basicManufactureYear">Year of Manufacture</label>
            <input type="number" id="basicManufactureYear"
                min="1886" max="2100"
                value="${escapeHTML(details.manufactureYear || "")}">

            <label for="basicPurchaseDate">Purchase Date</label>
            <input type="date" id="basicPurchaseDate"
                value="${escapeHTML(details.purchaseDate || "")}">

            <label for="basicAmountPaid">Amount Paid (₹)</label>
            <input type="number" id="basicAmountPaid"
                min="0" step="0.01"
                value="${escapeHTML(details.amountPaid ?? "")}">

            <div class="form-actions">
                <button type="submit">Save Details</button>
                <button type="button" id="cancelBasicDetails">Cancel</button>
            </div>

        </form>
    `;

    document.getElementById("basicDetailsForm")
        .addEventListener("submit", saveBasicDetails);

document.getElementById("cancelBasicDetails")
    .addEventListener("click", () => {
        document.getElementById("basicDetailsFormContainer").innerHTML = "";
        showBasicDetailsPage();
    });
}





function saveBasicDetails(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    vehicle.basicDetails = {
        ...(vehicle.basicDetails || {}),
        ownership: document.getElementById("basicOwnership").value,
        brand: document.getElementById("basicBrand").value.trim(),
        model: document.getElementById("basicModel").value.trim(),
        manufactureYear: document.getElementById("basicManufactureYear").value,
        purchaseDate: document.getElementById("basicPurchaseDate").value,
        amountPaid: document.getElementById("basicAmountPaid").value
    };

    vehicle.registration =
        document.getElementById("basicRegistration").value.trim();

    vehicle.fuelType =
        document.getElementById("basicFuelType").value;

    saveVehicles();

document.getElementById("basicDetailsFormContainer").innerHTML = "";

showBasicDetailsPage();
}













function showPollutionPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Create history from the existing certificate if needed.
    if (!Array.isArray(vehicle.pollutionHistory)) {
        vehicle.pollutionHistory = vehicle.pollutionCertificate
            ? [{ ...vehicle.pollutionCertificate }]
            : [];
    }

    let pollution = {};

    if (editingPollutionIndex !== null) {
        pollution = vehicle.pollutionHistory[editingPollutionIndex] || {};
    }

    document.getElementById("pollutionNumber").value =
        pollution.certificateNumber || "";

    document.getElementById("pollutionStartDate").value =
        pollution.startDate || "";

    document.getElementById("pollutionExpiryDate").value =
        pollution.expiryDate || "";
   document.getElementById("pollutionAmount").value =
    pollution.amount || "";

    document.querySelectorAll(
        'input[name="pollutionReminder"]'
    ).forEach(input => {
        input.checked = (pollution.reminderDays || [])
            .includes(Number(input.value));
    });

    showOnlyPage(
        document.getElementById("pollutionPage")
    );
}





function showServicePage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Get the service record being edited, or open a blank form.
    const service =
        editingServiceIndex !== null &&
        Array.isArray(vehicle.serviceHistory)
            ? vehicle.serviceHistory[editingServiceIndex] || {}
            : editingServiceIndex === null
                ? {}
                : vehicle.service || {};

    document.getElementById("lastServiceDate").value =
        service.lastServiceDate || "";

    document.getElementById("lastServiceKm").value =
        service.lastServiceKm || "";

    document.getElementById("nextServiceDate").value =
        service.nextServiceDate || "";

    document.getElementById("nextServiceKm").value =
        service.nextServiceKm || "";

    document.getElementById("serviceCentre").value =
        service.serviceCentre || "";

    document.getElementById("serviceNotes").value =
        service.serviceNotes || "";

    const savedServiceReminderDays =
        service.reminderDays || [30, 15, 7, 0];

    document.querySelectorAll(
        'input[name="serviceReminder"]'
    ).forEach(input => {
        input.checked = savedServiceReminderDays.includes(
            Number(input.value)
        );
    });

    showOnlyPage(servicePage);

    document.getElementById("backFromService").style.display =
        "none";
}







function showOilChangePage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Load the selected record when editing;
    // otherwise open a blank form for a new record.
    let oilChange = {};

    if (editingOilChangeIndex !== null) {
        if (!Array.isArray(vehicle.oilChangeHistory)) return;

        oilChange = vehicle.oilChangeHistory[editingOilChangeIndex];

        if (!oilChange) {
            editingOilChangeIndex = null;
            return;
        }
    } else {
        // Ensure Add Oil Change starts with a blank form
        document.getElementById("oilChangeForm").reset();
    }

    document.getElementById("lastOilChangeDate").value =
        oilChange.lastOilChangeDate || "";

    document.getElementById("lastOilChangeKm").value =
        oilChange.lastOilChangeKm || "";

    document.getElementById("nextOilChangeDate").value =
        oilChange.nextOilChangeDate || "";

    document.getElementById("nextOilChangeKm").value =
        oilChange.nextOilChangeKm || "";
document.getElementById("oilChangeAmount").value =
    oilChange.amount || "";

    const savedOilChangeReminderDays =
        oilChange.reminderDays || [30, 15, 7, 0];

    document.querySelectorAll(
        'input[name="oilChangeReminder"]'
    ).forEach(input => {
        input.checked = savedOilChangeReminderDays.includes(
            Number(input.value)
        );
    });

    showOnlyPage(oilChangePage);
}






function showAlignmentPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const alignment =
        vehicle.editingAlignmentIndex !== undefined
            ? vehicle.alignmentHistory[vehicle.editingAlignmentIndex]
            : {};

    document.getElementById("lastAlignmentDate").value =
        alignment?.lastAlignmentDate || "";

    document.getElementById("lastAlignmentKm").value =
        alignment?.lastAlignmentKm || "";

    document.getElementById("alignmentAmount").value =
        alignment?.amount || "";

    document.getElementById("nextAlignmentDate").value =
        alignment?.nextAlignmentDate || "";

    document.getElementById("nextAlignmentKm").value =
        alignment?.nextAlignmentKm || "";

    const savedAlignmentReminderDays =
        alignment?.reminderDays || [30, 15, 7, 0];

    document.querySelectorAll(
        'input[name="alignmentReminder"]'
    ).forEach(input => {
        input.checked = savedAlignmentReminderDays.includes(
            Number(input.value)
        );
    });

    showOnlyPage(alignmentPage);
}





function saveService(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const serviceRecord = {
        lastServiceDate:
            document.getElementById("lastServiceDate").value,

        lastServiceKm:
            document.getElementById("lastServiceKm").value,

        nextServiceDate:
            document.getElementById("nextServiceDate").value,

        nextServiceKm:
            document.getElementById("nextServiceKm").value,

        serviceCentre:
    document.getElementById("serviceCentre").value.trim(),

serviceAmount:
    document.getElementById("serviceAmount").value,

serviceNotes:
    document.getElementById("serviceNotes").value.trim(),

        reminderDays: Array.from(
            document.querySelectorAll(
                'input[name="serviceReminder"]:checked'
            )
        ).map(input => Number(input.value))
    };

    // Preserve the existing service record when starting history.
    if (!Array.isArray(vehicle.serviceHistory)) {
        vehicle.serviceHistory = vehicle.service
            ? [{ ...vehicle.service }]
            : [];
    }

    if (editingServiceIndex !== null) {
        vehicle.serviceHistory[editingServiceIndex] = serviceRecord;
    } else {
        vehicle.serviceHistory.push(serviceRecord);
    }

    // Keep the latest service available for existing reminders.
    vehicle.service = {
        ...vehicle.serviceHistory[vehicle.serviceHistory.length - 1]
    };

    saveVehicles();

    editingServiceIndex = null;

    showServiceDetailsPage();
}







function saveOilChange(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Create history and preserve the old saved record
    if (!Array.isArray(vehicle.oilChangeHistory)) {
        vehicle.oilChangeHistory = vehicle.oilChange
            ? [{ ...vehicle.oilChange }]
            : [];
    }

    const oilChangeRecord = {
        lastOilChangeDate:
            document.getElementById("lastOilChangeDate").value,

        lastOilChangeKm:
            document.getElementById("lastOilChangeKm").value,

        nextOilChangeDate:
            document.getElementById("nextOilChangeDate").value,

        nextOilChangeKm:
            document.getElementById("nextOilChangeKm").value,
        amount:
            document.getElementById("oilChangeAmount").value,
             
        reminderDays: Array.from(
            document.querySelectorAll(
                'input[name="oilChangeReminder"]:checked'
            )
        ).map(input => Number(input.value))
    };

    if (editingOilChangeIndex !== null) {
        if (!vehicle.oilChangeHistory[editingOilChangeIndex]) {
            alert("This oil change record could not be found.");
            editingOilChangeIndex = null;
            return;
        }

        vehicle.oilChangeHistory[editingOilChangeIndex] =
            oilChangeRecord;

        editingOilChangeIndex = null;
    } else {
        vehicle.oilChangeHistory.push(oilChangeRecord);
    }

    // Keep the latest record available to existing reminders
    vehicle.oilChange =
        vehicle.oilChangeHistory.length > 0
            ? vehicle.oilChangeHistory[
                vehicle.oilChangeHistory.length - 1
            ]
            : null;

    saveVehicles();
    showOilChangeDetailsPage();
}





function saveAlignment(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    if (!Array.isArray(vehicle.alignmentHistory)) {
        vehicle.alignmentHistory = [];

        // Preserve any existing alignment record
        if (vehicle.alignment) {
            vehicle.alignmentHistory.push(vehicle.alignment);
        }
    }

    const alignmentRecord = {
        lastAlignmentDate:
            document.getElementById("lastAlignmentDate").value,

        lastAlignmentKm:
            document.getElementById("lastAlignmentKm").value,

        amount:
            document.getElementById("alignmentAmount").value,

        nextAlignmentDate:
            document.getElementById("nextAlignmentDate").value,

        nextAlignmentKm:
            document.getElementById("nextAlignmentKm").value,

        reminderDays: Array.from(
            document.querySelectorAll(
                'input[name="alignmentReminder"]:checked'
            )
        ).map(input => Number(input.value))
    };

    if (vehicle.editingAlignmentIndex !== undefined) {
        vehicle.alignmentHistory[vehicle.editingAlignmentIndex] =
            alignmentRecord;

        delete vehicle.editingAlignmentIndex;
    } else {
        vehicle.alignmentHistory.push(alignmentRecord);
    }

    vehicle.alignment =
        vehicle.alignmentHistory[
            vehicle.alignmentHistory.length - 1
        ];

    saveVehicles();
    showAlignmentDetailsPage();
}




function saveTyreReplacement(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const positions = Array.from(
        document.querySelectorAll(
            'input[name="tyrePosition"]:checked'
        )
    ).map(input => input.value);

    const tyreCount = Number(
        document.getElementById("tyreCount").value
    );

    if (positions.length !== tyreCount) {
        alert("Please select exactly the same number of tyre positions as tyres replaced.");
        return;
    }

    if (positions.length === 0) {
        alert("Please select the tyre positions.");
        return;
    }

    if (!vehicle.tyreHistory) {
        vehicle.tyreHistory = [];
    }

    const replacement = {
    date: document.getElementById("tyreReplacementDate").value,
    km: document.getElementById("tyreReplacementKm").value,
    targetKm: document.getElementById("tyreTargetKm").value,
reminderKm: Array.from(
    document.querySelectorAll('input[name="tyreReminderKm"]:checked')
).map(input => Number(input.value)),
    brand: document.getElementById("tyreBrand").value.trim(),
    count: tyreCount,
    positions: positions,
    amount: document.getElementById("tyreAmount").value,
    stepneyBrand: document.getElementById("stepneyBrand").value.trim(),
    stepneyCondition: document.getElementById("stepneyCondition").value
};

if (editingTyreIndex !== null) {
    vehicle.tyreHistory[editingTyreIndex] = replacement;
    editingTyreIndex = null;
} else {
    vehicle.tyreHistory.push(replacement);
}

    saveVehicles();
    document.getElementById("tyreForm").reset();

    showTyreHistoryPage();
}








function showServiceDetailsPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const content = document.getElementById("serviceDetailsContent");

    // Support existing records and the new history.
    if (!Array.isArray(vehicle.serviceHistory)) {
        vehicle.serviceHistory = vehicle.service
            ? [{ ...vehicle.service }]
            : [];
    }

    const serviceHistory = vehicle.serviceHistory;

    if (serviceHistory.length === 0) {
        content.innerHTML = `
            <p>No service details added yet.</p>
        `;
    } else {
        content.innerHTML = serviceHistory
            .map((service, index) => {
                const rows = [
                    ["Last service date", formatDate(service.lastServiceDate)],
                    ["Last service kilometres", service.lastServiceKm ? service.lastServiceKm + " km" : ""],
                    ["Next service date", formatDate(service.nextServiceDate)],
                    ["Next service kilometres", service.nextServiceKm ? service.nextServiceKm + " km" : ""],
                    ["Service centre", service.serviceCentre],
                    ["Amount", service.serviceAmount !== undefined && service.serviceAmount !== "" ? "₹" + service.serviceAmount : ""],
                    ["Service notes", service.serviceNotes]
                ];

                return `
                    <div class="alignment-history-record">
                        <div class="insurance-details-header">
                            <h3>Service ${serviceHistory.length - index}</h3>
                            <div>
                                <button type="button"
                                    class="edit-icon-btn edit-service-record"
                                    data-index="${serviceHistory.length - 1 - index}">
                                    Edit
                                </button>
                                <button type="button"
                                    class="edit-icon-btn delete-service-record"
                                    data-index="${serviceHistory.length - 1 - index}">
                                    Delete
                                </button>
                            </div>
                        </div>

                        ${rows
                            .filter(([label, value]) => value)
                            .map(([label, value]) => `
                                <div class="detail-row">
                                    <span class="detail-label">${escapeHTML(label)}</span>
                                    <span class="detail-colon">:</span>
                                    <span class="detail-value">${escapeHTML(value)}</span>
                                </div>
                            `).join("")}
                    </div>
                `;
            })
            .reverse()
            .join("");
    }

    showOnlyPage(
        document.getElementById("serviceDetailsPage")
    );
}








function showOilChangeDetailsPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Keep compatibility with previously saved oil change data
    if (!Array.isArray(vehicle.oilChangeHistory)) {
        vehicle.oilChangeHistory = vehicle.oilChange
            ? [{ ...vehicle.oilChange }]
            : [];
    }

    // Keep the latest record available for existing reminders
    vehicle.oilChange = vehicle.oilChangeHistory.length
        ? vehicle.oilChangeHistory[vehicle.oilChangeHistory.length - 1]
        : null;

    const content = document.getElementById("oilChangeDetailsContent");

    if (!content) return;

    if (vehicle.oilChangeHistory.length === 0) {
        content.innerHTML = "<p>No oil change records added yet.</p>";
        showOnlyPage(oilChangeDetailsPage);
        return;
    }

    // Show newest record first
    const history = [...vehicle.oilChangeHistory].reverse();

    content.innerHTML = history.map((record, displayIndex) => {
                const dateRows = [
            ["Last oil change date", formatDate(record.lastOilChangeDate)],
            [
                "Last oil change kilometres",
                record.lastOilChangeKm !== undefined &&
                record.lastOilChangeKm !== null &&
                record.lastOilChangeKm !== ""
                    ? record.lastOilChangeKm + " km"
                    : ""
            ],
            ["Next oil change date", formatDate(record.nextOilChangeDate)],
            [
                "Next oil change kilometres",
                record.nextOilChangeKm !== undefined &&
                record.nextOilChangeKm !== null &&
                record.nextOilChangeKm !== ""
                    ? record.nextOilChangeKm + " km"
                    : ""
            ],
            [
                "Amount Paid",
                record.amount !== undefined &&
                record.amount !== null &&
                record.amount !== ""
                    ? "₹" + record.amount
                    : ""
            ]
        ];

        const filledRows = dateRows.filter(([label, value]) => value);

        return `
            <div class="alignment-history-record">
                <div class="insurance-details-header">
                   <h3> Oil Change Record ${displayIndex + 1}</h3>

                   <div>
    <button
        type="button"
        class="edit-icon-btn edit-oil-change-record"
        data-index="${displayIndex}"
        title="Edit"
    >Edit</button>

    <button
        type="button"
        class="edit-icon-btn delete-oil-change-record"
        data-index="${displayIndex}"
        title="Delete"
    >Delete</button>
</div>
                </div>

                ${filledRows.length
                    ? filledRows.map(([label, value]) => `
                        <div class="detail-row">
                            <span class="detail-label">${label}</span>
                            <span class="detail-colon">:</span>
                            <span class="detail-value">${value}</span>
                        </div>
                    `).join("")
                    : "<p>No details available for this record.</p>"
                }
            </div>
        `;
    }).join("");

    showOnlyPage(oilChangeDetailsPage);
}





document.getElementById("oilChangeDetailsContent").addEventListener("click", function (event) {
    const editButton = event.target.closest(".edit-oil-change-record");
    const deleteButton = event.target.closest(".delete-oil-change-record");

    if (!editButton && !deleteButton) return;

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle || !Array.isArray(vehicle.oilChangeHistory)) return;

    const displayIndex = Number(
        (editButton || deleteButton).dataset.index
    );

    // History is displayed newest first, so convert to the saved index
    const index = vehicle.oilChangeHistory.length - 1 - displayIndex;

    if (!vehicle.oilChangeHistory[index]) return;

    if (editButton) {
        editingOilChangeIndex = index;
        showOilChangePage();
        return;
    }

    if (deleteButton) {
        if (!confirm("Are you sure you want to delete this oil change record?")) {
            return;
        }

        vehicle.oilChangeHistory.splice(index, 1);

        // Keep the latest remaining record for existing reminders
        vehicle.oilChange = vehicle.oilChangeHistory.length
            ? vehicle.oilChangeHistory[vehicle.oilChangeHistory.length - 1]
            : null;

        saveVehicles();
        showOilChangeDetailsPage();
    }
});





function showAlignmentDetailsPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const content = document.getElementById(
        "alignmentDetailsContent"
    );

    // Support both the new history and older saved data
    let alignmentHistory = Array.isArray(vehicle.alignmentHistory)
        ? vehicle.alignmentHistory
        : [];

    if (alignmentHistory.length === 0 && vehicle.alignment) {
        alignmentHistory = [vehicle.alignment];
    }

    content.innerHTML = alignmentHistory.length
       ? alignmentHistory.slice().reverse().map((alignment, index) => {
            const rows = [
                ["Last alignment date", formatDate(alignment.lastAlignmentDate)],
                ["Last alignment kilometres",
                    alignment.lastAlignmentKm
                        ? alignment.lastAlignmentKm + " km" : ""],
                ["Amount paid",
                    alignment.amount ? "₹" + alignment.amount : ""],
                ["Next alignment date", formatDate(alignment.nextAlignmentDate)],
                ["Next alignment kilometres",
                    alignment.nextAlignmentKm
                        ? alignment.nextAlignmentKm + " km" : ""]
            ];

            return `
                <div class="alignment-history-record">
                    <div class="insurance-details-header">
                        <h3>Alignment ${index + 1}</h3>

                        <button type="button"
                            class="edit-icon-btn edit-alignment-record"
                            data-index="${index}">
                            Edit
                        </button>

                        <button type="button"
                            class="edit-icon-btn delete-alignment-record"
                            data-index="${index}">
                            Delete
                        </button>
                    </div>

                    ${rows
                        .filter(([label, value]) => value)
                        .map(([label, value]) => `
                            <div class="detail-row">
                                <span class="detail-label">${escapeHTML(label)}</span>
                                <span class="detail-colon">:</span>
                                <span class="detail-value">${escapeHTML(value)}</span>
                            </div>
                        `).join("")}
                </div>
                <hr>
            `;
        }).join("")
        : "<p>No wheel alignment records added yet.</p>";


    showOnlyPage(alignmentDetailsPage);
}








function showTyreHistoryPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const content = document.getElementById("tyreHistoryContent");
    const tyreHistory = vehicle.tyreHistory || [];

    content.innerHTML = tyreHistory.length
        ? tyreHistory.slice().reverse().map((tyre, index) => {
            const rows = [
                ["Date", formatDate(tyre.date)],
                ["Kilometres", tyre.km ? tyre.km + " km" : ""],
                ["Tyre brand", tyre.brand],
                ["Tyres replaced", tyre.count ? String(tyre.count) : ""],
                ["Tyre positions", (tyre.positions || []).join(", ")],
                ["Amount", tyre.amount ? "₹" + tyre.amount : ""],
                ["Next tyre check", tyre.targetKm ? tyre.targetKm + " km" : ""],
                ["Stepney brand", tyre.stepneyBrand],
                ["Stepney condition", tyre.stepneyCondition]
            ];

            return `
                <div class="tyre-history-record">
                   <div class="insurance-details-header">
    <h3>Replacement ${index + 1}</h3>
 <button
    type="button"
    class="edit-icon-btn edit-tyre-record"
    data-index="${index}">
    Edit
</button>
<button
    type="button"
    class="edit-icon-btn delete-tyre-record"
    data-index="${index}">
    Delete
</button>
</div>

                    ${rows
                        .filter(([label, value]) => value)
                        .map(([label, value]) => `
                            <div class="detail-row">
                                <span class="detail-label">${escapeHTML(label)}</span>
                                <span class="detail-colon">:</span>
                                <span class="detail-value">${escapeHTML(value)}</span>
                            </div>
                        `).join("")}
                </div>
                <hr>
            `;
        }).join("")
        : "<p>No tyre replacement records added yet.</p>";

    showOnlyPage(tyreHistoryPage);
}






function showFuelHistoryPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const fuelHistory = vehicle.fuelHistory || [];

const fuelContent = document.getElementById("fuelHistoryContent");

fuelContent.innerHTML = fuelHistory.length
    ? fuelHistory.map((fuel, index) => `
        <div class="tyre-history-record">
            <h3>Fuel Entry ${index + 1}</h3>
            <p><strong>Date:</strong> ${formatDate(fuel.date)}</p>
            <p><strong>Amount:</strong> ₹${Number(fuel.amount).toFixed(2)}</p>
            <p><strong>Fuel Price:</strong> ₹${Number(fuel.price).toFixed(2)} per litre</p>
            <p><strong>Litres:</strong> ${Number(fuel.litres).toFixed(3)} L</p>
        </div>
        <hr>
    `).join("")
    : "<p>No fuel records added yet.</p>";

document.getElementById("currentFuelPrice").textContent =
        vehicle.fuelPrice ? "₹" + vehicle.fuelPrice : "Not set";

    showOnlyPage(fuelHistoryPage);




}




function showSavedFuelHistoryPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const fuelHistory = [...(vehicle.fuelHistory || [])]
    .sort((a, b) => b.date.localeCompare(a.date));
    const fuelContent = document.getElementById(
        "savedFuelHistoryContent"
    );

    fuelContent.innerHTML = fuelHistory.length
    ? fuelHistory.map((fuel, index) => `
        <div class="tyre-history-record">
            <div class="record-header">
                <h3>Fuel Entry ${index + 1}</h3>
                <div>
                    <button type="button"
                        class="edit-fuel-record"
                        data-index="${index}">Edit</button>
                    <button type="button"
                        class="delete-fuel-record"
                        data-index="${index}">Delete</button>
                </div>
            </div>
           <div class="detail-row">
    <strong>Date</strong>
    <span>:</span>
    <span>${formatDate(fuel.date)}</span>
</div>

<div class="detail-row">
    <strong>Amount</strong>
    <span>:</span>
    <span>₹${Number(fuel.amount).toFixed(2)}</span>
</div>

<div class="detail-row">
    <strong>Fuel Price</strong>
    <span>:</span>
    <span>₹${Number(fuel.price).toFixed(2)} per litre</span>
</div>

<div class="detail-row">
    <strong>Litres</strong>
    <span>:</span>
    <span>${Number(fuel.litres).toFixed(3)} L</span>
</div>
        </div>
        <hr>
    `).join("")
    : "<p>No fuel records added yet.</p>";

    showOnlyPage(
        document.getElementById("savedFuelHistoryPage")
    );
}







function savePollution(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Create history from the existing certificate if needed.
    if (!Array.isArray(vehicle.pollutionHistory)) {
        vehicle.pollutionHistory = vehicle.pollutionCertificate
            ? [{ ...vehicle.pollutionCertificate }]
            : [];
    }

    const pollution = {
        certificateNumber:
            document.getElementById("pollutionNumber").value.trim(),

        startDate:
            document.getElementById("pollutionStartDate").value,

        expiryDate:
            document.getElementById("pollutionExpiryDate").value,
                amount:
            document.getElementById("pollutionAmount").value,

        reminderDays: Array.from(
            document.querySelectorAll(
                'input[name="pollutionReminder"]:checked'
            )
        ).map(input => Number(input.value))
    };

    if (editingPollutionIndex !== null) {
        vehicle.pollutionHistory[editingPollutionIndex] = pollution;
    } else {
        vehicle.pollutionHistory.push(pollution);
    }

    // Keep the latest certificate available to existing reminders.
    vehicle.pollutionCertificate =
        vehicle.pollutionHistory[vehicle.pollutionHistory.length - 1] || null;

    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    editingPollutionIndex = null;

    showPollutionDetailsPage();
}





function showPollutionDetailsPage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Keep the existing certificate when history hasn't been created yet.
if (!Array.isArray(vehicle.pollutionHistory)) {
    vehicle.pollutionHistory = vehicle.pollutionCertificate
        ? [{ ...vehicle.pollutionCertificate }]
        : [];
}

const pollutionHistory = vehicle.pollutionHistory;

    const content = document.getElementById(
        "pollutionDetailsContent"
    );

    if (pollutionHistory.length === 0) {
        content.innerHTML = `
            <p>No pollution certificate details added yet.</p>
        `;
  } else {
    content.innerHTML = pollutionHistory
        .slice()
        .reverse()
        .map((pollution, index) => {
            const rows = [
    ["Certificate number", pollution.certificateNumber],
    ["Issue date", formatDate(pollution.startDate)],
    ["Expiry date", formatDate(pollution.expiryDate)],
    ["Amount Paid", pollution.amount !== undefined && pollution.amount !== ""
        ? "₹" + pollution.amount
        : ""]
];

            return `
                <div class="pollution-history-record">
                    <div class="insurance-details-header">
                        <h3>Certificate ${index + 1}</h3>

                        <button
                            type="button"
                            class="edit-icon-btn edit-pollution-record"
                            data-index="${index}">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="edit-icon-btn delete-pollution-record"
                            data-index="${index}">
                            Delete
                        </button>
                    </div>

                    ${rows
                        .filter(([label, value]) => value)
                        .map(([label, value]) => `
                            <div class="detail-row">
                                <span class="detail-label">${escapeHTML(label)}</span>
                                <span class="detail-colon">:</span>
                                <span class="detail-value">${escapeHTML(value)}</span>
                            </div>
                        `).join("")}
                </div>
                
            `;
        }).join("");
}

    showOnlyPage(
        document.getElementById("pollutionDetailsPage")
    );
}










// SHOW VEHICLE CARE ITEMS
function showVehicleCare() {
    const careItems = [
        { title: "Basic Details", icon: "📋" },
        { title: "Fuel History", icon: "⛽" },
        { title: "Service", icon: "🔧" },
        { title: "Insurance", icon: "🛡️" },
        { title: "Pollution Certificate", icon: "📜" },
        { title: "Oil Change", icon: "💧" },
        { title: "Wheel Alignment", icon: "🛞" },
        { title: "Tyres", icon: "🛞" },
        { title: "Battery", icon: "🔋" }
    ];

    vehicleCare.innerHTML = careItems.map(item => `
        <div class="care-item care-clickable"
             data-care="${escapeHTML(item.title)}"
             role="button"
             tabindex="0">

       <div class="care-card-title">
 <span class="care-icon care-icon-${item.title.toLowerCase().replace(/\s+/g, '-')}">${item.icon}</span>
    <span class="care-name">${escapeHTML(item.title)}</span>
    <span class="care-arrow">›</span>
</div>
            <div class="care-card-link"></div>
        </div>
    `).join("");
}






function showInsurancePage() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    // Load the selected insurance record when editing;
    // otherwise, open an empty form for a new record.
    const history = Array.isArray(vehicle.insuranceHistory)
        ? vehicle.insuranceHistory
        : [];

    const insurance =
        editingInsuranceIndex !== null
            ? history[editingInsuranceIndex]
            : {};

    document.getElementById("insuranceType").value =
        insurance?.type || "";

    document.getElementById("insuranceCompany").value =
        insurance?.company || "";

    document.getElementById("policyNumber").value =
        insurance?.policyNumber || "";

    document.getElementById("insuranceStartDate").value =
        insurance?.startDate || "";

    document.getElementById("insuranceExpiryDate").value =
        insurance?.expiryDate || "";

    document.getElementById("insurancePremium").value =
        insurance?.premium || "";

    const savedInsuranceReminderDays =
        insurance?.reminderDays || [30, 15, 7, 0];

    document.querySelectorAll(
        'input[name="insuranceReminder"]'
    ).forEach(input => {
        input.checked = savedInsuranceReminderDays.includes(
            Number(input.value)
        );
    });

    showOnlyPage(insurancePage);

    document.getElementById(
        "backFromInsurance"
    ).style.display = "none";
}







function saveInsurance(event) {
    event.preventDefault();

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    if (!Array.isArray(vehicle.insuranceHistory)) {
        vehicle.insuranceHistory = [];

        // Preserve any existing insurance record
        if (vehicle.insurance) {
            vehicle.insuranceHistory.push(vehicle.insurance);
        }
    }

    const insuranceRecord = {
        type:
            document.getElementById("insuranceType").value,

        company:
            document.getElementById("insuranceCompany").value.trim(),

        policyNumber:
            document.getElementById("policyNumber").value.trim(),

        startDate:
            document.getElementById("insuranceStartDate").value,

        expiryDate:
            document.getElementById("insuranceExpiryDate").value,

        premium:
            document.getElementById("insurancePremium").value,

        reminderDays: Array.from(
            document.querySelectorAll(
                'input[name="insuranceReminder"]:checked'
            )
        ).map(input => Number(input.value))
    };

    if (editingInsuranceIndex !== null) {
        vehicle.insuranceHistory[editingInsuranceIndex] =
            insuranceRecord;

        editingInsuranceIndex = null;
    } else {
        vehicle.insuranceHistory.push(insuranceRecord);
    }

    vehicle.insurance =
        vehicle.insuranceHistory[
            vehicle.insuranceHistory.length - 1
        ];

    saveVehicles();
    showInsuranceDetailsPage();
}





// SAFELY DISPLAY USER-ENTERED TEXT
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}







vehicleCare.addEventListener("click", function(event) {
    const card = event.target.closest(".care-clickable");

    if (!card) return;

    const title = card.dataset.care;

 if (title === "Basic Details") {
    showBasicDetailsPage();

} else if (title === "Fuel History") {

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    document.getElementById("currentFuelPrice").textContent =
        vehicle.fuelPrice
            ? "₹" + vehicle.fuelPrice
            : "Not set";

    showOnlyPage(fuelHistoryPage);
} else if (title === "Insurance") {
    showInsuranceDetailsPage();
} else if (title === "Pollution Certificate") {
    showPollutionDetailsPage();
} else if (title === "Service") {
    showServiceDetailsPage();
} else if (title === "Oil Change") {
    showOilChangeDetailsPage();
} else if (title === "Wheel Alignment") {
    showAlignmentDetailsPage();
} else if (title === "Tyres") {
    showTyreHistoryPage();
}
});

vehicleCare.addEventListener("keydown", function(event) {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".care-clickable");

    if (!card) return;

    event.preventDefault();
    card.click();
});







// BUTTONS AND Form

document.getElementById("backFromImportantDates")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });


document.getElementById("addVehicleBtn")
    .addEventListener("click", showVehicleForm);

document.getElementById("cancelAdd")
    .addEventListener("click", () => {
        if (activeVehicleId) {
            showDashboard(activeVehicleId);
        } else {
            renderVehicleList();
        }
    });

document.getElementById("vehicleForm")
    .addEventListener("submit", saveVehicle);

document.getElementById("backToVehicles")
    .addEventListener("click", renderVehicleList);

document.getElementById("backFromBasicDetails")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });

document.getElementById("editBasicDetails")
    .addEventListener("click", () => {
        showBasicDetailsForm();
    });







document.getElementById("pollutionForm")
    .addEventListener("submit", savePollution);


document.getElementById("serviceForm")
    .addEventListener("submit", saveService);


document.getElementById("backToVehicleCare")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });





// INSURANCE BUTTONS AND FORM

document.getElementById("insuranceForm")
    .addEventListener("submit", saveInsurance);

document.getElementById("cancelInsurance")
    .addEventListener("click", () => {
        editingInsuranceIndex = null;
        showInsuranceDetailsPage();
    });


document.getElementById("backToVehicleCare")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });


document.getElementById("editInsuranceDetails")
    .addEventListener("click", () => {
        document.getElementById("insuranceForm").reset();

        editingInsuranceIndex = null;

        document.querySelectorAll(
            'input[name="insuranceReminder"]'
        ).forEach(input => {
            input.checked = [30, 15, 7, 0].includes(
                Number(input.value)
            );
        });

        showInsurancePage();
    });





document.getElementById("insuranceDetailsContent")
    .addEventListener("click", function(event) {
        const button = event.target.closest(
            ".edit-insurance-record, .delete-insurance-record"
        );

        if (!button) return;

        const displayIndex = Number(button.dataset.index);

const vehicle = vehicles.find(
    item => item.id === activeVehicleId
);

if (!vehicle) return;



        

        // Preserve older saved insurance data
        if (!Array.isArray(vehicle.insuranceHistory)) {
            vehicle.insuranceHistory = vehicle.insurance
                ? [vehicle.insurance]
                : [];
        } else if (
            vehicle.insuranceHistory.length === 0 &&
            vehicle.insurance
        ) {
            vehicle.insuranceHistory = [vehicle.insurance];
        }

const index =
    vehicle.insuranceHistory.length - 1 - displayIndex;

        if (!vehicle.insuranceHistory[index]) return;

        if (button.classList.contains("delete-insurance-record")) {
            const confirmed = confirm(
                "Delete this permanently? This data cannot be restored."
            );

            if (!confirmed) return;

            vehicle.insuranceHistory.splice(index, 1);

            vehicle.insurance =
                vehicle.insuranceHistory.length > 0
                    ? vehicle.insuranceHistory[
                        vehicle.insuranceHistory.length - 1
                    ]
                    : null;

            editingInsuranceIndex = null;

            saveVehicles();
            showInsuranceDetailsPage();
            return;
        }

        const insurance = vehicle.insuranceHistory[index];

        document.getElementById("insuranceType").value =
            insurance.type || "";

        document.getElementById("insuranceCompany").value =
            insurance.company || "";

        document.getElementById("policyNumber").value =
            insurance.policyNumber || "";

        document.getElementById("insuranceStartDate").value =
            insurance.startDate || "";

        document.getElementById("insuranceExpiryDate").value =
            insurance.expiryDate || "";

        document.getElementById("insurancePremium").value =
            insurance.premium || "";

        const savedDays = insurance.reminderDays || [30, 15, 7, 0];

        document.querySelectorAll(
            'input[name="insuranceReminder"]'
        ).forEach(input => {
            input.checked = savedDays.includes(
                Number(input.value)
            );
        });

        editingInsuranceIndex = index;

        showInsurancePage();
    });


document.getElementById("backFromPollution")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });

document.getElementById("backFromServiceDetails")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });


document.getElementById("cancelService")
    .addEventListener("click", () => {
        showServiceDetailsPage();
    });



document.getElementById("editPollutionDetails")
    .addEventListener("click", () => {
        editingPollutionIndex = null;
        showPollutionPage();
    });

document.getElementById("cancelPollution")
    .addEventListener("click", () => {
        editingPollutionIndex = null;
        showPollutionDetailsPage();
    });



document.getElementById("pollutionDetailsContent")
    .addEventListener("click", function(event) {
        const button = event.target.closest(
            ".edit-pollution-record, .delete-pollution-record"
        );

        if (!button) return;

        const displayIndex = Number(button.dataset.index);

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (!vehicle) return;

        if (!Array.isArray(vehicle.pollutionHistory)) {
            vehicle.pollutionHistory = vehicle.pollutionCertificate
                ? [{ ...vehicle.pollutionCertificate }]
                : [];
        }

        const index =
            vehicle.pollutionHistory.length - 1 - displayIndex;

        if (!vehicle.pollutionHistory[index]) return;

        if (button.classList.contains("delete-pollution-record")) {
            const confirmed = confirm(
                "Delete this pollution certificate permanently?"
            );

            if (!confirmed) return;

            vehicle.pollutionHistory.splice(index, 1);

            vehicle.pollutionCertificate =
                vehicle.pollutionHistory[
                    vehicle.pollutionHistory.length - 1
                ] || null;

            localStorage.setItem("vehicles", JSON.stringify(vehicles));

            showPollutionDetailsPage();
            return;
        }

        editingPollutionIndex = index;
        showPollutionPage();
    });


document.getElementById("editServiceDetails")
    .addEventListener("click", () => {
        editingServiceIndex = null;
        showServicePage();
    });







document.getElementById("serviceDetailsContent")
    .addEventListener("click", function(event) {
        const button = event.target.closest(
            ".edit-service-record, .delete-service-record"
        );

        if (!button) return;

        const displayIndex = Number(button.dataset.index);

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (!vehicle) return;

        if (!Array.isArray(vehicle.serviceHistory)) {
            vehicle.serviceHistory = vehicle.service
                ? [{ ...vehicle.service }]
                : [];
        }

        const index =
            vehicle.serviceHistory.length - 1 - displayIndex;

        if (!vehicle.serviceHistory[index]) return;

        if (button.classList.contains("delete-service-record")) {
            const confirmed = confirm(
                "Delete this service record permanently?"
            );

            if (!confirmed) return;

            vehicle.serviceHistory.splice(index, 1);

            vehicle.service = vehicle.serviceHistory.length
                ? { ...vehicle.serviceHistory[vehicle.serviceHistory.length - 1] }
                : null;

            saveVehicles();
            showServiceDetailsPage();
            return;
        }

        editingServiceIndex = index;
        showServicePage();
    });






// OIL CHANGE BUTTONS AND FORM

document.getElementById("oilChangeForm")
    .addEventListener("submit", saveOilChange);

document.getElementById("cancelOilChange")
    .addEventListener("click", () => {
        showOilChangeDetailsPage();
    });

document.getElementById("editOilChangeDetails")
    .addEventListener("click", () => {
        editingOilChangeIndex = null;
        showOilChangePage();
    });

document.getElementById("backFromOilChangeDetails")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });





// WHEEL ALIGNMENT BUTTONS AND FORM

document.getElementById("alignmentForm")
    .addEventListener("submit", saveAlignment);

document.getElementById("cancelAlignment")
    .addEventListener("click", () => {
        showAlignmentDetailsPage();
    });


document.getElementById("backFromAlignmentDetails")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });


document.getElementById("addAlignment")
    .addEventListener("click", () => {
        document.getElementById("alignmentForm").reset();

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (vehicle) {
            delete vehicle.editingAlignmentIndex;
        }

        document.querySelectorAll(
            'input[name="alignmentReminder"]'
        ).forEach(input => {
            input.checked = [30, 15, 7, 0].includes(
                Number(input.value)
            );
        });

        showAlignmentPage();
    });





document.getElementById("alignmentDetailsContent")
    .addEventListener("click", function(event) {
        const button = event.target.closest(
            ".edit-alignment-record, .delete-alignment-record"
        );

        if (!button) return;

        const displayIndex = Number(button.dataset.index);

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (!vehicle) return;

        if (!Array.isArray(vehicle.alignmentHistory)) {
            vehicle.alignmentHistory = vehicle.alignment
                ? [vehicle.alignment]
                : [];
        }

        const index = vehicle.alignmentHistory.length - 1 - displayIndex;

if (!vehicle.alignmentHistory[index]) return;

        if (button.classList.contains("delete-alignment-record")) {
            const confirmed = confirm(
                "Delete this permanently? This data cannot be restored."
            );

            if (!confirmed) return;

            vehicle.alignmentHistory.splice(index, 1);

            vehicle.alignment =
                vehicle.alignmentHistory.length > 0
                    ? vehicle.alignmentHistory[
                        vehicle.alignmentHistory.length - 1
                    ]
                    : null;

            saveVehicles();
            showAlignmentDetailsPage();
            return;
        }

        const alignment = vehicle.alignmentHistory[index];

        document.getElementById("lastAlignmentDate").value =
            alignment.lastAlignmentDate || "";

        document.getElementById("lastAlignmentKm").value =
            alignment.lastAlignmentKm || "";

        document.getElementById("alignmentAmount").value =
            alignment.amount || "";

        document.getElementById("nextAlignmentDate").value =
            alignment.nextAlignmentDate || "";

        document.getElementById("nextAlignmentKm").value =
            alignment.nextAlignmentKm || "";

        const savedDays = alignment.reminderDays || [30, 15, 7, 0];

        document.querySelectorAll(
            'input[name="alignmentReminder"]'
        ).forEach(input => {
            input.checked = savedDays.includes(Number(input.value));
        });

        vehicle.editingAlignmentIndex = index;

        showAlignmentPage();
    });




// FUEL HISTORY EDIT AND DELETE BUTTONS

document.getElementById("savedFuelHistoryContent")
    .addEventListener("click", function(event) {
        const button = event.target.closest(
            ".edit-fuel-record, .delete-fuel-record"
        );

        if (!button) return;

        const displayedIndex = Number(button.dataset.index);

const vehicle = vehicles.find(
    item => item.id === activeVehicleId
);

if (!vehicle) return;

const sortedFuelHistory = [...(vehicle.fuelHistory || [])]
    .sort((a, b) => b.date.localeCompare(a.date));

const selectedFuel = sortedFuelHistory[displayedIndex];

const index = vehicle.fuelHistory.indexOf(selectedFuel);

        

        if (!vehicle || !vehicle.fuelHistory?.[index]) return;

        if (button.classList.contains("delete-fuel-record")) {
            const confirmed = confirm(
                "Delete this permanently? This data cannot be restored."
            );

            if (!confirmed) return;

            vehicle.fuelHistory.splice(index, 1);
            saveVehicles();
            showSavedFuelHistoryPage();
            return;
        }

        const fuel = vehicle.fuelHistory[index];

        editingFuelIndex = index;

        document.getElementById("fuelDate").value = fuel.date || "";
        document.getElementById("fuelAmount").value = fuel.amount || "";

        document.getElementById("fuelFormHeading").textContent =
            "Edit Fuel Entry";

        document.getElementById("saveFuelEntry").textContent = "Update";
        document.getElementById("cancelFuelEdit").hidden = false;

        document.getElementById("fuelEntryPrice").textContent =
            "₹" + fuel.price;

        document.getElementById("fuelLitresPreview").textContent =
            Number(fuel.litres).toFixed(3);

        showOnlyPage(fuelHistoryPage);
    });




document.getElementById("cancelFuelEdit")
    .addEventListener("click", () => {
        editingFuelIndex = null;

        document.getElementById("fuelForm").reset();

        document.getElementById("fuelFormHeading").textContent =
            "Add Fuel Entry";

        document.getElementById("saveFuelEntry").textContent =
            "Save";

        document.getElementById("cancelFuelEdit").hidden = true;

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        document.getElementById("fuelEntryPrice").textContent =
            vehicle && vehicle.fuelPrice
                ? "₹" + vehicle.fuelPrice
                : "Not set";

        document.getElementById("fuelLitresPreview").textContent =
            "0.000";

        showSavedFuelHistoryPage();
    });





// TYRE HISTORY BUTTONS

document.getElementById("addTyreReplacement")
    .addEventListener("click", () => {
        editingTyreIndex = null;
        document.getElementById("tyreForm").reset();
        showOnlyPage(document.getElementById("tyreFormPage"));
    });

document.getElementById("backFromTyreHistory")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });

document.getElementById("cancelTyreForm")
    .addEventListener("click", () => {
        showOnlyPage(tyreHistoryPage);
    });

document.getElementById("tyreForm")
    .addEventListener("submit", saveTyreReplacement);

document.getElementById("tyreHistoryContent")
    .addEventListener("click", function(event) {
        const button = event.target.closest(
".edit-tyre-record, .delete-tyre-record"
);
if (!button) return;

if (button.classList.contains("delete-tyre-record")) {
const confirmed = confirm(
"Delete this permanently? This data cannot be restored."
);

if (!confirmed) return;

const index = Number(button.dataset.index);

const vehicle = vehicles.find(
    item => item.id === activeVehicleId
);

if (!vehicle || !vehicle.tyreHistory?.[index]) return;

vehicle.tyreHistory.splice(index, 1);

vehicle.tyreHistory.splice(index, 1);

saveVehicles();
showTyreHistoryPage();
return;

}




        const displayIndex = Number(button.dataset.index);

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        const index = vehicle.tyreHistory.length - 1 - displayIndex;
const tyre = vehicle?.tyreHistory?.[index];
        if (!tyre) return;

        editingTyreIndex = index;

        document.getElementById("tyreReplacementDate").value = tyre.date || "";
        document.getElementById("tyreReplacementKm").value = tyre.km || "";

document.getElementById("tyreTargetKm").value = tyre.targetKm || "";
const savedReminderKm = Array.isArray(tyre.reminderKm)
    ? tyre.reminderKm.map(Number)
    : [5000, 3000, 1000, 0];

document.querySelectorAll(
    'input[name="tyreReminderKm"]'
).forEach(input => {
    input.checked = savedReminderKm.includes(Number(input.value));
});


        document.getElementById("tyreBrand").value = tyre.brand || "";
        document.getElementById("tyreCount").value = String(tyre.count || "");

        document.querySelectorAll('input[name="tyrePosition"]').forEach(input => {
            input.checked = (tyre.positions || []).includes(input.value);


const savedReminderKm = Array.isArray(tyre.reminderKm)
    ? tyre.reminderKm.map(Number)
    : [5000, 3000, 1000, 0];

document.querySelectorAll('input[name="tyreReminderKm"]').forEach(input => {
    input.checked = savedReminderKm.includes(Number(input.value));
});

        });

        document.getElementById("tyreAmount").value = tyre.amount || "";
        document.getElementById("stepneyBrand").value = tyre.stepneyBrand || "";
        document.getElementById("stepneyCondition").value = tyre.stepneyCondition || "";

        showOnlyPage(document.getElementById("tyreFormPage"));
    });






function showImportantReminders() {
    const reminderBox = document.getElementById("importantReminders");

    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = [];

    // Calculate days remaining until a date
    function getDaysLeft(dateString) {
        if (!dateString) return null;

        const parts = dateString.split("-").map(Number);

        if (
            parts.length !== 3 ||
            parts.some(number => !Number.isInteger(number)) ||
            parts[0] < 1000 ||
            parts[1] < 1 || parts[1] > 12 ||
            parts[2] < 1 || parts[2] > 31
        ) {
            return null;
        }

        const expiry = new Date(
            Date.UTC(parts[0], parts[1] - 1, parts[2])
        );

        if (
            expiry.getUTCFullYear() !== parts[0] ||
            expiry.getUTCMonth() !== parts[1] - 1 ||
            expiry.getUTCDate() !== parts[2]
        ) {
            return null;
        }

        const todayUTC = Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        return Math.round(
            (expiry.getTime() - todayUTC) / 86400000
        );
    }

    // Add a reminder only after its selected reminder
    // period has started.
    function addReminder(title, date, selectedDays, extra = {}) {
    if ((!date && extra.kmLeft == null) || !Array.isArray(selectedDays)) return;

    const daysLeft = getDaysLeft(date);

    if (daysLeft === null && extra.kmLeft == null) return;

    const reminderDays = selectedDays.map(Number);

    const kmReached = extra.kmReached === true;

    const shouldShow =
        daysLeft < 0 ||
        kmReached ||
        reminderDays.some(day =>
            Number.isFinite(day) &&
            day >= 0 &&
            daysLeft <= day
        );

    if (!shouldShow) return;

    let status;

    if (daysLeft < 0) {
        status = `Expired ${Math.abs(daysLeft)} day(s) ago`;
    } else if (daysLeft === 0) {
        status = "Expires today";
    } else {
        status = `${daysLeft} day(s) left`;
    }

    reminders.push({
        title,
        status,
        daysLeft,
        reminderDays: reminderDays.filter(
            day => Number.isFinite(day) && day >= 0
        ),
        kmLeft: extra.kmLeft ?? null,
        kmReached
    });
}

    // INSURANCE
    const insurance = vehicle.insurance;

    if (insurance) {
        addReminder(
            "Insurance",
            insurance.expiryDate,
            insurance.reminderDays
        );
    }

    // OTHER VEHICLE-CARE ITEMS
    // These will work when their forms save data using
    // the same structure: expiryDate and reminderDays.
    const otherItems = [
        {
            key: "pollutionCertificate",
            title: "Pollution Certificate"
        },
        {
            key: "service",
            title: "Service"
        },
        {
            key: "oilChange",
            title: "Oil Change"
        },
        {
            key: "tyres",
            title: "Tyres"
        },
        {
            key: "wipers",
            title: "Wipers"
        },
        {
            key: "battery",
            title: "Battery"
        }
    ];

    otherItems.forEach(item => {
    const details = vehicle[item.key];

    if (details) {
        const isService =
    item.key === "service" ||
    item.key === "oilChange";

        const currentKm = Number(vehicle.km);
        const nextServiceKm = Number(
    item.key === "oilChange"
        ? details.nextOilChangeKm
        : details.nextServiceKm
);

        const targetKm = item.key === "oilChange"
    ? details.nextOilChangeKm
    : details.nextServiceKm;

const hasKmTarget =
    isService &&
    targetKm !== "" &&
    targetKm !== null &&
    targetKm !== undefined &&
    Number.isFinite(Number(targetKm));



        const kmLeft = hasKmTarget
    ? Number(targetKm) - currentKm
    : null;



        addReminder(
            item.title,
            details.nextServiceDate ||
details.nextOilChangeDate ||
details.expiryDate ||
details.dueDate,
            details.reminderDays,
            {
                kmLeft,
                kmReached: hasKmTarget && kmLeft <= 0
            }
        );
    }


});




// WHEEL ALIGNMENT REMINDER
    const alignmentHistory = vehicle.alignmentHistory || [];
    const latestAlignment =
        alignmentHistory.length > 0
            ? alignmentHistory[alignmentHistory.length - 1]
            : vehicle.alignment;

    if (latestAlignment) {
        const currentKm = Number(vehicle.km);
        const targetKm = latestAlignment.nextAlignmentKm;

        const hasKmTarget =
            targetKm !== "" &&
            targetKm !== null &&
            targetKm !== undefined &&
            Number.isFinite(Number(targetKm));

        const kmLeft = hasKmTarget
            ? Number(targetKm) - currentKm
            : null;

        addReminder(
            "Wheel Alignment",
            latestAlignment.nextAlignmentDate,
            latestAlignment.reminderDays || [30, 15, 7, 0],
            {
                kmLeft,
                kmReached: hasKmTarget && kmLeft <= 0
            }
        );
    }



// TYRE CHECK REMINDER
    const tyreHistory = vehicle.tyreHistory || [];

    if (tyreHistory.length > 0) {
        const latestTyre = tyreHistory[tyreHistory.length - 1];

        const currentKm = Number(vehicle.km);
        const rawTargetKm = latestTyre.targetKm;

        if (
            rawTargetKm !== "" &&
            rawTargetKm !== null &&
            rawTargetKm !== undefined &&
            Number.isFinite(currentKm) &&
            Number.isFinite(Number(rawTargetKm)) &&
            Number(rawTargetKm) > 0
        ) {
            const targetKm = Number(rawTargetKm);
            const replacementKm = Number(latestTyre.km);
            const kmLeft = targetKm - currentKm;
            const kmReached = kmLeft <= 0;

            const reminderKm = Array.isArray(latestTyre.reminderKm)
                ? latestTyre.reminderKm.map(Number)
                : [5000, 3000, 1000, 0];

            const shouldShowTyreReminder =
                kmReached ||
                reminderKm.some(limit =>
                    Number.isFinite(limit) &&
                    limit >= 0 &&
                    kmLeft <= limit
                );

            if (shouldShowTyreReminder) {
                reminders.push({
                    title: "Tyre Replacement",
                    status: "",
                    daysLeft: null,
                    reminderDays: [],
                    kmLeft: kmLeft,
                    kmReached: kmReached,
                    replacementKm: replacementKm,
                    targetKm: targetKm
                });
            }
        }
    }





    // Show the reminder list
    reminderBox.innerHTML = `
        <h2>🔔 Important Reminders</h2>

        ${
            reminders.length === 0
                ? "<p>No upcoming reminders.</p>"
                : `
                    <div class="reminder-list">
                        ${reminders.map(reminder => {
                            

const progress = reminder.title === "Tyre Replacement"
    ? (
        Number.isFinite(Number(reminder.replacementKm)) &&
        Number.isFinite(Number(reminder.targetKm)) &&
        Number(reminder.targetKm) > Number(reminder.replacementKm)
            ? Math.min(
                100,
                Math.max(
                    0,
                    ((Number(reminder.targetKm) - Number(vehicle.km)) /
                    (Number(reminder.targetKm) - Number(reminder.replacementKm))) * 100
                )
            )
            : 0
      )
    : Math.min(
        100,
        Math.max(
            0,
            reminder.daysLeft < 0
                ? 100
                : (reminder.daysLeft / 30) * 100
        )
      );

let barColor = "#16A34A";

if (reminder.title === "Tyre Replacement") {
    barColor = "#8B5CF6";
} else if (reminder.daysLeft <= 2) {
    barColor = "#DC2626";
} else if (reminder.daysLeft <= 7) {
    barColor = "#FDBA74";
} else if (reminder.daysLeft <= 15) {
    barColor = "#2563EB";
}

                            return `
                                <div class="reminder-row">
                                    <div class="reminder-row-top">
                                        <strong>${escapeHTML(reminder.title)}</strong>
                                      <span>
   ${reminder.kmLeft !== null && reminder.kmLeft !== undefined && reminder.daysLeft === null
    ? ""
    : escapeHTML(reminder.status)}${
        reminder.kmLeft !== null && reminder.kmLeft !== undefined
            ? ` · ${Math.max(0, reminder.kmLeft).toLocaleString("en-IN")} km left`
            : ""
    }
</span>
                                    </div>

                                   <div class="reminder-progress">
    <div
        class="reminder-progress-fill"
        style="width: ${progress}%; background-color: ${barColor}">
    </div>
</div>
${reminder.kmReached
    ? '<p style="color: #DC2626; margin: 6px 0 0; font-weight: 600;">KM limit reached!</p>'
    : ""}
</div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                `
        }
    `;
}




function refreshReminders() {
    if (!vehicleDashboard.classList.contains("hidden")) {
        showImportantReminders();
    }
}

setInterval(refreshReminders, 60000);

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        refreshReminders();
    }
});

window.addEventListener("focus", refreshReminders);


document.getElementById("openFuelMonthlyUsage")
    .addEventListener("click", () => {
        showOnlyPage(
            document.getElementById("fuelMonthlyUsagePage")
        );
    });

document.getElementById("backFromFuelMonthlyUsage")
    .addEventListener("click", () => {
        showOnlyPage(fuelHistoryPage);
    });


document.getElementById("openSavedFuelHistory")
    .addEventListener("click", () => {
        showSavedFuelHistoryPage();
        
    });

document.getElementById("backFromSavedFuelHistory")
    .addEventListener("click", () => {
        showOnlyPage(fuelHistoryPage);
    });


// ADD FUEL DETAILS FROM SAVED HISTORY
document.getElementById("addFuelDetails")
    .addEventListener("click", () => {
        showOnlyPage(fuelHistoryPage);
    });

document.getElementById("showMonthlyFuelHistory")
    .addEventListener("click", showMonthlyFuelHistory);



document.getElementById("backFromFuelHistory")
    .addEventListener("click", () => {
        showDashboard(activeVehicleId);
    });





document.getElementById("updateFuelPrice")
    .addEventListener("click", () => {
        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (!vehicle) return;

        const price = prompt("Enter current fuel price per litre (₹):");

        if (price === null || price.trim() === "") return;

        const fuelPrice = Number(price);

        if (!Number.isFinite(fuelPrice) || fuelPrice <= 0) {
            alert("Please enter a valid fuel price.");
            return;
        }

        vehicle.fuelPrice = fuelPrice;
        saveVehicles();
        document.getElementById("currentFuelPrice").textContent =
    "₹" + fuelPrice;

document.getElementById("fuelEntryPrice").textContent =
    "₹" + fuelPrice;
    });



document.getElementById("fuelForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        if (!vehicle) return;

        if (!vehicle.fuelPrice || vehicle.fuelPrice <= 0) {
            alert("Please set the current fuel price first.");
            return;
        }

        const date = document.getElementById("fuelDate").value;
        const amount = Number(
            document.getElementById("fuelAmount").value
        );

        if (!date || !Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid date and amount.");
            return;
        }

        if (!vehicle.fuelHistory) {
            vehicle.fuelHistory = [];
        }

        const fuelEntry = {
            date: date,
            amount: amount,
            price: vehicle.fuelPrice,
            litres: amount / vehicle.fuelPrice
        };

        if (editingFuelIndex !== null) {
            vehicle.fuelHistory[editingFuelIndex] = fuelEntry;
            editingFuelIndex = null;
        } else {
            vehicle.fuelHistory.push(fuelEntry);
        }

        saveVehicles();
        document.getElementById("fuelForm").reset();

document.getElementById("fuelFormHeading").textContent =
    "Add Fuel Entry";

document.getElementById("saveFuelEntry").textContent = "Save";
document.getElementById("cancelFuelEdit").hidden = true;

document.getElementById("fuelEntryPrice").textContent =
    "₹" + vehicle.fuelPrice;

document.getElementById("fuelLitresPreview").textContent = "0.000";

showSavedFuelHistoryPage();

    });




document.getElementById("fuelAmount")
    .addEventListener("input", () => {
        const vehicle = vehicles.find(
            item => item.id === activeVehicleId
        );

        const amount = Number(
            document.getElementById("fuelAmount").value
        );

        const price = vehicle ? Number(vehicle.fuelPrice) : 0;

        document.getElementById("fuelLitresPreview").textContent =
            amount > 0 && price > 0
                ? (amount / price).toFixed(3)
                : "0.000";
    });



function showMonthlyFuelHistory() {
    const vehicle = vehicles.find(
        item => item.id === activeVehicleId
    );

    if (!vehicle) return;

    const fromDate =
        document.getElementById("monthlyFuelFromDate").value;

    const toDate =
        document.getElementById("monthlyFuelToDate").value;

    const content =
        document.getElementById("monthlyFuelHistoryContent");

    if (!fromDate || !toDate) {
        alert("Please select both dates.");
        return;
    }

    if (fromDate > toDate) {
        alert("From date cannot be after To date.");
        return;
    }

    const records = (vehicle.fuelHistory || [])
        .filter(fuel =>
            fuel.date >= fromDate && fuel.date <= toDate
        )
        .sort((a, b) => b.date.localeCompare(a.date));

const totalAmount = records.reduce(
    (sum, fuel) => sum + Number(fuel.amount || 0), 0
);

const totalLitres = records.reduce(
    (sum, fuel) => sum + Number(fuel.litres || 0), 0
);

    content.innerHTML = records.length
    ? `
        <div class="tyre-history-record">
            <h3>Monthly Usage Summary</h3>
          <div class="detail-row">
    <strong>Total Amount Spent</strong>
    <span>:</span>
    <span>₹${totalAmount.toFixed(2)}</span>
</div>

<div class="detail-row">
    <strong>Total Fuel Used</strong>
    <span>:</span>
    <span>${totalLitres.toFixed(3)} L</span>
</div>

<div class="detail-row">
    <strong>Number of Entries</strong>
    <span>:</span>
    <span>${records.length}</span>
</div>
        </div>
        <hr>
        ${records.map((fuel, index) => `
            <div class="tyre-history-record">
              <h3>Fuel Entry ${index + 1}</h3>

<div class="detail-row">
    <strong>Date</strong>
    <span>:</span>
    <span>${formatDate(fuel.date)}</span>
</div>

<div class="detail-row">
    <strong>Amount</strong>
    <span>:</span>
    <span>₹${Number(fuel.amount).toFixed(2)}</span>
</div>

<div class="detail-row">
    <strong>Fuel Price</strong>
    <span>:</span>
    <span>₹${Number(fuel.price).toFixed(2)} per litre</span>
</div>

<div class="detail-row">
    <strong>Litres</strong>
    <span>:</span>
    <span>${Number(fuel.litres).toFixed(3)} L</span>
</div>
            </div>
            <hr>
        `).join("")}
    `
    : "<p>No fuel records found for these dates.</p>";
}




// START THE APP
initApp();