import { Platform } from "./Platform";

export class InvisiblePlatform extends Platform {
    private respawnTime: number;
    private respawnTimer: number;
    
    constructor(x: number, y: number, respawnTime: number = 2000) {
        super(x, y, -500);
        this.respawnTime = respawnTime;
        this.respawnTimer = 0;
    }
    
    protected getTextureName(): string {
        return 'invi';
    }
    
    protected handlePlayerLanding(): void {
        this.breakPlatform();
    }
    
    private breakPlatform(): void {
        this.isActive = false;
        this.respawnTimer = this.respawnTime;
    }
    
    protected updatePlatformSpecific(deltaTime: number): void {
        if (!this.isActive && this.respawnTimer > 0) {
            this.respawnTimer -= deltaTime * 1000; // Convert to milliseconds
            if (this.respawnTimer <= 0) {
                this.isActive = true;
            }
        }
    }
    
    protected onReset(): void {
        this.respawnTimer = 0;
    }
}