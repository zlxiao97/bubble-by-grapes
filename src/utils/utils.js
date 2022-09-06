import { get } from "lodash";

export const isInBound = (
  point = { x: 0, y: 0 },
  rect = { x: [0, 0], y: [0, 0] }
) => {
  const x = get(point, "x", 0);
  const y = get(point, "y", 0);
  const boundXMin = get(rect, "x[0]", 0);
  const boundXMax = get(rect, "x[1]", 0);
  const boundYMin = get(rect, "y[0]", 0);
  const boundYMax = get(rect, "y[1]", 0);
  return x > boundXMin && x < boundXMax && y > boundYMin && y < boundYMax;
};
