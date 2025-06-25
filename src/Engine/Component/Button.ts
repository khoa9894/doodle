import { Component } from './Component';
import { InputHandle } from '../InputHandle/InputHandle';

export class Button extends Component {
    private size: IVec2;
    private pos: IVec2;
    private onClickCallback?: () => void;
    private mouseDownLastFrame: boolean = false;

    constructor(size: IVec2, pos: IVec2) {
        super();
        this.size = size;
        this.pos = pos;
    }

    public Init(): void {
    }

    public setOnClick(callback: () => void) {
        this.onClickCallback = callback;
    }

    private isMouseInside(mouse: IVec2): boolean {
        return (
            mouse.x >= this.pos.x && mouse.x <= this.pos.x + this.size.x &&
            mouse.y >= this.pos.y && mouse.y <= this.pos.y + this.size.y
        );
    }

    public update(deltaTime: number): void {
        const mouse = InputHandle.getMouse();
        const mouseDown = InputHandle.isMouseDown();
        if (mouse && mouseDown && !this.mouseDownLastFrame && this.isMouseInside(mouse)) {
            if (this.onClickCallback) this.onClickCallback();
        }
        this.mouseDownLastFrame = !!mouseDown;
    }

    public handleMouseDown(mouse: IVec2): void {
        if (this.isMouseInside(mouse) && this.onClickCallback) {
            this.onClickCallback();
        }
    }

    public render(renderer: Engine.IRenderer, x: number = this.pos.x, y: number = this.pos.y): void {
            //renderer.drawRect(x, y, this.size.x, this.size.y); 
    }
}