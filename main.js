const MAIN_SITE_URL = "https://www.afedusolutions.com/";
const LEAD_STORAGE_KEY = "afs-conversion-bridge-leads";
const LEAD_WEBHOOK_URL = "";

const leadForm = document.getElementById("lead-bridge-form");
const submitBtn = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status-message");

if (leadForm && submitBtn && statusMessage) {
    leadForm.addEventListener("submit", handleLeadSubmit);
}

async function handleLeadSubmit(event) {
    event.preventDefault();

    if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        setStatus("Please complete all required fields.", "error");
        return;
    }

    const formData = new FormData(leadForm);
    const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        intent: String(formData.get("intent") || ""),
        timeline: String(formData.get("timeline") || ""),
        notes: String(formData.get("notes") || "").trim(),
        consent: formData.get("consent") === "on",
        source: "conversion-bridge",
        capturedAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    setStatus("Saving your request...", "success");

    try {
        saveLeadLocally(payload);

        if (LEAD_WEBHOOK_URL) {
            await postLeadToWebhook(payload);
        }

        let countdown = 3;
        setStatus(
            `Success. Redirecting to our main website in ${countdown} seconds...`,
            "success"
        );

        const timer = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                clearInterval(timer);
                const redirectTarget = new URL(MAIN_SITE_URL);
                redirectTarget.searchParams.set("src", "conversion-bridge");
                redirectTarget.searchParams.set("intent", payload.intent);
                window.location.href = redirectTarget.toString();
                return;
            }

            setStatus(
                `Success. Redirecting to our main website in ${countdown} seconds...`,
                "success"
            );
        }, 1000);
    } catch (error) {
        setStatus(
            "We could not process your request right now. Please try again.",
            "error"
        );
        submitBtn.disabled = false;
    }
}

function saveLeadLocally(payload) {
    const previousLeads = JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || "[]");
    previousLeads.push(payload);
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(previousLeads));
}

async function postLeadToWebhook(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(LEAD_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error("Webhook request failed");
        }
    } finally {
        clearTimeout(timeout);
    }
}

function setStatus(message, state) {
    statusMessage.textContent = message;
    statusMessage.className = `status_message ${state}`;
}