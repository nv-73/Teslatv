function loadM3U() {
  const url = document.getElementById("m3uUrl").value;

  fetch(url)
    .then(res => res.text())
    .then(data => parseM3U(data))
    .catch(err => alert("Erreur chargement M3U"));
}

function parseM3U(data) {
  const lines = data.split("\n");
  const playlistDiv = document.getElementById("playlist");
  playlistDiv.innerHTML = "";

  let channelName = "";

  lines.forEach(line => {
    if (line.startsWith("#EXTINF")) {
      channelName = line.split(",")[1];
    } else if (line.startsWith("http")) {
      const channelUrl = line.trim();

      const div = document.createElement("div");
      div.className = "channel";
      div.innerText = channelName;

      div.onclick = () => playStream(channelUrl);

      playlistDiv.appendChild(div);
    }
  });
}

function playStream(url) {
  const video = document.getElementById("video");

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else {
    video.src = url;
    video.play();
  }
}
