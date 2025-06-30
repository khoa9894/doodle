import { Platform } from "./Platform";
import { AudioManager } from "../../../../Engine/ResourceManager/AudioManager";
export class MovingPlatform extends Platform {
    private originalX: number;
    private moveDirection: number;
    private moveSpeed: number;
    private moveRange: number;
    
    constructor(x: number, y: number, moveSpeed: number = 50, moveRange: number = 100) {
        super(x, y, -500);
        console.log('move', x, y)
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
    protected handlePlayerLanding(): void {
         const audioManager = AudioManager.getInstance();
                    audioManager.loadSound('jump', 'assets/images/jump.mp3');
                    audioManager.playSound('jump', 0.8)
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
        
        this.getHitBox().setPosition(this.position);
    }
    
    public onReset(): void {
        this.originalX = this.position.x;
        this.moveDirection = 1;
    }
}