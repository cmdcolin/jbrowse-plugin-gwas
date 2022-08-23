export { default } from "./LinearManhattanRenderer";
import { ConfigurationSchema } from "@jbrowse/core/configuration";

export const configSchema = ConfigurationSchema(
  "LinearManhattanRenderer",
  {
    color: {
      type: "color",
      description: "the color of the marks",
      defaultValue: "darkblue",
    },
  },
  { explicitlyTyped: true },
);
