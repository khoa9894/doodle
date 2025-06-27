import { Platform } from "./Platform";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';

export class InvisiblePlatform extends Platform {
    private respawnTime: number;
    private respawnTimer: number;
    private originalY: number; 
    private beforeTexture: HTMLImageElement;
    private afterTexture: HTMLImageElement;  
    
    private disappearDelay: number = 200; 
    private disappearTimer: number = 0;
    private isTriggered: boolean = false; 
    
    constructor(x: number, y: number, respawnTime: number = 2000) {
        super(x, y, -500);
        this.respawnTime = respawnTime;
        this.respawnTimer = 0;
        this.originalY = y;
        
        this.beforeTexture = ResourceManager.getInstance().getTexture('before');
        this.afterTexture = ResourceManager.getInstance().getTexture('after');
    }
    
    protected getTextureName(): string {
        return 'before'; 
    }
    
    protected handlePlayerLanding(): void {
        if (!this.isTriggered) {
            this.triggerDisappear();
        }
    }
    
    private triggerDisappear(): void {
        this.isTriggered = true;
        this.disappearTimer = this.disappearDelay;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        const currentTexture = this.isTriggered ? this.afterTexture : this.beforeTexture;
        renderer.render(
            currentTexture, 
            this.position.x, 
            this.position.y,
        );
    }
    
    private breakPlatform(): void {
        this.isActive = false;
        this.respawnTimer = this.respawnTime;
        this.isTriggered = false; 
        this.disappearTimer = 0;
    }
    
    protected updatePlatformSpecific(deltaTime: number): void {
        // Nếu đã trigger và còn timer
        if (this.isTriggered && this.disappearTimer > 0 && this.isActive) {
            this.disappearTimer -= deltaTime * 1000;
            
            // Khi hết timer, platform biến mất
            if (this.disappearTimer <= 0) {
                this.breakPlatform();
            }
        }
        
        // Nếu không active và đang trong thời gian respawn
        if (!this.isActive && this.respawnTimer > 0) {
            this.respawnTimer -= deltaTime * 1000;
            if (this.respawnTimer <= 0) {
                this.respawn();
            }
        }
    }
    
    private respawn(): void {
        this.isActive = true;
        this.isTriggered = false; 
        this.disappearTimer = 0;
        this.position.y = this.originalY; 
        this.hitbox.setPosition(this.position);
    }
    
    public resetPosition(x: number, y: number): void {
        super.resetPosition(x, y);
        this.originalY = y;
        this.isTriggered = false; 
        this.disappearTimer = 0;
    }
    
    public onReset(): void {
        this.respawnTimer = 0;
        this.isTriggered = false; 
        this.isActive = true;
        this.disappearTimer = 0;
        this.position.y = this.originalY;
        this.hitbox.setPosition(this.position);
    }
}