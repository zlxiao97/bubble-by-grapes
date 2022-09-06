import $ from "jquery";
import { get } from "lodash";

export const getComponentsDom = (editor) => {
  const components = editor.getComponents().models;
  return components.map((component) => $(get(component, "view.$el[0]")));
};
