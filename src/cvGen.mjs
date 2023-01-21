/* © 2022 - Ian Sayer */
let scopeX = 0;
let scopeY = 0;
let ctx = undefined;
let framesPerSecond = 120;
const clamp1 = (n) => Math.min(Math.max(n,-1), 1);

let taylorSin = x => x - ((x*x*x)/6) + ((x*x*x*x*x)/120);
let expo = x => x==0?0: Math.pow(2, 10 * Math.abs(x) - 10);

export let Lfo = class {
    constructor(wave) {
        this.wave = wave;
        this.phase = 0;
        this.slope = 1;
        this.inc = 0;
        this.cv = 0;
        this.f = 0.125; // 4Hz
        this.setFrequency(this.f);
    }
    setFrequency(hz) {
        this.f = hz;
        let period = 1000/hz;
        this.inc = 1.0/(period/framesPerSecond);
    }
    tic(){
        let nextcv = this.cv += (this.inc * this.slope);
        this.cv = clamp1(nextcv);
        if (this.cv != nextcv) {
            this.slope *= -1.0; // overflow, change direction
        }
    }
}

const lfo1 = new Lfo(0);

/**
 * setup for osciliscope function id required
 */
export function scopeInit(){
    if (!ctx){
        let canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 400;
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#EEF";
        ctx.beginPath();
    }
}
function xscopeLoop(){
    if (ctx){
        ctx.globalAlpha = scopeX?0.0125:1.0;
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FFF";
        let cv = taylorSin(lfo1.cv*1.57);
        // let cv = expo((lfo1.cv+1.0)/2);
        // let cv = expo(lfo1.cv);
        scopeY = (cv + 1.0) * 50 + 25;
        let scopeZ = Math.sign(lfo1.cv) * 50 + 275;
        let scopeW = Math.sign(lfo1.slope) * 50 + 120;

        ctx.fillRect(scopeX,scopeY,1,2);
        ctx.fillRect(scopeX,scopeZ,2,2);
        ctx.fillRect(scopeX,scopeW,2,2);

        lfo1.tic();
        scopeX++;
        scopeX &= 0x3ff;
    }
    requestAnimationFrame(scopeLoop);
}
function scopeLoop(){
    if (ctx){
        ctx.globalAlpha = scopeX?0.0175:1.0;
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFE";
        let cv = taylorSin(lfo1.cv*1.57);
        scopeY = (cv + 1.0) * 50 + 25;
        let subp = scopeX % 4;
        if (scopeX==0)
            ctx.moveTo(scopeX, scopeY);
        else {
            ctx.lineTo(scopeX, scopeY);
            if ((scopeX%4)==0){
                ctx.stroke();
                ctx.beginPath();
            }
            else{
            }
        }
        lfo1.tic();
        scopeX++;
        scopeX &= 0x3ff;
    }
    requestAnimationFrame(scopeLoop);
}

scopeLoop();
