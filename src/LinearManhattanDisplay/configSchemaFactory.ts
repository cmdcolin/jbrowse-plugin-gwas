import PluginManager from "@jbrowse/core/PluginManager";
import { types } from "mobx-state-tree";
import { ConfigurationSchema } from "@jbrowse/core/configuration";

export function configSchemaFactory(pluginManager: PluginManager) {
  const LGVPlugin = pluginManager.getPlugin(
    "LinearGenomeViewPlugin",
  ) as import("@jbrowse/plugin-linear-genome-view").default;
  //@ts-ignore
  const { baseLinearDisplayConfigSchema } = LGVPlugin.exports;

  const LinearManhattanRendererConfigSchema = pluginManager.getRendererType(
    "LinearManhattanRenderer",
  ).configSchema;
  return ConfigurationSchema(
    "LinearManhattanDisplay",
    {
      autoscale: {
        type: "stringEnum",
        defaultValue: "local",
        model: types.enumeration("Autoscale type", [
          "global",
          "local",
          "globalsd",
          "localsd",
          "zscore",
        ]),
        description:
          "global/local using their min/max values or w/ standard deviations (globalsd/localsd)",
      },
      minScore: {
        type: "number",
        defaultValue: Number.MIN_VALUE,
        description: "minimum value for the y-scale",
      },
      maxScore: {
        type: "number",
        description: "maximum value for the y-scale",
        defaultValue: Number.MAX_VALUE,
      },
      numStdDev: {
        type: "number",
        description:
          "number of standard deviations to use for autoscale types globalsd or localsd",
        defaultValue: 3,
      },
      scaleType: {
        type: "stringEnum",
        model: types.enumeration("Scale type", ["linear", "log"]), // todo zscale
        description: "The type of scale to use",
        defaultValue: "linear",
      },
      inverted: {
        type: "boolean",
        description: "draw upside down",
        defaultValue: false,
      },

      defaultRendering: {
        type: "stringEnum",
        model: types.enumeration("Rendering", ["density", "xyplot", "line"]),
        defaultValue: "xyplot",
      },
      renderers: ConfigurationSchema("RenderersConfiguration", {
        LinearManhattanRenderer: LinearManhattanRendererConfigSchema,
      }),
    },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  );
}
