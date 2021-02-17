import PluginManager from "@jbrowse/core/PluginManager";

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin(
    "WigglePlugin",
  ) as import("@jbrowse/plugin-wiggle").default;
  const {
    utils: { getScale },
    WiggleBaseRenderer,
    //@ts-ignore
  } = WigglePlugin.exports;

  const { featureSpanPx } = pluginManager.lib["@jbrowse/core/util"];

  return class ManhattanPlotRenderer extends WiggleBaseRenderer {
    draw(ctx: CanvasRenderingContext2D, props: any) {
      const { features, regions, bpPerPx, scaleOpts, height } = props;
      const [region] = regions;
      const opts = { ...scaleOpts, range: [0, height] };

      const viewScale = getScale(opts);
      const toY = (rawscore: number, curr = 0) =>
        height - viewScale(rawscore) - curr;

      ctx.fillStyle = "darkblue";
      for (const feature of features.values()) {
        const [leftPx] = featureSpanPx(feature, region, bpPerPx);
        const score = feature.get("score") as number;
        ctx.beginPath();
        ctx.arc(leftPx, toY(score), 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };
}
