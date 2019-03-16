{
    class EyeDizzier {
        private static readonly SCORE_CNT = 4;
        private static readonly SCORE_THRESH = 15;
        private static readonly SCORE_K = 20;
        private nextScore = 0;
        private scores: number[] = [];
        private prevX = 0;
        private prevY = 0;
        private $eye: SVGElement;

        public constructor($eye: SVGElement) {
            this.$eye = $eye;
            setInterval(() => {
                this.tick();
            }, 1000);
        }

        private tick() {
            this.scores.push(this.nextScore);
            this.nextScore = 0;
            if (this.scores.length > EyeDizzier.SCORE_CNT) {
                this.scores = this.scores.slice(-EyeDizzier.SCORE_CNT);
            }

            const score = this.scores.reduce((a, b) => a + b, 0);
            let className = "";
            if (Math.abs(score) >= EyeDizzier.SCORE_THRESH) {
                className = (score < 0) ? "rot-anticlock" : "rot-clock";
            }
            if (this.$eye.getAttribute("class") !== className) {
                this.$eye.setAttribute("class", className);
            }
        }

        public moveTo(x: number, y: number) {
            const kxy1 = EyeDizzier.SCORE_K * Math.sqrt(EyeDizzier.SCORE_K ** 2 * (x ** 2 + y ** 2) + 1);
            const p = -Math.log(kxy1 + EyeDizzier.SCORE_K ** 2 * y);
            const q = Math.log(kxy1 + EyeDizzier.SCORE_K ** 2 * x);
            const dx = x - this.prevX;
            const dy = y - this.prevY;
            this.nextScore += p * dx + q * dy;
            this.prevX = x;
            this.prevY = y;
        }
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
        const dizzier = new EyeDizzier($eye0);
        const eyeTrack = (mx: number, my: number) => {
            const {left, top, width, height} = getOOArea();
            const dx = mx - (left + width / 2);
            const dy = my - (top + height / 2);
            const r = Math.sqrt(dx * dx + dy * dy) / width;
            moveEyes(25 * Math.atan(r * 2), Math.atan2(dy, dx));
            dizzier.moveTo(dx / width, dy / height);
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
