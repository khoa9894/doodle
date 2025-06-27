import { Platform } from "./Platform";
import { HitBox } from "../../../../Engine/Component/HitBox";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Physic2D } from "../../../../Engine/Component/Physic2D";

export class NobitaPlatform extends Platform {
    private springHitBox: HitBox;
    private springImage: HTMLImageElement;
    private springOffset: number = 10; 
    private springPos: IVec2 = {x: 0, y: 0};
    private isRocketActive: boolean = false;
    private rocketDuration: number = 2.0;  
    private rocketTimer: number = 0;
    private initialForce: number = -350;  
    private targetPlayer: GameObject | null = null;
    private targetPhysics: Physic2D | null = null;
    
    constructor(x: number, y: number) {
        super(x, y, -500); 
        
        const springWidth = 80;
        const springHeight = 40;
        this.springPos.x = x + (this.size.width - springWidth) / 2+40;
        this.springPos.y = y - springHeight + this.springOffset;
        
        this.springHitBox = new HitBox({x: this.springPos.x, y: this.springPos.y}, springWidth, springHeight);
        this.springImage = ResourceManager.getInstance().getTexture('concu');
    }
    
    protected getTextureName(): string {
        return 'platform';
    }
    
    public onReset(): void {
        this.isRocketActive = false;
        this.rocketTimer = 0;
        this.targetPlayer = null;
        this.targetPhysics = null;
    }
    
    public Update(deltaTime: number): void {
        super.Update(deltaTime);
        
        if (this.isActive) {
            const springX = this.position.x + (this.size.width - this.springHitBox.getWidth()) / 2+40;
            const springY = this.position.y - this.springHitBox.getHeight() + this.springOffset;
            this.springHitBox.setPosition({x: springX, y: springY});
        }
        
        if (this.isRocketActive && this.targetPlayer && this.targetPhysics) {
            this.targetPlayer.SetCollision()
            this.updateRocketEffect(deltaTime);
        }
    }
    
    private updateRocketEffect(deltaTime: number): void {
        this.rocketTimer += deltaTime;
        
        if (this.rocketTimer >= this.rocketDuration) {
            this.isRocketActive = false;
            this.targetPlayer = null;
            this.targetPhysics = null;
            return;
        }
        
        
        const ratio = 1 - (this.rocketTimer / this.rocketDuration);
        
        let currentForce = this.initialForce;
        
        if (ratio < 0.9) {
        
            currentForce = this.initialForce * (ratio * ratio * 1.5);
        }
        if (this.targetPlayer) {
        this.targetPlayer.SetCollision();
    }
        if (this.targetPhysics) {
            const velocity = this.targetPhysics.getVelocity();
            
            this.targetPhysics.setVelocity({
                x: velocity.x,
                y: currentForce
            });
        }
    }
    
    
    
    public getSpringHitBox(): HitBox {
        return this.springHitBox;
    }
    
    public checkSpringCollision(player: GameObject): boolean {
        const playerHitbox = player.hitbox;
        const playerBottom = player.position.y + player.size.height;
        const playerCenterX = player.position.x + player.size.width / 2;
        
        const springLeft = this.springHitBox.getPosX();
        const springRight = this.springHitBox.getPosX() + this.springHitBox.getWidth();
        const springTop = this.springHitBox.getPosY();
        const springBottom = this.springHitBox.getPosY() + this.springHitBox.getHeight();
        
        return (
            playerBottom >= springTop &&
            playerBottom <= springBottom  && 
            playerCenterX >= springLeft &&
            playerCenterX <= springRight 
        );
    }
    
    public onPlayerLand(player: GameObject): number {
        if (!player) return this.jumpForce;
        
        if (this.checkSpringCollision(player)) {
            console.log('Nobita rocket activated!');
            
            this.isRocketActive = true;
            this.rocketTimer = 0;
            this.targetPlayer = player;
            this.targetPhysics = player.getComponent<Physic2D>("Physic2D");
            
           // player.SetCollision();
            return -2500; 
        }
        
        return this.jumpForce;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        
        super.Render(renderer);
        
        if (this.springImage) {
            renderer.render(
                this.springImage, 
                this.springHitBox.getPosX(), 
                this.springHitBox.getPosY()
            );
        }
    }
}