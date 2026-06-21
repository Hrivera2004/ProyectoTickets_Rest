"use strict";
const API_URL = "http://localhost:4000/api/issues";
const appContent = document.getElementById("app-content");
const toggleBtn = document.getElementById("report-toggle");
const widget = document.getElementById("report-widget");
const closeBtn = document.getElementById("report-close");
const textArea = document.getElementById("report-text");
const sendBtn = document.getElementById("report-send");
const toast = document.getElementById("toast");
function openWidget() {
    widget.classList.remove("hidden");
    textArea.focus();
}
function closeWidget() {
    widget.classList.add("hidden");
}
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
}
toggleBtn.addEventListener("click", () => {
    if (widget.classList.contains("hidden")) {
        openWidget();
    }
    else {
        closeWidget();
    }
});
closeBtn.addEventListener("click", () => {
    closeWidget();
});
sendBtn.addEventListener("click", async () => {
    const subject = textArea.value.trim();
    if (!subject) {
        textArea.focus();
        return;
    }
    closeWidget();
    try {
        const canvas = await html2canvas(appContent);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        const formData = new FormData();
        formData.append("subject", subject);
        if (blob) {
            formData.append("image", blob, "captura.png");
        }
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            throw new Error(`El servidor respondió con estado ${res.status}`);
        }
        showToast("Reporte enviado correctamente");
        textArea.value = "";
    }
    catch (error) {
        console.error("Error al enviar el reporte:", error);
        showToast("Ocurrió un error al enviar el reporte", true);
    }
});
