import { Component } from './Component';
import { InputHandle } from '../InputHandle/InputHandle';
import { GameObject } from '../GameObject/GameObject';

export class Button extends GameObject {
    private onClickCallback?: () => void;
    private mouseDownLastFrame: boolean = false;

    constructor(size: IVec2, pos: IVec2) {
        super(pos, { width: size.x, height: size.y }); 
    }

    public Init(): void {}

    public setOnClick(callback: () => void) {
        this.onClickCallback = callback;
    }

    private isMouseInside(mouse: IVec2): boolean {
        return (
            mouse.x >= this.position.x && mouse.x <= this.position.x + this.size.width &&
            mouse.y >= this.position.y && mouse.y <= this.position.y + this.size.height
        );
    }

    public Update(deltaTime: number): void {
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

    
}