export class Renderer implements Engine.IRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private initialized = false;

    constructor() {
                this.canvas = document.createElement('canvas');
         const w = 500 // 448
        const h = 750  // 640
        this.canvas.width  = w;
        this.canvas.height = h;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const scale = Math.min(vw / w, vh / h);
        this.canvas.style.width  = `${w * scale}px`;
        this.canvas.style.height = `${h * scale}px`;
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
        this.canvas.style.position = 'relative';
        this.canvas.style.background = '#fff'; 
       // document.body.style.background = '#000'; 
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('cudcnd');
        }
        this.ctx = ctx;
        document.body.appendChild(this.canvas);
        this.initialized = true;
    }

    public render(image: HTMLImageElement, x: number = 0, y: number = 0): void {
            if (!this.initialized) {
                this.canvas.width = Math.max(image.width, 400); 
                this.canvas.height = Math.max(image.height, 400); 
                document.body.appendChild(this.canvas);
                this.initialized = true;
            }
        //    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(image, x, y);
   }

public fillRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.restore();
}
    public drawRect(x: number, y: number, width: number, height: number): void {
        this.ctx.save();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    public drawFrame(
        image: HTMLImageElement,
        sx: number, sy: number, sw: number, sh: number,
        dx: number, dy: number, dw: number, dh: number
    ): void {
        this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    public drawText(
    text: string, 
    x: number, 
    y: number, 
    font: string = "20px Arial", 
    textAlign: CanvasTextAlign = "center", 
    color: string = "black"
): void {
    if (!this.ctx) return;
       this.ctx.save();
    
    this.ctx.font = font;
    this.ctx.textAlign = textAlign;
    this.ctx.fillStyle = color;
    
    this.ctx.fillText(text, x, y);
    
    this.ctx.restore();
}
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}
