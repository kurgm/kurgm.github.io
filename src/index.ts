{
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
    }
    document.addEventListener("DOMContentLoaded", () => {
        const $faceArea = document.getElementById("oo_face_area")!;
        const $eye1 = document.getElementById("eye_black_1")! as Element as SVGUseElement;
        const $eye2 = document.getElementById("eye_black_2")! as Element as SVGUseElement;
        const getOOArea = () => $faceArea.getBoundingClientRect();
        const moveEyes = (r: number, theta: number) => {
            const dx = r * Math.cos(theta);
            const dy = r * Math.sin(theta) * 1.1;
            $eye1.setAttribute("x", `${dx}`);
            $eye1.setAttribute("y", `${dy}`);
            $eye2.setAttribute("x", `${dx}`);
            $eye2.setAttribute("y", `${dy}`);
        };
        const $eye0 = document.getElementById("eye_black")! as Element as SVGElement;
        const dizzyTrack = makeDizzyTrack((sign) => {
            const className = sign === 0 ? "" : sign > 0 ? "rot-clock" : "rot-anticlock";
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
    });
}
