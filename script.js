 const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const fromText = document.querySelector("#fromText");
const toText = document.querySelector("#toText");
const icons = document.querySelectorAll("img");

// Populate dropdowns
selectTag.forEach((tag, id) => {
  for (const countryCode in countries) {
    let selected = "";
    if (id === 0 && countryCode === "en-GB") selected = "selected";
    else if (id === 1 && countryCode === "hi-IN") selected = "selected";

    const option = `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Translate button logic
translateBtn.addEventListener("click", () => {
  const text = fromText.value.trim();
  const translateFrom = selectTag[0].value;
  const translateTo = selectTag[1].value;

  if (!text) return alert("Please enter text to translate.");

  translateBtn.textContent = "Translating...";

  const apiURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      toText.value = data.responseData.translatedText;
      translateBtn.textContent = "Translate";
    })
    .catch(() => {
      toText.value = "Translation failed.";
      translateBtn.textContent = "Translate";
    });
});

// Icons: copy and speak
icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("copy")) {
      if (target.id === "from") navigator.clipboard.writeText(fromText.value);
      else navigator.clipboard.writeText(toText.value);
    } else {
      let utterance;
      if (target.id === "from" && fromText.value) {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else if (target.id === "to" && toText.value) {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      if (utterance) speechSynthesis.speak(utterance);
    }
  });
});
