import { HitBox } from './../../../../Engine/Component/HitBox';
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { Player } from '../Player/Player';

export abstract class Platform extends GameObject {
    protected isActive: boolean;
    protected HitBox:HitBox
    protected jumpForce: number;
    
    constructor(x: number, y: number, jumpForce: number = -500, ) {
        super({ x, y }, { width: 90, height: 15 });
        this.HitBox= new HitBox({ x, y },  90, 15 ) 
        this.AddComponent(this.HitBox)
        this.isActive = true;
        this.jumpForce = jumpForce;
        this.initializePlatform();
    }
    public getHitBox(): HitBox {
        return this.HitBox;
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
    
    public onPlayerLand(player?: Player): number {
        this.handlePlayerLanding();
        return this.jumpForce;
    }
    
    protected handlePlayerLanding(): void {
    }
    
    public resetPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.isActive = true;
        this.HitBox.setPosition(this.position);
        this.onReset();
    }
    
    public onReset(): void {
    }
    
    public setRandomPosition(minY: number, maxY: number): void {
        const newX = Math.random() * (500 - this.size.width);
        const newY = minY + Math.random() * (maxY - minY);
        this.resetPosition(newX, newY);
    }
    
    public get isActivePlatform(): boolean {
        return this.isActive;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        //console.log('render ar', this.position)
        super.Render(renderer);
    }

}
