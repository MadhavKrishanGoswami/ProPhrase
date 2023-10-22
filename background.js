const apiKey = "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";
chrome.tabs.onActivated.addListener((tab) => {
  console.log("background.js installed in new tab");
  if (tab.url?.startsWith("chrome://")) return undefined;
  chrome.scripting.executeScript({
    target: { tabId: tab.tabId },
    files: ["content.js"],
  });
  // Context Menu Creation
  chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
      title: "Professionalize",
      id: "Professionalize",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      title: "Grammar Fix",
      id: "GrammarFix",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      title: "Enhance Language",
      id: "Enhance",
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log("tab id hai bhai yeh" + tab.id);
  var prompt = "";
  if (info.menuItemId === "Professionalize") {
    prompt = `Professionalize this text:${info.selectionText}`;
  } else if (info.menuItemId === "GrammarFix") {
    prompt = `Fix grammer: ${info.selectionText}`;
  } else if (info.menuItemId === "Enhance") {
    prompt = `Enhance the language of this text:${info.selectionText}`;
  }
  const apiUrl = "https://api.openai.com/v1/completions"; // Updated engine endpoint
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-davinci-002", // Specify the engine here, not "model" text-davinci-002
      prompt: prompt,
      max_tokens: 150, // Adjust max tokens based on your needs
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        // Handle API error response
        console.error("OpenAI API Error:", data.error.message);
      } else if (
        data.choices &&
        data.choices.length > 0 &&
        data.choices[0].text
      ) {
        const replacementtext = data.choices[0].text.trim();
        // Route to content.js to replace text
        if (info.menuItemId === "Professionalize") {
          chrome.tabs.sendMessage(tab.id, {
            action: "replaceText",
            replacement: replacementtext,
          });
        } else if (info.menuItemId === "GrammarFix") {
          chrome.tabs.sendMessage(tab.id, {
            action: "replaceText",
            replacement: replacementtext,
          });
        } else if (info.menuItemId === "Enhance") {
          chrome.tabs.sendMessage(tab.id, {
            action: "replaceText",
            replacement: replacementtext,
          });
        }
      } else {
        console.error("Invalid API response format:", data);
      }
    })
    .catch((error) => {
      // Handle other errors (e.g., network issues)
      console.error("Error:", error);
    });
});
