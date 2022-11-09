import { ConfigurationSchema } from "@jbrowse/core/configuration";
export { default } from "./LinearManhattanRenderer";

export const configSchema = ConfigurationSchema(
  "LinearManhattanRenderer",
  {
    color: {
      type: "color",
      description: "the color of the marks",
      defaultValue: "darkblue",
      contextVariable: ["feature"],
    },
  },
  { explicitlyTyped: true },
);
