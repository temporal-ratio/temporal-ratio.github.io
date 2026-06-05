// Each entry is [caption, src].
// CAPTION: edit the first string to set the one-line description shown under the
// video. The values below are filename-derived placeholders — overwrite freely.
// SRC: path to the video file (spaces are URL-encoded automatically on load).
const videoGroups = {
  // In-distribution demonstrations: training multi-task + finetuning.
  // Captions are the matching PP24 training-task instructions (real-world setup appendix).
  id: [
    ["Place plates into a plastic bin", "./final videos/training multi-task/plates_into_bin.mp4"],
    ["Throw plastic bottles into a bin", "./final videos/training multi-task/bottles_into_bin.mp4"],
    ["Place snacks into a paper bag", "./final videos/training multi-task/chips_into_paper_bag.mp4"],
    ["Place and organize chip bags on a shelf", "./final videos/training multi-task/chips_on_shelf.mp4"],
    ["Unload mixed dishes from a tabletop dish rack", "./final videos/training multi-task/dishes_out_of_drying_rack.mp4"],
    ["Take the bottle out of the paper bag", "./final videos/training multi-task/bottle_out_of_paper_bag.mp4"],
    ["Unscrew bottle caps (Finetuned)", "./final videos/finetuning/bottle_unscrewing.mp4"],
    ["Fold a pile of t-shirts and stack them (Finetuned, 30&times;)", "./final videos/finetuning/folding.mp4"]
  ],
  // Video-model-only rollouts (imagined futures, no action execution).
  imagine: [
    ["Same scene, different prompt 1", "./final videos/imagine/1.mp4"],
    ["Same scene, different prompt 2", "./final videos/imagine/2.mp4"]
  ],
  // Out-of-distribution / compositional generalization.
  // Captions are the eight real-world compositional evaluation tasks (Tasks 1-8).
  // bbin = "throw away into the bin", bin = "place into the bin".
  ood: [
    ["Throw away the fruits into the bin", "./final videos/generalization/fruits-bbin.mp4"],
    ["Place the fruits into the paper bag", "./final videos/generalization/fruits-paper.mp4"],
    ["Throw away the plastic bottle into the bin (seen prompt)", "./final videos/generalization/bottle-bbin.mp4"],
    ["Place plastic bottle into the paper bag", "./final videos/generalization/bottle-paper.mp4"],
    ["Place snacks into the paper bag (seen prompt)", "./final videos/generalization/chips-paper.mp4"],
    ["Throw away the snacks into the bin", "./final videos/generalization/chips-bbin.mp4"],
    ["Arrange snacks on the shelf (seen prompt)", "./final videos/generalization/chip-shelf.mp4"],
    ["Place snacks into the bin", "./final videos/generalization/chips-bin.mp4"]
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
