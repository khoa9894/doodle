import { Component } from './Component';
import { InputHandle } from '../InputHandle/InputHandle';
import { GameObject } from '../GameObject/GameObject';

export class Button extends GameObject {
    private onClickCallback?: () => void;
    private wasMouseDownLastFrame: boolean = false;
    private cooldownTimer: number = 0;
    private isPressed: boolean = false;

    constructor(size: IVec2, pos: IVec2) {
        super(pos, { width: size.x, height: size.y }); 
    }

    public Init(): void {}

    public setOnClick(callback: () => void) {
        this.onClickCallback = callback;
    }
    
    public resetState(): void {
        this.wasMouseDownLastFrame = false;
        this.isPressed = false;
       // this.cooldownTimer = 0.2; 
    }
    
    private isMouseInside(mouse: IVec2): boolean {
        return (
            mouse.x >= this.position.x && 
            mouse.x <= this.position.x + this.size.width &&
            mouse.y >= this.position.y && 
            mouse.y <= this.position.y + this.size.height
        );
    }

    public Update(deltaTime: number): void {
        // Giảm cooldown timer
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
        
        const mouse = InputHandle.getMouse();
        const isMouseDown = InputHandle.isMouseDown();
        const mouseInside = this.isMouseInside(mouse);
        
        const isClicked = !this.wasMouseDownLastFrame && 
                         isMouseDown && 
                         mouseInside && 
                         this.cooldownTimer <= 0;
        
        if (isClicked && this.onClickCallback) {
            this.onClickCallback();
            this.cooldownTimer = 0.2; // Set cooldown after click
        }
        
        // Update state for next frame
        this.wasMouseDownLastFrame = isMouseDown;
        this.isPressed = isMouseDown && mouseInside;
    }

    public isButtonPressed(): boolean {
        return this.isPressed;
    }
}