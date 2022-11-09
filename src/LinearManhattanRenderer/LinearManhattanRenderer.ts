import PluginManager from "@jbrowse/core/PluginManager";
import { readConfObject } from "@jbrowse/core/configuration";
import { featureSpanPx } from "@jbrowse/core/util";

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin(
    "WigglePlugin",
  ) as import("@jbrowse/plugin-wiggle").default;
  const {
    utils: { getScale },
    WiggleBaseRenderer,
    //@ts-ignore
  } = WigglePlugin.exports;

  return class ManhattanPlotRenderer extends WiggleBaseRenderer {
    draw(ctx: CanvasRenderingContext2D, props: any) {
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
        // @ts-ignore
        ctx.fillStyle = readConfObject(config, "color", { feature });
        ctx.beginPath();
        ctx.arc(leftPx, toY(score), 2, 0, 2 * Math.PI);
        ctx.fill();
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
    }
  };
}
