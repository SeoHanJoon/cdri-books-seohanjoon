interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

/**
 * SVG 원본에서 도형이 차지하는 영역(`shape`)이 아이콘 상자(`box`) 안의 `target` 위치·크기에 오도록 하는 viewBox를 만든다.
 * 가로세로 배율이 다를 수 있으므로 `preserveAspectRatio="none"`과 함께 쓴다.
 */
export function fitViewBox(shape: Rect, box: Size, target: Rect): string {
  const scaleX = target.width / shape.width;
  const scaleY = target.height / shape.height;
  const values = [
    shape.x - target.x / scaleX,
    shape.y - target.y / scaleY,
    box.width / scaleX,
    box.height / scaleY,
  ];
  return values.map((value) => Number(value.toFixed(4))).join(' ');
}
