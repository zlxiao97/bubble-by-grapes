import { first } from "lodash";

export const show = ($dom) => {
  $dom.removeClass("hidden");
};

export const removeContextMenu = (dom = window) => {
  dom.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
};

export const getPixelCssValue = ($dom, key) =>
  first($dom.css(key).split("px"), "[0]", 0);

export const setPixelCssValue = ($dom, key, value) =>
  $dom.css(key, `${value}px`);

export const flip = ($dom, { x = false, y = false }) =>
  $dom.css(
    "transform",
    `rotateY(${y ? 180 : 0}deg) rotateX(${x ? 180 : 0}deg)`
  );

export const getRectPointsRange = (rect) => {
  return {
    x: [rect.left, rect.right],
    y: [rect.top, rect.bottom],
  };
};

export const getRectDiagonalPoints = (rect) => [
  { x: rect.left, y: rect.top },
  { x: rect.right, y: rect.bottom },
];
