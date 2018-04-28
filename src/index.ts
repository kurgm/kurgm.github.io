document.addEventListener("DOMContentLoaded", () => {
  const $faceArea = document.getElementById("oo_face_area")!;
  const $eye1 = document.getElementById("eye_black_1")! as Element as SVGUseElement;
  const $eye2 = document.getElementById("eye_black_2")! as Element as SVGUseElement;
  const getOOArea = () => {
    return $faceArea.getBoundingClientRect();
  };
  const moveEyes = (r: number, theta: number) => {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta) * 1.1;
    $eye1.setAttribute("x", `${dx}`);
    $eye1.setAttribute("y", `${dy}`);
    $eye2.setAttribute("x", `${dx}`);
    $eye2.setAttribute("y", `${dy}`);
  };
  const eyeTrack = (mx: number, my: number) => {
    const {left, top, width, height} = getOOArea();
    const dx = mx - (left + width / 2);
    const dy = my - (top + height / 2);
    const r = Math.sqrt(dx * dx + dy * dy) / width;
    moveEyes(25 * Math.atan(r * 2), Math.atan2(dy, dx));
  };
  window.addEventListener("mousemove", (ev) => {
    eyeTrack(ev.clientX, ev.clientY);
  });
  window.addEventListener("touchstart", (ev) => {
    eyeTrack(ev.touches[0].clientX, ev.touches[0].clientY);
  });
  window.addEventListener("touchmove", (ev) => {
    eyeTrack(ev.touches[0].clientX, ev.touches[0].clientY);
  });
});
