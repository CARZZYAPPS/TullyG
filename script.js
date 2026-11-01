import { firebaseConfig } from "./firebase-config.js";

const form = document.querySelector("#note-form");
const submitButton = document.querySelector("#submit-note");
const statusMessage = document.querySelector("#form-status");

function setStatus(message, state = "") {
  statusMessage.textContent = message;
  if (state) {
    statusMessage.dataset.state = state;
  } else {
    delete statusMessage.dataset.state;
  }
}

const requiredConfig = ["apiKey", "authDomain", "projectId", "appId"];
if (!requiredConfig.every((key) => firebaseConfig[key]?.trim())) {
  setStatus("The note box is waiting on its Firebase setup.");
} else {
  try {
    const [{ initializeApp }, { addDoc, collection, getFirestore, serverTimestamp }] =
      await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"),
      ]);

    const app = initializeApp(firebaseConfig);
    if (firebaseConfig.appCheckSiteKey?.trim()) {
      const { initializeAppCheck, ReCaptchaV3Provider } = await import(
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-check.js"
      );
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(firebaseConfig.appCheckSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }

    const db = getFirestore(app);
    submitButton.disabled = false;
    setStatus("Your message goes straight to Tully.");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const message = form.elements.message.value.trim();
      const email = form.elements.email.value.trim();
      if (!message) {
        setStatus("Please add a message before sending.", "error");
        form.elements.message.focus();
        return;
      }

      submitButton.disabled = true;
      setStatus("Sending your note...");

      try {
        await addDoc(collection(db, "messages"), {
          message,
          email,
          createdAt: serverTimestamp(),
        });
        form.reset();
        setStatus("Thanks for writing. Your note is on its way.", "success");
      } catch (error) {
        console.error("Could not send the Firebase message.", error);
        setStatus("Your note couldn’t be sent. Please try again in a bit.", "error");
      } finally {
        submitButton.disabled = false;
      }
    });
  } catch (error) {
    console.error("Could not initialize Firebase for the message form.", error);
    setStatus("The note box couldn’t connect. Please try again later.", "error");
  }
}
