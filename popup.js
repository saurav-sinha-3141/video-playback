// Load the saved speed from Chrome storage when the popup is opened
document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Retrieve the last saved speed from storage
  chrome.storage.sync.get(["playbackSpeed"], (result) => {
    const savedSpeed = result.playbackSpeed || 1; // Default to 1x if no speed is saved
    document.getElementById("speedSlider").value = savedSpeed;
    document.getElementById("speedDisplay").textContent = savedSpeed.toFixed(1);

    // Apply the saved speed to the video on page load
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPlaybackSpeed,
      args: [savedSpeed], // Pass the saved speed to the content script
    });
  });
});

// Listen for changes to the slider and update the playback speed
document.getElementById("speedSlider").addEventListener("input", async () => {
  const speed = parseFloat(document.getElementById("speedSlider").value);

  // Update the display of the speed value
  document.getElementById("speedDisplay").textContent = speed.toFixed(1);

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Save the new speed to Chrome storage
  chrome.storage.sync.set({ playbackSpeed: speed });

  // Inject the speed value into the content script to change the video speed
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPlaybackSpeed,
    args: [speed], // Pass the speed to the content script
  });
});

// This function is injected into the content script to modify the video speed
function setPlaybackSpeed(speed) {
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = speed;
  }
}
