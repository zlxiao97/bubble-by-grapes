import $ from "jquery";
import { visualSelection } from "./lib/visualSelection";
import "grapesjs/dist/css/grapes.min.css";
import "./index.css";
import { removeContextMenu, show } from "./utils/domUtils";
import { initGjs } from "./gjs";
import { getComponentsDom } from "./utils/grapes";

const bindDragEvent = (editor) => {
  const $canvasBody = $(editor.Canvas.getBody());
  const $doms = getComponentsDom(editor);
  const getSelectedDoms = () =>
    visualSelection.getSelectedDoms().map(($dom) => $dom[0]);
  let originPoint = null;
  let haveDrag = false;
  let timer = null;
  Array.from($doms).forEach(($dom) => {
    $dom.off("mouseup");
    $dom.off("click");
    $dom.off("mousedown");

    $dom.on("click", (e) => {
      const { target } = e;
      if (timer) clearTimeout(timer);
      const selectedDoms = getSelectedDoms();
      timer = setTimeout(() => {
        if (haveDrag && !selectedDoms.includes(target)) {
          selectedDoms.forEach((dom) => {
            if (dom !== target) editor.selectRemove();
          });
          haveDrag = false;
          console.log("component: removeSelect");
        }
      }, 1000);
    });
    $dom.on("mousedown", (e) => {
      const { target, clientX, clientY } = e;
      const selected = getSelectedDoms().filter((dom) => dom !== target);
      if (selected.length) {
        originPoint = {
          x: clientX,
          y: clientY,
        };
        console.log("component:mousedown", originPoint, selected);
      }
    });
    $dom.on("mousemove", (e) => {
      if (originPoint) {
        haveDrag = true;
        const { clientX, clientY } = e;
        console.log("component:mousemove", originPoint, clientX, clientY);
      }
    });
  });
  $canvasBody.on("mouseup", (e) => {
    if (originPoint) {
      originPoint = null;

      getSelectedDoms().forEach((dom) => {
        editor.selectRemove(dom);
      });
      console.log("component:mouseup");
    }
  });
};

$(() => {
  // const $main = $(".container");
  const $container = $("#gjs");
  show($container);
  const editor = initGjs($container);
  removeContextMenu(window);

  editor.on("load", () => {
    visualSelection.init(editor);
    bindDragEvent(editor);
  });
});
