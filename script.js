// Each entry is [caption, src].
// CAPTION: edit the first string to set the one-line description shown under the
// video. The values below are filename-derived placeholders — overwrite freely.
// SRC: path to the video file (spaces are URL-encoded automatically on load).
const videoGroups = {
  // In-distribution demonstrations: training multi-task + finetuning.
  id: [
    ["Plates into bin", "./final videos/training multi-task/plates_into_bin.mp4"],
    ["Bottles into bin", "./final videos/training multi-task/bottles_into_bin.mp4"],
    ["Chips into paper bag", "./final videos/training multi-task/chips_into_paper_bag.mp4"],
    ["Chips on shelf", "./final videos/training multi-task/chips_on_shelf.mp4"],
    ["Dishes out of drying rack", "./final videos/training multi-task/dishes_out_of_drying_rack.mp4"],
    ["Bottle out of paper bag", "./final videos/training multi-task/bottle_out_of_paper_bag.mp4"],
    ["Bottle unscrewing", "./final videos/finetuning/bottle_unscrewing.mp4"],
    ["Folding", "./final videos/finetuning/folding.mp4"]
  ],
  // Video-model-only rollouts (imagined futures, no action execution).
  imagine: [
    ["Imagined rollout 1", "./final videos/imagine/1.mp4"],
    ["Imagined rollout 2", "./final videos/imagine/2.mp4"]
  ],
  // Out-of-distribution / compositional generalization.
  ood: [
    ["Bottle to bbin", "./final videos/generalization/bottle-bbin.mp4"],
    ["Bottle to paper bag", "./final videos/generalization/bottle-paper.mp4"],
    ["Chip to shelf", "./final videos/generalization/chip-shelf.mp4"],
    ["Chips to bbin", "./final videos/generalization/chips-bbin.mp4"],
    ["Chips to bin", "./final videos/generalization/chips-bin.mp4"],
    ["Chips to paper bag", "./final videos/generalization/chips-paper.mp4"],
    ["Fruits to bbin", "./final videos/generalization/fruits-bbin.mp4"],
    ["Fruits to paper bag", "./final videos/generalization/fruits-paper.mp4"]
  ],
  // Video-action disagreement example (single clip — to be supplied).
  disagreement: [
    ["Video-action disagreement example", "./materials/videos/video_action_disagreement.mp4"]
  ]
};

function makeVideoCard(caption, src) {
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
  source.src = encodeURI(src);
  source.type = "video/mp4";
  video.appendChild(source);

  const fallback = document.createElement("div");
  fallback.className = "video-fallback";
  fallback.innerHTML = `<strong>${caption}</strong><span>Drop video at<br>${src.replace("./", "")}</span>`;

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
  meta.innerHTML = `<h3>${caption}</h3>`;

  card.appendChild(frame);
  card.appendChild(meta);
  video.load();

  return card;
}

function renderVideoGrid(groupName) {
  const mount = document.querySelector(`[data-grid="${groupName}"]`);
  if (!mount) return;
  videoGroups[groupName].forEach(([caption, src]) => {
    mount.appendChild(makeVideoCard(caption, src));
  });
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
  renderVideoGrid("imagine");
  renderVideoGrid("ood");
  renderVideoGrid("disagreement");
  hydrateOptionalImages();
});
