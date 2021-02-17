import DisplayType from "@jbrowse/core/pluggableElementTypes/DisplayType";

import Plugin from "@jbrowse/core/Plugin";
import PluginManager from "@jbrowse/core/PluginManager";
import ManhattanRenderer, {
  configSchemaFactory as linearManhattanRendererConfigSchemaFactory,
} from "./LinearManhattanRenderer";
import {
  configSchemaFactory as linearManhattanDisplayConfigSchemaFactory,
  stateModelFactory as linearManhattanDisplayModelFactory,
} from "./LinearManhattanDisplay";

export default class AlignmentsPlugin extends Plugin {
  name = "GWASPlugin";

  install(pluginManager: PluginManager) {
    const WigglePlugin = pluginManager.getPlugin(
      "WigglePlugin",
    ) as import("@jbrowse/plugin-wiggle").default;
    const {
      LinearWiggleDisplayReactComponent,
      XYPlotReactComponent: ReactComponent,
      //@ts-ignore
    } = WigglePlugin.exports;
    pluginManager.addDisplayType(() => {
      const configSchema = linearManhattanDisplayConfigSchemaFactory(
        pluginManager,
      );
      return new DisplayType({
        name: "LinearManhattanDisplay",
        configSchema,
        stateModel: linearManhattanDisplayModelFactory(
          pluginManager,
          configSchema,
        ),
        trackType: "FeatureTrack",
        viewType: "LinearGenomeView",
        ReactComponent: LinearWiggleDisplayReactComponent,
      });
    });
    pluginManager.addRendererType(
      () =>
        //@ts-ignore
        new ManhattanRenderer({
          name: "LinearManhattanRenderer",
          ReactComponent,
          configSchema: linearManhattanRendererConfigSchemaFactory(
            pluginManager,
          ),
        }),
    );
  }
}
