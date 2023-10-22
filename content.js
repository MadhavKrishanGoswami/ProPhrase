console.log("content.js loaded bhai");
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("content.js received message");
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const selectedText = window.getSelection().toString();
    const replacementText = message.replacement;

    if (selectedText && selectedText.trim() !== "") {
      if (
        document.activeElement.tagName === "TEXTAREA" ||
        (document.activeElement.tagName === "INPUT" &&
          document.activeElement.type === "text")
      ) {
        document.activeElement.value = document.activeElement.value.replace(
          selectedText,
          replacementText
        );
      } else if (document.activeElement.isContentEditable) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(replacementText));
      }
    }
  });
});
