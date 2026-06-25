declare function html2canvas(
  element: HTMLElement,
  options?: Record<string, unknown>
): Promise<HTMLCanvasElement>;

const API_URL = "http://localhost:4000/api/issues";

const toggleBtn = document.getElementById("report-toggle") as HTMLButtonElement;
const widget = document.getElementById("report-widget") as HTMLDivElement;
const closeBtn = document.getElementById("report-close") as HTMLButtonElement;
const textArea = document.getElementById("report-text") as HTMLTextAreaElement;
const screenshotCheck = document.getElementById("report-screenshot") as HTMLInputElement;
const sendBtn = document.getElementById("report-send") as HTMLButtonElement;
const toast = document.getElementById("toast") as HTMLDivElement;

function openWidget(): void {
  widget.classList.remove("hidden");
  textArea.focus();
}

function closeWidget(): void {
  widget.classList.add("hidden");
}

function showToast(message: string, isError = false): void {
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

async function captureScreen(): Promise<Blob | null> {
  
  toggleBtn.style.display = "none";
  widget.style.display = "none";

  try {
    const canvas = await html2canvas(document.body, { useCORS: true });
    return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  } finally {
    toggleBtn.style.display = "";
    widget.style.display = "";
  }
}

toggleBtn.addEventListener("click", () => {
  if (widget.classList.contains("hidden")) {
    openWidget();
  } else {
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

  const includeScreenshot = screenshotCheck.checked;

  closeWidget();

  try {
    const formData = new FormData();
    formData.append("subject", subject);

    if (includeScreenshot) {
      const blob = await captureScreen();
      if (blob) {
        formData.append("image", blob, "captura.png");
      }
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
    screenshotCheck.checked = false;
  } catch (error) {
    console.error("Error al enviar el reporte:", error);
    showToast("Ocurrió un error al enviar el reporte", true);
  }
});
