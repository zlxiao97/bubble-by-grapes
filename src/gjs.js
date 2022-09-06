import grapesjs from "grapesjs";

export const initGjs = ($container) => {
  const editor = grapesjs.init({
    container: $container[0],
    fromElement: true,
    height: "1185px",
    width: "1080px",
    storageManager: false,
    showToolbar: false,
    panels: { defaults: [] },
    canvasCss: `[data-gjs-type="text"] {
      cursor: move;
    }
    `,
  });
  editor.setDragMode("translate");
  return editor;
};
