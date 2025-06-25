import { GameObject } from "../../../Engine/GameObject/GameObject";
import { ResourceManager } from '../../../Engine/ResourceManager/resourceManage';

export class Platform extends GameObject {
    private platformType: 'normal' | 'spring' | 'moving' | 'invi';
    private isActive: boolean;
    private originalX: number;
    private moveDirection: number; 
    private moveSpeed: number;
    private moveRange: number;
    
    constructor(
        x: number, 
        y: number, 
        type: 'normal' | 'spring' | 'moving' | 'invi' = 'normal'
    ) {
        super({ x, y }, { width: 90, height: 15 });
        
        this.platformType = type;
        this.isActive = true;
        this.originalX = x;
        this.moveDirection = 1;
        this.moveSpeed = 50; 
        this.moveRange = 100;
        
        this.initializePlatform();
    }
    
    private initializePlatform(): void {
        let textureName = 'platform';
        
        switch (this.platformType) {
            case 'normal':
                textureName = 'platform';
                break;
            case 'spring':
                textureName = 'spring';
                break;
            case 'moving':
                textureName = 'platform';
                break;
            case 'invi':
                textureName = 'invi';
                break;
        }
        
            this.AddImage(ResourceManager.getInstance().getTexture(textureName));
      
    }
    
    public Update(deltaTime: number): void {
        if (!this.isActive) return;
        
        if (this.platformType === 'moving') {
            this.updateMovingPlatform(deltaTime);
        }
        
        super.Update(deltaTime);
    }
    
    private updateMovingPlatform(deltaTime: number): void {
        this.position.x += this.moveSpeed * this.moveDirection * deltaTime;
        if (this.position.x <= this.originalX - this.moveRange) {
            this.moveDirection = 1;
            this.position.x = this.originalX - this.moveRange;
        } else if (this.position.x >= this.originalX + this.moveRange) {
            this.moveDirection = -1;
            this.position.x = this.originalX + this.moveRange;
        }
        
        if (this.position.x < 0) {
            this.position.x = 0;
            this.moveDirection = 1;
        } else if (this.position.x > 400 - this.size.width) {
            this.position.x = 400 - this.size.width;
            this.moveDirection = -1;
        }
        
        this.hitbox.setPosition(this.position);
    }
    
    public onPlayerLand(): number {
        switch (this.platformType) {
            case 'normal':
                return -500; 
            case 'spring':
                return -1000; 
            case 'moving':
                return -500; 
            case 'invi':
                this.breakPlatform();
                return -500;
            default:
                return -400;
        }
    }
    
    private breakPlatform(): void {
       
        this.isActive = false;
        
        setTimeout(() => {
            this.isActive = true;
        }, 2000);
    }
    
    public resetPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.originalX = x;
        this.isActive = true;
        this.hitbox.setPosition(this.position);
    }
    
    public setRandomPosition(minY: number, maxY: number): void {
        const newX = Math.random() * (400 - this.size.width);
        const newY = minY + Math.random() * (maxY - minY);
        this.resetPosition(newX, newY);
    }
    
    public get platformTyp(): 'normal' | 'spring' | 'moving' | 'invi' {
        return this.platformType;
    }
    
    public get isActivePlatform(): boolean {
        return this.isActive;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        super.Render(renderer);
    }
}