import { HitBox } from './../../../../Engine/Component/HitBox';
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { Player } from '../Player/Player';
import { Platform } from '../Platform/Platform';

export abstract class BoostObject extends GameObject {
    protected isActive: boolean;
    protected HitBox: HitBox;
    protected jumpForce: IVec2;
    private attachedPlatform: Platform;

    public attachToPlatform(platform: Platform): void {
        this.attachedPlatform = platform;
    }
    
    constructor(x: number, y: number, jumpForce: IVec2, width: number, height: number) {
        super({ x, y }, { width: width, height: height });
        this.HitBox = new HitBox({ x, y }, width, height);
        this.AddComponent(this.HitBox);
        this.isActive = true;
        this.jumpForce = jumpForce;
        this.initializePlatform();
    }
    
    public getHitBox(): HitBox {
        return this.HitBox;
    }
    
    protected abstract getTextureName(): string;
    
    // Abstract method để mỗi boost type tự định nghĩa offset
    protected abstract getVerticalOffset(): number;
    
    private initializePlatform(): void {
        const textureName = this.getTextureName();
        this.AddImage(ResourceManager.getInstance().getTexture(textureName));
    }
    
    public getAgetAttachedPlatform(): Platform {
        return this.attachedPlatform;
    }
    
    public Update(deltaTime: number): void {
        if (!this.isActive) return;
        
        if (this.attachedPlatform) {
            this.position.x = this.attachedPlatform.position.x;
            this.position.y = this.attachedPlatform.position.y + this.getVerticalOffset();
            this.getHitBox().setPosition(this.position);
        }
        
        this.updatePlatformSpecific(deltaTime);
        super.Update(deltaTime);
    }
    
    protected updatePlatformSpecific(deltaTime: number): void {
    }
    
    public onPlayerLand(player?: Player): IVec2 {
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
    
    public setRandomPositionOnPlatform(x: number, y: number): void {
        this.resetPosition(x, y);
    }
    
    public get isActivePlatform(): boolean {
        return this.isActive;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        super.Render(renderer);
    }
}