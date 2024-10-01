document.getElementById("speedSlider").addEventListener("input", async () => {
  const speed = parseFloat(document.getElementById("speedSlider").value);

  document.getElementById("speedDisplay").textContent = speed.toFixed(1);

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPlaybackSpeed,
    args: [speed],
  });
});

function setPlaybackSpeed(speed) {
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = speed;
  }
}
