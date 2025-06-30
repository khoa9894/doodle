import { Platform } from "./Platform";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { AudioManager } from "../../../../Engine/ResourceManager/AudioManager";
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
        console.log('invi',x,y)
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
          
                    const audioManager = AudioManager.getInstance();
                        audioManager.loadSound('jump', 'assets/images/break.mp3');
                        audioManager.playSound('jump', 0.8)
            
    }
    
    private triggerDisappear(): void {
        this.isTriggered = true;
        this.disappearTimer = this.disappearDelay;
    }
    
    public Render(renderer: Engine.IRenderer): void {
    if (!this.isActive) return;
    
    const currentTexture = this.isTriggered ? this.afterTexture : this.beforeTexture;
    renderer.render(currentTexture, this.position.x, this.position.y);
    
    for (const component of this._listComponent) {
        component.render(renderer, this.position.x, this.position.y);
    }
}
    
    private breakPlatform(): void {
        this.isActive = false;
        this.respawnTimer = this.respawnTime;
        this.isTriggered = false; 
        this.disappearTimer = 0;
    }
    
    protected updatePlatformSpecific(deltaTime: number): void {
        if (this.isTriggered && this.disappearTimer > 0 && this.isActive) {
            this.disappearTimer -= deltaTime * 1000;
            
            if (this.disappearTimer <= 0) {
                this.breakPlatform();
            }
        }
        
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
        this.getHitBox().setPosition(this.position);
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
        this.getHitBox().setPosition(this.position);
    }
}