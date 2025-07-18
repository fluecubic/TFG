chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // ... handle request ...

    // Indicate that you will send a response asynchronously
    // Do NOT return true if you don't intend to send a response.
    if (request.action === "performAsyncTask") {
      someAsyncTask(request.data).then(response => {
        sendResponse({ success: true, data: response });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true; // This keeps the message channel open
    }

    // For synchronous responses, just call sendResponse
    if (request.action === "performSyncTask") {
        sendResponse({ success: true, data: "sync response" });
        // No need to return true here
    }

    // If you don't call sendResponse and don't return true, the channel closes immediately.
  }
);