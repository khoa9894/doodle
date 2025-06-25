export class Renderer implements Engine.IRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private initialized = false;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 750;
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

   
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}
