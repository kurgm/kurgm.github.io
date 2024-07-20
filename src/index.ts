document.addEventListener("DOMContentLoaded", () => {
  const makeDizzyTrack = (callback: (sign: -1 | 0 | 1) => void) => {
    const SCORE_CNT = 4;
    const SCORE_THRESH = 11;
    const SCORE_K = 20;

    let nextScore = 0;
    const scores: number[] = [];
    let prevX = 0;
    let prevY = 0;

    const tick = () => {
      scores.push(nextScore);
      nextScore = 0;
      while (scores.length > SCORE_CNT) {
        scores.shift();
      }

      const score = scores.reduce((a, b) => a + b, 0);
      if (Math.abs(score) >= SCORE_THRESH) {
        callback(score > 0 ? 1 : -1);
      } else {
        callback(0);
      }
    };
    setInterval(tick, 750);

    return (x: number, y: number) => {
      const kxy1 = SCORE_K * Math.sqrt(SCORE_K ** 2 * (x ** 2 + y ** 2) + 1);
      const p = -Math.log(kxy1 + SCORE_K ** 2 * y);
      const q = Math.log(kxy1 + SCORE_K ** 2 * x);
      const dx = x - prevX;
      const dy = y - prevY;
      nextScore += p * dx + q * dy;
      prevX = x;
      prevY = y;
    };
  };

  const $faceArea = document.getElementById("oo_face_area")!;
  const getOOArea = () => $faceArea.getBoundingClientRect();

  const $oo = document.getElementById("oo")! as Element as SVGSVGElement;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const $eye1 = $oo.getElementById("eye_black_1")! as SVGUseElement;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const $eye2 = $oo.getElementById("eye_black_2")! as SVGUseElement;
  const moveEyes = (r: number, theta: number) => {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta) * 1.1;
    $eye1.setAttribute("x", `${dx}`);
    $eye1.setAttribute("y", `${dy}`);
    $eye2.setAttribute("x", `${dx}`);
    $eye2.setAttribute("y", `${dy}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const $eye0 = $oo.getElementById("eye_black")! as SVGElement;
  const dizzyTrack = makeDizzyTrack((sign) => {
    const className =
      sign === 0 ? "" : sign > 0 ? "rot-clock" : "rot-anticlock";
    if ($eye0.getAttribute("class") !== className) {
      $eye0.setAttribute("class", className);
    }
  });

  const eyeTrack = (mx: number, my: number) => {
    const { left, top, width, height } = getOOArea();
    const dx = mx - (left + width / 2);
    const dy = my - (top + height / 2);
    const r = Math.sqrt(dx * dx + dy * dy) / width;
    moveEyes(25 * Math.atan(r * 2), Math.atan2(dy, dx));
    dizzyTrack(dx / width, dy / height);
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

  const $ooArea = document.getElementsByClassName("oo-area")[0];
  const $fullscreenButton = document.getElementById("btn_fullscreen")!;
  if (document.fullscreenEnabled) {
    $fullscreenButton.addEventListener("click", () => {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
      }
      void $ooArea.requestFullscreen();
    });
  } else {
    $fullscreenButton.style.display = "none";
  }
});
