import { Platform } from "./Platform";

export class MovingPlatform extends Platform {
    private originalX: number;
    private moveDirection: number;
    private moveSpeed: number;
    private moveRange: number;
    
    constructor(x: number, y: number, moveSpeed: number = 50, moveRange: number = 100) {
        super(x, y, -500);
        this.originalX = x;
        this.moveDirection = 1;
        this.moveSpeed = moveSpeed;
        this.moveRange = moveRange;
    }
    
    protected getTextureName(): string {
        return 'platform';
    }
    
    protected updatePlatformSpecific(deltaTime: number): void {
        this.updateMovement(deltaTime);
    }
    
    private updateMovement(deltaTime: number): void {
        this.position.x += this.moveSpeed * this.moveDirection * deltaTime;
        
        // Check movement bounds
        if (this.position.x <= this.originalX - this.moveRange) {
            this.moveDirection = 1;
            this.position.x = this.originalX - this.moveRange;
        } else if (this.position.x >= this.originalX + this.moveRange) {
            this.moveDirection = -1;
            this.position.x = this.originalX + this.moveRange;
        }
        
        // Check screen bounds
        if (this.position.x < 0) {
            this.position.x = 0;
            this.moveDirection = 1;
        } else if (this.position.x > 400 - this.size.width) {
            this.position.x = 400 - this.size.width;
            this.moveDirection = -1;
        }
        
        this.hitbox.setPosition(this.position);
    }
    
    protected onReset(): void {
        this.originalX = this.position.x;
        this.moveDirection = 1;
    }
}