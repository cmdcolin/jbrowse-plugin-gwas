import PluginManager from "@jbrowse/core/PluginManager";
import { readConfObject } from "@jbrowse/core/configuration";
import { featureSpanPx } from "@jbrowse/core/util";

function drawBranch(
  ctx: CanvasRenderingContext2D,
  branchLength: number,
  direction: number,
) {
  ctx.save();
  ctx.rotate((direction * Math.PI) / 3);
  ctx.moveTo(0, 0);
  ctx.lineTo(branchLength, 0);
  ctx.stroke();
  ctx.restore();
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  segmentLength: number,
  branchLength: number,
) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(segmentLength, 0);
  ctx.stroke();
  ctx.translate(segmentLength, 0);
  if (branchLength > 0) {
    drawBranch(ctx, branchLength, 1);
    drawBranch(ctx, branchLength, -1);
  }
}

function drawSnowflake(ctx: CanvasRenderingContext2D, width = 5, height = 5) {
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.strokeStyle = "blue";
  ctx.translate(width / 2, height / 2);
  for (var count = 0; count < 6; count++) {
    ctx.save();
    drawSegment(ctx, 2, 0.5);
    drawSegment(ctx, 2, 1);
    drawSegment(ctx, 2, 0);
    ctx.restore();
    ctx.rotate(Math.PI / 3);
  }
}

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin(
    "WigglePlugin",
  ) as import("@jbrowse/plugin-wiggle").default;
  const {
    utils: { getScale },
    WiggleBaseRenderer,
  } = WigglePlugin.exports;

  return class ManhattanPlotRenderer extends WiggleBaseRenderer {
    async draw(ctx: CanvasRenderingContext2D, props: any) {
      const {
        features,
        regions,
        bpPerPx,
        config,
        scaleOpts,
        height: unadjustedHeight,
        displayCrossHatches,
        ticks: { values },
      } = props;
      const [region] = regions;
      const YSCALEBAR_LABEL_OFFSET = 5;
      const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2;
      const opts = { ...scaleOpts, range: [0, height] };
      const width = (region.end - region.start) / bpPerPx;

      const scale = getScale(opts);
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET;

      for (const feature of features.values()) {
        const [leftPx] = featureSpanPx(feature, region, bpPerPx);
        const score = feature.get("score") as number;
        ctx.fillStyle = readConfObject(config, "color", { feature });
        ctx.save();
        ctx.translate(leftPx, toY(score));
        drawSnowflake(ctx);
        ctx.restore();
      }

      if (displayCrossHatches) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(200,200,200,0.8)";
        values.forEach((tick: number) => {
          ctx.beginPath();
          ctx.moveTo(0, Math.round(toY(tick)));
          ctx.lineTo(width, Math.round(toY(tick)));
          ctx.stroke();
        });
      }
      return undefined;
    }
  };
}
