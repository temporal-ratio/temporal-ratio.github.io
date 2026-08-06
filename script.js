// Each entry is [caption, src].
// CAPTION: edit the first string to set the one-line description shown under the
// video. The values below are filename-derived placeholders — overwrite freely.
// SRC: path to the video file (spaces are URL-encoded automatically on load).
const videoGroups = {
  // In-distribution autonomous policy rollouts: training multi-task + finetuning.
  // Captions are the matching real-world training-task instructions (real-world setup appendix).
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
  renderVideoGrid("ood");
  initDatasetViewer();
  initLiberoSlider();
  initImagineLibrary();
  initVideoFacades();
  hydrateOptionalImages();
});

// ---- click-to-play video facades: poster image swaps to a playing video ----
function initVideoFacades() {
  document.querySelectorAll(".video-facade").forEach((facade) => {
    facade.addEventListener("click", () => {
      const src = facade.dataset.video;
      if (!src) return;
      const video = document.createElement("video");
      video.className = "facade-video";
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "auto";
      const source = document.createElement("source");
      source.src = encodeURI(src);
      source.type = "video/mp4";
      video.appendChild(source);
      facade.replaceWith(video);
      video.load();
      video.play().catch(() => {});
    });
  });
}

// ---- Training Dataset interactive viewer ----
// One representative clip per task (all 5x). Array order must match the on-disk
// files in ./final videos/dataset/ so indices stay stable.
const datasetTasks = [
  { cat: "folding", caption: "Fold and stack the t-shirts", file: "folding.foldingTshirtPileAndStacking.mp4" },
  { cat: "garmentManipulation", caption: "Remove the shirt from the hanger", file: "garmentManipulation.removeTheShirtFromTheHanger.mp4" },
  { cat: "garmentManipulation", caption: "Remove the t-shirt from the hanger", file: "garmentManipulation.removeTheTshirtFromTheHanger.mp4" },
  { cat: "highPrecisionAssembly", caption: "Unscrew the bottle caps", file: "highPrecisionAssembly.unscrewBottleCaps.mp4" },
  { cat: "pickAndPlace", caption: "Place the mixed dishes into the plastic bin", file: "pickAndPlace.busTablePlacingMixedDishesGlassesIntoAPlasticBin.mp4" },
  { cat: "pickAndPlace", caption: "Place the plates into the plastic bin on the countertop", file: "pickAndPlace.busTablePlacingPlatesIntoAPlasticBin.mp4" },
  { cat: "pickAndPlace", caption: "Load the bowls into the dish rack", file: "pickAndPlace.loadBowlsIntoTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Load the cups into the dish rack", file: "pickAndPlace.loadCupsIntoTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Load the mixed dishes into the dish rack", file: "pickAndPlace.loadMixedDishesIntoTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Load the plates into the dish rack", file: "pickAndPlace.loadPlatesIntoTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Place and organize the beverage onto the shelf", file: "pickAndPlace.placeOrganizeBeverageOntoShelf.mp4" },
  { cat: "pickAndPlace", caption: "Place and organize the canned foods onto the counter", file: "pickAndPlace.placeOrganizeCannedFoodsOntoCounter.mp4" },
  { cat: "pickAndPlace", caption: "Place and organize the chips bags onto the shelf", file: "pickAndPlace.placeOrganizeChipsBagsOntoShelf.mp4" },
  { cat: "pickAndPlace", caption: "Place and organize the fake fruits in the fruit bowl", file: "pickAndPlace.placeOrganizeFakeFruitsIntoFruitBowl.mp4" },
  { cat: "pickAndPlace", caption: "Place the snacks into the paper bag", file: "pickAndPlace.placeSnacksIntoPaperBag.mp4" },
  { cat: "pickAndPlace", caption: "Take the snacks out of the paper bag", file: "pickAndPlace.takeSnacksOutOfPaperBag.mp4" },
  { cat: "pickAndPlace", caption: "Throw the plastic bottles in the bin", file: "pickAndPlace.throwPlasticBottlesInBin.mp4" },
  { cat: "pickAndPlace", caption: "Turn the mug right side up", file: "pickAndPlace.turnMugRightSideUp.mp4" },
  { cat: "pickAndPlace", caption: "Unload the bowls from the dish rack", file: "pickAndPlace.unloadBowlsFromTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Unload the cups from the dish rack", file: "pickAndPlace.unloadCupsFromTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Unload the mixed dishes from the dish rack", file: "pickAndPlace.unloadMixedDishesFromTabletopDishRack.mp4" },
  { cat: "pickAndPlace", caption: "Unload the plates from the dish rack", file: "pickAndPlace.unloadPlatesFromTabletopDishRack.mp4" }
].reverse(); // dataset library shown in reversed order

const DS_CAT_LABEL = {
  pickAndPlace: "Pick & place",
  folding: "Folding",
  garmentManipulation: "Garment",
  highPrecisionAssembly: "Assembly"
};
const DS_BASE = "./final videos/dataset/";
const dsClip = (file) => encodeURI(DS_BASE + file);
const dsPoster = (file) => encodeURI(DS_BASE + "posters/" + file.replace(/\.mp4$/, ".jpg"));

function initDatasetViewer() {
  const sheet = document.getElementById("ds-sheet");
  if (!sheet) return;
  const root = sheet.closest("section");

  const spot = root.querySelector(".ds-spot-video");
  const spotName = root.querySelector(".ds-spot-name");
  const spotIndex = root.querySelector(".ds-spot-index");
  const spotDot = root.querySelector(".ds-spot-cat .ds-dot");
  const spotCatLabel = root.querySelector(".ds-spot-cat .ds-cat-label");
  const spotPlay = root.querySelector(".ds-spot-play");
  const spotFrame = root.querySelector(".ds-spot-frame");
  const progress = root.querySelector(".ds-spot-progress > span");
  const status = document.getElementById("ds-status");
  const countEl = root.querySelector(".ds-count");
  const searchInput = root.querySelector(".ds-search-input");
  const emptyEl = sheet.querySelector(".ds-empty");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const tiles = [];
  let activeIndex = 0;
  let preview = null;
  let previewTile = null;
  let hoverTimer = null;
  let searchTimer = null;
  let typeBuffer = "";
  let typeTimer = null;

  // ---- build the contact-sheet tiles once ----
  datasetTasks.forEach((item, i) => {
    const tile = document.createElement("div");
    tile.className = "ds-tile";
    tile.id = "ds-task-" + i;
    tile.dataset.index = String(i);
    tile.dataset.cat = item.cat;
    tile.tabIndex = -1;
    tile.setAttribute("role", "option");
    tile.setAttribute("aria-selected", "false");
    tile.setAttribute("aria-label", item.caption);

    const img = document.createElement("img");
    img.className = "ds-poster";
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "";
    img.src = dsPoster(item.file);
    img.addEventListener("error", () => tile.classList.add("missing"));

    const dot = document.createElement("i");
    dot.className = "ds-tile-dot";
    dot.dataset.cat = item.cat;
    dot.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "ds-tile-label";
    label.textContent = item.caption;

    const fallback = document.createElement("span");
    fallback.className = "ds-tile-fallback";
    fallback.textContent = item.caption;

    tile.append(img, dot, label, fallback);
    tile.addEventListener("click", () => setActive(i, true));
    if (finePointer && !reduced) {
      tile.addEventListener("mouseenter", () => startHover(i, tile));
      tile.addEventListener("mouseleave", () => stopHover(tile));
    }
    sheet.insertBefore(tile, emptyEl);
    tiles.push(tile);
  });

  // ---- spotlight (the only persistent decoder) ----
  function setActive(i, focusTile) {
    i = Math.max(0, Math.min(datasetTasks.length - 1, i));
    const item = datasetTasks[i];
    if (tiles[activeIndex]) {
      tiles[activeIndex].classList.remove("is-active");
      tiles[activeIndex].setAttribute("aria-selected", "false");
    }
    activeIndex = i;
    const tile = tiles[i];
    tile.classList.add("is-active");
    tile.setAttribute("aria-selected", "true");
    setTabStop(i);

    spotFrame.classList.remove("missing");
    spot.src = dsClip(item.file);
    spot.load();
    spotName.textContent = item.caption;
    spotIndex.textContent = String(i + 1).padStart(2, "0") + " / " + datasetTasks.length;
    spotDot.dataset.cat = item.cat;
    spotCatLabel.textContent = DS_CAT_LABEL[item.cat] || item.cat;
    status.textContent = "Now showing task " + (i + 1) + " of " + datasetTasks.length + ": " + item.caption;

    if (reduced) {
      togglePlayButton(true);
    } else {
      spot.play().then(() => togglePlayButton(false)).catch(() => togglePlayButton(true));
    }
    if (focusTile) tile.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }

  function togglePlayButton(show) {
    spotPlay.hidden = !show;
  }

  spot.addEventListener("timeupdate", () => {
    if (spot.duration) progress.style.width = (spot.currentTime / spot.duration) * 100 + "%";
  });
  spot.addEventListener("error", () => spotFrame.classList.add("missing"), true);
  spot.addEventListener("click", toggleSpot);
  spotPlay.addEventListener("click", toggleSpot);
  function toggleSpot() {
    if (spot.paused) {
      spot.play().then(() => togglePlayButton(false)).catch(() => {});
    } else {
      spot.pause();
      togglePlayButton(true);
    }
  }

  // ---- hover preview (single shared element; <=1 extra decoder) ----
  function startHover(i, tile) {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      stopHover(previewTile);
      if (!preview) {
        preview = document.createElement("video");
        preview.className = "ds-preview";
        preview.muted = true;
        preview.loop = true;
        preview.playsInline = true;
        preview.preload = "auto";
      }
      preview.src = dsClip(datasetTasks[i].file);
      tile.appendChild(preview);
      previewTile = tile;
      preview.play().catch(() => {});
    }, 120);
  }

  function stopHover(tile) {
    clearTimeout(hoverTimer);
    if (preview && previewTile && (!tile || previewTile === tile)) {
      preview.pause();
      preview.removeAttribute("src");
      preview.load();
      if (preview.parentNode) preview.parentNode.removeChild(preview);
      previewTile = null;
    }
  }

  // ---- roving-tabindex keyboard navigation ----
  function setTabStop(i) {
    tiles.forEach((t, k) => { t.tabIndex = k === i ? 0 : -1; });
  }

  function visibleTiles() {
    return tiles.filter((t) => !t.hidden);
  }

  function focusTile(tile) {
    setTabStop(Number(tile.dataset.index));
    tile.focus();
    tile.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }

  function columnCount() {
    const cols = getComputedStyle(sheet).gridTemplateColumns.split(" ").filter(Boolean).length;
    return Math.max(1, cols);
  }

  sheet.addEventListener("keydown", (e) => {
    const visible = visibleTiles();
    if (!visible.length) return;
    const current = document.activeElement.closest ? document.activeElement.closest(".ds-tile") : null;
    let idx = current ? visible.indexOf(current) : -1;
    const cols = columnCount();

    switch (e.key) {
      case "ArrowRight": idx = idx < 0 ? 0 : (idx + 1) % visible.length; break;
      case "ArrowLeft": idx = idx < 0 ? 0 : (idx - 1 + visible.length) % visible.length; break;
      case "ArrowDown": idx = idx < 0 ? 0 : Math.min(idx + cols, visible.length - 1); break;
      case "ArrowUp": idx = idx < 0 ? 0 : Math.max(idx - cols, 0); break;
      case "Home": idx = 0; break;
      case "End": idx = visible.length - 1; break;
      case "Enter":
      case " ":
        if (current) { e.preventDefault(); setActive(Number(current.dataset.index), true); }
        return;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const match = typeAhead(e.key, visible);
          if (match) { e.preventDefault(); focusTile(match); }
        }
        return;
    }
    e.preventDefault();
    focusTile(visible[idx]);
  });

  function typeAhead(ch, visible) {
    clearTimeout(typeTimer);
    typeBuffer += ch.toLowerCase();
    typeTimer = setTimeout(() => { typeBuffer = ""; }, 600);
    return visible.find((t) => datasetTasks[Number(t.dataset.index)].caption.toLowerCase().startsWith(typeBuffer));
  }

  // ---- live search (spotlight keeps playing through filtering) ----
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilter, 120);
  });

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    let shown = 0;
    tiles.forEach((tile, i) => {
      const match = !q || datasetTasks[i].caption.toLowerCase().includes(q);
      tile.hidden = !match;
      if (match) shown += 1;
    });
    countEl.textContent = shown === 1 ? "1 task" : shown + " tasks";
    emptyEl.hidden = shown !== 0;
    const tabTile = !tiles[activeIndex].hidden ? tiles[activeIndex] : tiles.find((t) => !t.hidden);
    if (tabTile) setTabStop(Number(tabTile.dataset.index));
  }

  // ---- boot: load the first clip without a pre-JS autoplay flash ----
  countEl.textContent = datasetTasks.length === 1 ? "1 task" : datasetTasks.length + " tasks";
  setActive(0, false);

  // auto-advance the spotlight through tasks (pauses on hover / off-screen)
  autoCycle(sheet.closest("section"), 5000, () => setActive((activeIndex + 1) % datasetTasks.length, false));
}

// ---- LIBERO OOD slider ----
// One rollout per held-out task across the spatial/goal/object OOD suites.
// Clips are successful rollouts where available (gen5 preferred, gen9 fallback);
// the four tasks with no success anywhere show a failure rollout, flagged fail.
const liberoTasks = [
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the butter on the plate", file: "spatial_t0.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the chocolate pudding on the plate", file: "spatial_t1.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the milk on the plate", file: "spatial_t2.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the orange juice on the plate", file: "spatial_t3.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the bowl on cookie box on the stove", file: "spatial_t4.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the bowl on cookie box on the cabinet", file: "spatial_t5.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the bowl next to the plate on the cabinet", file: "spatial_t6.mp4", fail: true },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the bowl next to the plate on the stove", file: "spatial_t7.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the bowl at table center on the cabinet", file: "spatial_t8.mp4" },
  { suite: "spatial", suiteLabel: "Spatial OOD", caption: "Put the bowl at table center on the stove", file: "spatial_t9.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the cream cheese in the basket", file: "goal_t0.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the orange juice on the stove", file: "goal_t1.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the bbq sauce on the plate", file: "goal_t2.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the tomato sauce on top of the cabinet", file: "goal_t3.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the wine bottle on the stove", file: "goal_t4.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the wine bottle on the plate", file: "goal_t5.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the wine bottle in the bowl", file: "goal_t6.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the cream cheese on the plate", file: "goal_t7.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the cream cheese on the stove", file: "goal_t8.mp4" },
  { suite: "goal", suiteLabel: "Goal OOD", caption: "Put the cream cheese on top of the cabinet", file: "goal_t9.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the alphabet soup and place it in the basket", file: "object_t0.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the cream cheese and place it in the basket", file: "object_t1.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the salad dressing and place it in the basket", file: "object_t2.mp4", fail: true },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the bbq sauce and place it in the basket", file: "object_t3.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the ketchup and place it in the basket", file: "object_t4.mp4", fail: true },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the tomato sauce and place it in the basket", file: "object_t5.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the butter and place it in the basket", file: "object_t6.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the milk and place it in the basket", file: "object_t7.mp4", fail: true },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the chocolate pudding and place it in the basket", file: "object_t8.mp4" },
  { suite: "object", suiteLabel: "Object OOD", caption: "Pick up the orange juice and place it in the basket", file: "object_t9.mp4" }
];

const LIB_BASE = "./final videos/libero_ood/";
const libClip = (f) => encodeURI(LIB_BASE + f);
const libPoster = (f) => encodeURI(LIB_BASE + "posters/" + f.replace(/\.mp4$/, ".jpg"));

function initLiberoSlider() {
  const track = document.getElementById("lib-track");
  if (!track) return;
  const slider = track.closest(".lib-slider");
  const prevBtn = slider.querySelector(".lib-prev");
  const nextBtn = slider.querySelector(".lib-next");
  const chips = Array.from(slider.querySelectorAll(".lib-chip"));
  const indexEl = slider.querySelector(".lib-index");
  const progressEl = slider.querySelector(".lib-progress > span");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slides = [];

  liberoTasks.forEach((it) => {
    const slide = document.createElement("div");
    slide.className = "lib-slide";
    slide.dataset.suite = it.suite;

    const wrap = document.createElement("div");
    wrap.className = "lib-video-wrap";
    const v = document.createElement("video");
    v.className = "lib-video";
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "none";
    v.poster = libPoster(it.file);
    v.dataset.src = libClip(it.file);
    v.setAttribute("aria-label", it.caption + (it.fail ? " (failure)" : ""));
    const legend = document.createElement("div");
    legend.className = "lib-legend";
    legend.textContent = "top: rollout · bottom: predicted";
    wrap.append(v, legend);

    const cap = document.createElement("div");
    cap.className = "lib-slide-cap";
    const tag = document.createElement("span");
    tag.className = "lib-suite-tag";
    tag.dataset.suite = it.suite;
    tag.textContent = it.suiteLabel;
    const name = document.createElement("span");
    name.className = "lib-name";
    name.textContent = it.caption;
    cap.append(tag, name);
    if (it.fail) {
      const x = document.createElement("span");
      x.className = "lib-fail";
      x.textContent = "✗";
      x.title = "the policy fails this task";
      cap.appendChild(x);
    }

    slide.append(wrap, cap);
    track.appendChild(slide);
    slides.push(slide);
  });

  const visible = () => slides.filter((s) => !s.hidden);

  // play every in-view card, pause the rest (caps decoders to what's on screen)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target.querySelector("video");
      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        if (!v.src) v.src = v.dataset.src;
        if (!reduced) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { root: track, threshold: [0, 0.5, 1] });
  slides.forEach((s) => io.observe(s));

  function updateChrome() {
    const max = track.scrollWidth - track.clientWidth;
    progressEl.style.width = (max > 1 ? (track.scrollLeft / max) * 100 : 100) + "%";
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= max - 2;
  }
  let ticking = false;
  track.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => { updateChrome(); ticking = false; });
  }, { passive: true });

  function page(dir) {
    track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reduced ? "auto" : "smooth" });
  }
  prevBtn.addEventListener("click", () => page(-1));
  nextBtn.addEventListener("click", () => page(1));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); page(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); page(-1); }
  });

  function setCount() {
    const n = visible().length;
    indexEl.textContent = n + (n === 1 ? " task" : " tasks");
  }

  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const suite = chip.dataset.suite;
    slides.forEach((s) => { s.hidden = suite !== "all" && s.dataset.suite !== suite; });
    track.scrollLeft = 0;
    setCount();
    updateChrome();
  }));

  setCount();
  updateChrome();

  // auto-scroll the slider one step at a time, looping (pauses on hover / off-screen)
  autoCycle(slider, 4500, () => {
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 4) return;
    if (track.scrollLeft >= max - 4) track.scrollTo({ left: 0, behavior: "smooth" });
    else page(1);
  });
}

// ---- Imagine library: spotlight + thumbnail grid of video-only rollouts ----
// Clips are self-labeling (the prompt is burned into the top bar), so no captions.
const imagineClips = ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4", "7.mp4", "8.mp4", "9.mp4", "10.mp4", "11.mp4", "12.mp4", "13.mp4", "14.mp4", "15.mp4"];
const IM_BASE = "./final videos/imagine_lib/";
const imClip = (f) => encodeURI(IM_BASE + f);
const imPoster = (f) => encodeURI(IM_BASE + "posters/" + f.replace(/\.mp4$/, ".jpg"));

function initImagineLibrary() {
  const root = document.getElementById("imagine-lib");
  if (!root) return;
  const sheet = root.querySelector(".ds-sheet");
  const spot = root.querySelector(".ds-spot-video");
  const spotIndex = root.querySelector(".ds-spot-index");
  const spotPlay = root.querySelector(".ds-spot-play");
  const spotFrame = root.querySelector(".ds-spot-frame");
  const progress = root.querySelector(".ds-spot-progress > span");
  const status = root.querySelector(".ds-status");
  const emptyEl = sheet.querySelector(".ds-empty");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const tiles = [];
  let activeIndex = 0;
  let preview = null;
  let previewTile = null;
  let hoverTimer = null;

  imagineClips.forEach((file, i) => {
    const tile = document.createElement("div");
    tile.className = "ds-tile";
    tile.id = "im-tile-" + i;
    tile.dataset.index = String(i);
    tile.tabIndex = -1;
    tile.setAttribute("role", "option");
    tile.setAttribute("aria-selected", "false");
    tile.setAttribute("aria-label", "Imagined rollout " + (i + 1));

    const img = document.createElement("img");
    img.className = "ds-poster";
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "";
    img.src = imPoster(file);
    img.addEventListener("error", () => tile.classList.add("missing"));

    const fb = document.createElement("span");
    fb.className = "ds-tile-fallback";
    fb.textContent = "Rollout " + (i + 1);

    tile.append(img, fb);
    tile.addEventListener("click", () => setActive(i, true));
    if (finePointer && !reduced) {
      tile.addEventListener("mouseenter", () => startHover(i, tile));
      tile.addEventListener("mouseleave", () => stopHover(tile));
    }
    sheet.insertBefore(tile, emptyEl);
    tiles.push(tile);
  });

  function setActive(i, focusTile) {
    i = Math.max(0, Math.min(imagineClips.length - 1, i));
    if (tiles[activeIndex]) {
      tiles[activeIndex].classList.remove("is-active");
      tiles[activeIndex].setAttribute("aria-selected", "false");
    }
    activeIndex = i;
    const tile = tiles[i];
    tile.classList.add("is-active");
    tile.setAttribute("aria-selected", "true");
    tiles.forEach((t, k) => { t.tabIndex = k === i ? 0 : -1; });
    spotFrame.classList.remove("missing");
    spot.src = imClip(imagineClips[i]);
    spot.load();
    spotIndex.textContent = String(i + 1).padStart(2, "0") + " / " + imagineClips.length;
    status.textContent = "Showing imagined rollout " + (i + 1) + " of " + imagineClips.length;
    if (reduced) {
      spotPlay.hidden = false;
    } else {
      spot.play().then(() => { spotPlay.hidden = true; }).catch(() => { spotPlay.hidden = false; });
    }
    if (focusTile) tile.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }

  spot.addEventListener("timeupdate", () => {
    if (spot.duration) progress.style.width = (spot.currentTime / spot.duration) * 100 + "%";
  });
  spot.addEventListener("error", () => spotFrame.classList.add("missing"), true);
  function toggleSpot() {
    if (spot.paused) {
      spot.play().then(() => { spotPlay.hidden = true; }).catch(() => {});
    } else {
      spot.pause();
      spotPlay.hidden = false;
    }
  }
  spot.addEventListener("click", toggleSpot);
  spotPlay.addEventListener("click", toggleSpot);

  function startHover(i, tile) {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      stopHover(previewTile);
      if (!preview) {
        preview = document.createElement("video");
        preview.className = "ds-preview";
        preview.muted = true;
        preview.loop = true;
        preview.playsInline = true;
        preview.preload = "auto";
      }
      preview.src = imClip(imagineClips[i]);
      tile.appendChild(preview);
      previewTile = tile;
      preview.play().catch(() => {});
    }, 120);
  }

  function stopHover(tile) {
    clearTimeout(hoverTimer);
    if (preview && previewTile && (!tile || previewTile === tile)) {
      preview.pause();
      preview.removeAttribute("src");
      preview.load();
      if (preview.parentNode) preview.parentNode.removeChild(preview);
      previewTile = null;
    }
  }

  sheet.addEventListener("keydown", (e) => {
    const cols = Math.max(1, getComputedStyle(sheet).gridTemplateColumns.split(" ").filter(Boolean).length);
    let i = activeIndex;
    switch (e.key) {
      case "ArrowRight": i = Math.min(activeIndex + 1, tiles.length - 1); break;
      case "ArrowLeft": i = Math.max(activeIndex - 1, 0); break;
      case "ArrowDown": i = Math.min(activeIndex + cols, tiles.length - 1); break;
      case "ArrowUp": i = Math.max(activeIndex - cols, 0); break;
      case "Home": i = 0; break;
      case "End": i = tiles.length - 1; break;
      default: return;
    }
    e.preventDefault();
    setActive(i, true);
    tiles[i].focus();
  });

  setActive(0, false);

  // auto-advance the spotlight through rollouts (pauses on hover / off-screen)
  autoCycle(root, 7000, () => setActive((activeIndex + 1) % imagineClips.length, false));
}

// Auto-cycle a gallery on a timer. Skips ticks while the user is hovering/
// focused inside it or while it is scrolled off-screen; disabled under
// prefers-reduced-motion.
function autoCycle(el, intervalMs, advanceFn) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let hovered = false;
  let visible = true;
  setInterval(() => {
    if (!hovered && visible) advanceFn();
  }, intervalMs);
  el.addEventListener("mouseenter", () => { hovered = true; });
  el.addEventListener("mouseleave", () => { hovered = false; });
  el.addEventListener("focusin", () => { hovered = true; });
  el.addEventListener("focusout", () => { hovered = false; });
  el.addEventListener("touchstart", () => { hovered = true; }, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(el);
  }
}
