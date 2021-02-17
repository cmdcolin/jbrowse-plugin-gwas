export { default } from "./LinearManhattanRenderer";

export function configSchemaFactory(pluginManager) {
  const { ConfigurationSchema } = pluginManager.lib[
    "@jbrowse/core/configuration"
  ];

  return ConfigurationSchema(
    "LinearManhattanRenderer",
    {
      color: {
        type: "color",
        description: "the color of the marks",
        defaultValue: "red",
      },
    },
    { explicitlyTyped: true },
  );
}
