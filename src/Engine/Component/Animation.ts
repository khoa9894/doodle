import { Renderer } from "../Graphic/GraphicRender";
import { Component } from "./Component";


export class Animation extends Component  {
    private texture: HTMLImageElement;
    private frameParam: IVec2;
    private numFrame: IVec2;
    private totalFrames: number;
    private currentFrame: number = 0;
    private frameTime: number;
    private clock: number = 0;

    public Init(): void {
        
    }
    constructor(texture: HTMLImageElement, numFrame: IVec2, frameTime: number) {
        super()
        this.texture = texture;
        this.numFrame = numFrame;
        this.frameTime = frameTime;
        this.frameParam = {
            x: Math.floor(texture.width / numFrame.x),
            y: Math.floor(texture.height / numFrame.y)
        };
        this.totalFrames = numFrame.x * numFrame.y;
    }

    public update(deltaTime: number) {
        this.clock += deltaTime;
        if (this.clock >= this.frameTime) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.clock -= this.frameTime;
        }
    }

    public render(renderer: Renderer, x: number, y: number) {
        const fx = this.currentFrame % this.numFrame.x;
        const fy = Math.floor(this.currentFrame / this.numFrame.x);
        renderer.drawFrame(
            this.texture,
            fx * this.frameParam.x, fy * this.frameParam.y, this.frameParam.x, this.frameParam.y,
            x, y, this.frameParam.x, this.frameParam.y
        );
    }
    public setTexture(texture: HTMLImageElement): void{
        this.texture=texture;
    }
    public reset() {
        this.currentFrame = 0;
        this.clock = 0;
    }
}