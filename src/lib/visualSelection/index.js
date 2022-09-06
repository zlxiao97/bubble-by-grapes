import $ from "jquery";
import {
  flip,
  getPixelCssValue,
  getRectDiagonalPoints,
  getRectPointsRange,
  removeContextMenu,
  setPixelCssValue,
} from "@/utils/domUtils";
import { isInBound } from "@/utils/utils";
import { SELECTION_BORDER_WIDTH, SELECTION_BOUND_MARGIN } from "@/meta/const";
import { getComponentsDom } from "@/utils/grapes";

class VisualSelection {
  constructor() {
    this.editor = null;
    this.canvas = null;
    this.canvasDom = null;
    this.$canvasBody = null;
    this.$canvasWrapper = null;
    this.$selectBox = null;
    this.$selectedDoms = null;
  }
  init(editor) {
    this.editor = editor;
    this._setup();

    this.$canvasBody.on("mousedown", this.mousedown.bind(this));
    this.$canvasBody.on("mousemove", this.mousemove.bind(this));
    this.$canvasBody.on("mouseup", this.mouseup.bind(this));
    return this.$selectBox;
  }
  getSelectedDoms() {
    return this.$selectedDoms || [];
  }
  mousedown(e) {
    // 右键
    if (e.buttons === 2) {
      this._removeSelected();
      if (!this.canvas.hasFocus()) this._focusCanvas();
      this._startSelect(e);
    }
  }
  mousemove(e) {
    if (this.$selectBox) {
      this._drawVisualBoxTemp(e);
      this._selectComponents(e);
      if (!isInBound({ x: e.clientX, y: e.clientY }, this._getBound())) {
        this._endSelect();
        console.log("bound: end");
      }
    }
  }
  mouseup() {
    if (this.$selectBox) {
      this._endSelect();
      console.log("mouseup: end");
    }
  }
  _setup() {
    this.canvas = this.editor.Canvas;
    this.canvasDom = this.canvas.getDocument();
    this.$canvasBody = $("body", this.canvasDom);
    this.$canvasWrapper = $(`div[data-gjs-type="wrapper"]`, this.canvasDom);
    this.$canvasBody.css("position", "relative"); // Set draggable element's parent
    removeContextMenu(this.canvasDom);
  }
  _removeSelected() {
    const selected = this.editor.getSelectedAll();
    Array.from(selected).forEach((component) =>
      this.editor.selectRemove(component)
    );
  }
  _focusCanvas() {
    this.$canvasWrapper[0]?.click();
  }
  _startSelect(e) {
    this.$selectBox = $(this._getVisualBoxTemp({ x: e.clientX, y: e.clientY }));
    this.$selectBox.appendTo(this.$canvasBody);
    console.log("start");
  }
  _getVisualBoxTemp({ x, y }) {
    return `<div style="position: absolute; border: ${SELECTION_BORDER_WIDTH}px solid blue; left: ${x}px; top: ${y}px; transform-origin: top left;"></div>`;
  }
  _drawVisualBoxTemp(e) {
    const { clientX, clientY } = e;
    const baseX = getPixelCssValue(this.$selectBox, "left");
    const baseY = getPixelCssValue(this.$selectBox, "top");
    const boxWidth = Math.abs(clientX - baseX);
    const boxHeight = Math.abs(clientY - baseY);
    setPixelCssValue(this.$selectBox, "width", boxWidth);
    setPixelCssValue(this.$selectBox, "height", boxHeight);
    if (clientX - baseX < 0 && clientY - baseY < 0) {
      flip(this.$selectBox, { x: true, y: true });
    } else if (clientY - baseY < 0) {
      flip(this.$selectBox, { x: true, y: false });
    } else if (clientX - baseX < 0) {
      flip(this.$selectBox, { x: false, y: true });
    } else {
      flip(this.$selectBox, { x: false, y: false });
    }
  }
  _getBound() {
    const boundXMin = SELECTION_BOUND_MARGIN;
    const boundXMax =
      this.$canvasBody.prop("clientWidth") -
      SELECTION_BORDER_WIDTH -
      SELECTION_BOUND_MARGIN;
    const boundYMin = SELECTION_BOUND_MARGIN;
    const boundYMax =
      this.$canvasBody.prop("clientHeight") -
      SELECTION_BORDER_WIDTH -
      SELECTION_BOUND_MARGIN;
    return {
      x: [boundXMin, boundXMax],
      y: [boundYMin, boundYMax],
    };
  }
  _endSelect() {
    if (this.$selectBox) {
      this.$selectBox.remove();
      this.$selectBox = null;
    }
  }
  _selectComponents(e) {
    this._removeSelected();
    const $doms = getComponentsDom(this.editor);
    const boxRect = this.$selectBox[0].getBoundingClientRect();
    const boxRange = getRectPointsRange(boxRect);
    this.$selectedDoms = $doms.filter(($dom) => {
      const dom = $dom[0];
      const rect = dom.getBoundingClientRect();
      const points = getRectDiagonalPoints(rect);
      return points.every((point) => isInBound(point, boxRange));
    });
    this.$selectedDoms.forEach(($dom) => {
      this.editor.selectAdd($dom[0]);
    });
  }
}

export const visualSelection = new VisualSelection();
