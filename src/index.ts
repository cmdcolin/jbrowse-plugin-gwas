import Plugin from "@jbrowse/core/Plugin";
import PluginManager from "@jbrowse/core/PluginManager";
import DisplayType from "@jbrowse/core/pluggableElementTypes/DisplayType";
import rendererFactory, {
  configSchema as rendererConfigSchema,
} from "./LinearManhattanRenderer";
import {
  configSchemaFactory as displayConfigSchemaFactory,
  stateModelFactory as displayModelFactory,
} from "./LinearManhattanDisplay";

export default class AlignmentsPlugin extends Plugin {
  name = "GWASPlugin";

  install(pluginManager: PluginManager) {
    const WigglePlugin = pluginManager.getPlugin(
      "WigglePlugin",
    ) as import("@jbrowse/plugin-wiggle").default;

    const {
      LinearWiggleDisplayReactComponent,
      XYPlotRendererReactComponent,
      //@ts-ignore
    } = WigglePlugin.exports;

    pluginManager.addDisplayType(() => {
      const configSchema = displayConfigSchemaFactory(pluginManager);
      return new DisplayType({
        name: "LinearManhattanDisplay",
        configSchema,
        stateModel: displayModelFactory(pluginManager, configSchema),
        trackType: "FeatureTrack",
        viewType: "LinearGenomeView",
        ReactComponent: LinearWiggleDisplayReactComponent,
      });
    });

    pluginManager.addRendererType(() => {
      //@ts-ignore
      const ManhattanRenderer = new rendererFactory(pluginManager);
      const configSchema = rendererConfigSchema;
      return new ManhattanRenderer({
        name: "LinearManhattanRenderer",
        ReactComponent: XYPlotRendererReactComponent,
        configSchema,
        pluginManager,
      });
    });
  }
}
