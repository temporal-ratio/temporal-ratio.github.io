Most page videos are served directly from the `final videos/` folder:

- In-distribution demos: `final videos/training multi-task/*.mp4` + `final videos/finetuning/*.mp4`
- Video-model-only rollouts: `final videos/imagine/*.mp4`
- OOD / compositional generalization: `final videos/generalization/*.mp4`
- Hero (supplementary) video: `final videos/supplementary.mp4`

One clip is still expected in this folder:

- `video_action_disagreement.mp4` — the single video shown in the "Video-Action
  Disagreement" section (next to `materials/figures/video_action_agreement.png`).
  The page shows a "Drop video at ..." placeholder until this file is added.

Captions for every clip are the first string of each entry in `script.js` (the
`videoGroups` object) and can be edited freely.
