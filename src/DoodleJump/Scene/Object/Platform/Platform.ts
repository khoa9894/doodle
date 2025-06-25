import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';

export abstract class Platform extends GameObject {
    protected isActive: boolean;
    protected jumpForce: number;
    
    constructor(x: number, y: number, jumpForce: number = -500) {
        super({ x, y }, { width: 90, height: 15 });
        this.isActive = true;
        this.jumpForce = jumpForce;
        this.initializePlatform();
    }
    
    protected abstract getTextureName(): string;
    
    private initializePlatform(): void {
        const textureName = this.getTextureName();
        this.AddImage(ResourceManager.getInstance().getTexture(textureName));
    }
    
    public Update(deltaTime: number): void {
        if (!this.isActive) return;
        this.updatePlatformSpecific(deltaTime);
        super.Update(deltaTime);
    }
    
    protected updatePlatformSpecific(deltaTime: number): void {
    }
    
    public onPlayerLand(player?: GameObject): number {
        this.handlePlayerLanding();
        return this.jumpForce;
    }
    
    protected handlePlayerLanding(): void {
    }
    
    public resetPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.isActive = true;
        this.hitbox.setPosition(this.position);
        this.onReset();
    }
    
    protected onReset(): void {
    }
    
    public setRandomPosition(minY: number, maxY: number): void {
        const newX = Math.random() * (400 - this.size.width);
        const newY = minY + Math.random() * (maxY - minY);
        this.resetPosition(newX, newY);
    }
    
    public get isActivePlatform(): boolean {
        return this.isActive;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        super.Render(renderer);
    }
}
