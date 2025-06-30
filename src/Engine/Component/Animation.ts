import { Renderer } from "../Graphic/GraphicRender";
import { Component } from "./Component";

export class Animation extends Component  {
    private texture: HTMLImageElement;
    private frameParam: IVec2;
    private numFrame: IVec2 = {x: 1, y: 1}; // Default value
    private totalFrames: number = 1;
    private currentFrame: number = 0;
    private frameTime: number = 0;
    private clock: number = 0;

    public Init(): void {
        
    }
    
    constructor() {
        super() 
    }
    
    public setFrameTime(frameTime: number): void {
        this.frameTime = frameTime;
    }
    
    public setNumframe(numFrame: IVec2): void {
        this.numFrame = numFrame;
        this.updateFrameParams();
    }
    
    private updateFrameParams(): void {
        if (this.texture && this.numFrame) {
            this.frameParam = {
                x: Math.floor(this.texture.width / this.numFrame.x),
                y: Math.floor(this.texture.height / this.numFrame.y)
            };
            this.totalFrames = this.numFrame.x * this.numFrame.y;
           // console.log('Updated frameParam:', this.frameParam, 'totalFrames:', this.totalFrames);
        }
    }
    
    public update(deltaTime: number): void {
        if (this.frameTime > 0) {
            this.clock += deltaTime;
            if (this.clock >= this.frameTime) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.clock -= this.frameTime;
            }
        }
    }

    public render(renderer: Renderer, x: number, y: number): void {
        // Kiểm tra texture trước khi render
        if (!this.texture || !this.texture.complete || this.texture.naturalWidth === 0) {
            return; // Skip render nếu texture chưa ready
        }
        
        const fx = this.currentFrame % this.numFrame.x;
        const fy = Math.floor(this.currentFrame / this.numFrame.x);
        
        renderer.drawFrame(
            this.texture,
            fx * this.frameParam.x, fy * this.frameParam.y, this.frameParam.x, this.frameParam.y,
            x, y, this.frameParam.x, this.frameParam.y
        );
    }
    
    public setTexture(texture: HTMLImageElement): void {
      //  console.log('Setting new texture:', texture ? texture.src : 'null');
        this.texture = texture;
        this.updateFrameParams();
        this.reset();
    }
    
    public reset(): void {
        this.currentFrame = 0;
        this.clock = 0;
    }
    
    // Debug method
    public getCurrentTexture(): HTMLImageElement {
        return this.texture;
    }
}