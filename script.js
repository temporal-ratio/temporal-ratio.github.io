const videoGroups = {
  agreement: {
    id: {
      title: "ID task: action rejects wrong rollout",
      description: "Expected file: materials/videos/video_action_disagreement_id.mp4",
      src: "./materials/videos/video_action_disagreement_id.mp4"
    },
    ood: {
      title: "OOD task: action ignores correct rollout",
      description: "Expected file: materials/videos/video_action_disagreement_ood.mp4",
      src: "./materials/videos/video_action_disagreement_ood.mp4"
    }
  },
  id: [
    ["ID demo 1", "Dish placement", "./materials/videos/id-demo-01.mp4"],
    ["ID demo 2", "Snack to shelf", "./materials/videos/id-demo-02.mp4"],
    ["ID demo 3", "Snack to paper bag", "./materials/videos/id-demo-03.mp4"],
    ["ID demo 4", "Bottle pick-and-place", "./materials/videos/id-demo-04.mp4"],
    ["ID demo 5", "Bottle cap unscrewing", "./materials/videos/id-demo-05.mp4"],
    ["ID demo 6", "Fruit placement", "./materials/videos/id-demo-06.mp4"],
    ["ID demo 7", "T-shirt manipulation", "./materials/videos/id-demo-07.mp4"],
    ["ID demo 8", "Bimanual handover", "./materials/videos/id-demo-08.mp4"],
    ["ID demo 9", "Additional ID behavior", "./materials/videos/id-demo-09.mp4"]
  ],
  single: [
    ["Single-task policy 1", "Learning curve example", "./materials/videos/single-task-learning-01.mp4"],
    ["Single-task policy 2", "Policy rollout example", "./materials/videos/single-task-learning-02.mp4"]
  ],
  ood: [
    ["OOD task 1", "Throw away fruits into the bin", "./materials/videos/ood-task-01.mp4"],
    ["OOD task 2", "Place fruits into the paper bag", "./materials/videos/ood-task-02.mp4"],
    ["OOD task 3", "Place snacks into the paper bag", "./materials/videos/ood-task-03.mp4"],
    ["OOD task 4", "Throw away snacks into the bin", "./materials/videos/ood-task-04.mp4"],
    ["OOD task 5", "Place plastic bottle into the paper bag", "./materials/videos/ood-task-05.mp4"],
    ["OOD task 6", "Throw away plastic bottle into the bin", "./materials/videos/ood-task-06.mp4"],
    ["OOD task 7", "Place snacks into the bin", "./materials/videos/ood-task-07.mp4"],
    ["OOD task 8", "Arrange snacks on the shelf", "./materials/videos/ood-task-08.mp4"],
    ["OOD task 9", "Additional compositional task", "./materials/videos/ood-task-09.mp4"]
  ]
};

function makeVideoCard(title, description, src) {
  const card = document.createElement("article");
  card.className = "video-card";

  const frame = document.createElement("div");
  frame.className = "video-frame";

  const video = document.createElement("video");
  video.className = "demo-video";
  video.controls = true;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";

  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";
  video.appendChild(source);

  const fallback = document.createElement("div");
  fallback.className = "video-fallback";
  fallback.innerHTML = `<strong>${title}</strong><span>Drop video at<br>${src.replace("./", "")}</span>`;

  video.addEventListener("loadeddata", () => {
    card.classList.remove("missing");
  });

  video.addEventListener("error", () => {
    card.classList.add("missing");
  }, true);

  source.addEventListener("error", () => {
    card.classList.add("missing");
  });

  frame.appendChild(video);
  frame.appendChild(fallback);

  const meta = document.createElement("div");
  meta.className = "video-meta";
  meta.innerHTML = `<h3>${title}</h3><p>${description}</p>`;

  card.appendChild(frame);
  card.appendChild(meta);
  video.load();

  return card;
}

function renderVideoGrid(groupName) {
  const mount = document.querySelector(`[data-grid="${groupName}"]`);
  if (!mount) return;
  videoGroups[groupName].forEach(([title, description, src]) => {
    mount.appendChild(makeVideoCard(title, description, src));
  });
}

function showAgreementVideo(key) {
  const mount = document.getElementById("agreement-video-slot");
  if (!mount) return;
  const item = videoGroups.agreement[key];
  mount.innerHTML = "";
  const card = makeVideoCard(item.title, item.description, item.src);
  card.classList.add("large");
  mount.replaceWith(card);
  card.id = "agreement-video-slot";
}

function hydrateOptionalImages() {
  document.querySelectorAll(".optional-image").forEach((img) => {
    const showPlaceholder = () => {
      const placeholder = document.createElement("div");
      placeholder.className = "optional-placeholder";
      placeholder.textContent = `Drop final PNG at ${img.getAttribute("src").replace("./", "")}`;
      img.replaceWith(placeholder);
    };
    img.addEventListener("error", showPlaceholder);
    if (img.complete && img.naturalWidth === 0) showPlaceholder();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderVideoGrid("id");
  renderVideoGrid("single");
  renderVideoGrid("ood");
  showAgreementVideo("id");
  hydrateOptionalImages();
});
