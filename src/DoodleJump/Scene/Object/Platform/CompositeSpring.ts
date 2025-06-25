import { Platform } from "./Platform";
import { HitBox } from "../../../../Engine/Component/HitBox";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { GameObject } from "../../../../Engine/GameObject/GameObject";

export class SpringyPlatform extends Platform {
    private springHitBox: HitBox;
    private springImage: HTMLImageElement;
    private springOffset: number = 10; 
    private springPos: IVec2 = {x: 0, y: 0};
    
    constructor(x: number, y: number) {
        super(x, y, -500); 
        
        const springWidth = 50;
        const springHeight = 40;
        this.springPos.x = x + (this.size.width - springWidth) / 2+40;
        this.springPos.y = y - springHeight + this.springOffset;
        
        this.springHitBox = new HitBox({x: this.springPos.x, y: this.springPos.y}, springWidth, springHeight);
        this.springImage = ResourceManager.getInstance().getTexture('duma');
    }
    
    protected getTextureName(): string {
        return 'platform';
    }
    
    public Update(deltaTime: number): void {
        super.Update(deltaTime);
        
        // Cập nhật vị trí lò xo khi platform di chuyển
        if (this.isActive) {
            const springX = this.position.x + (this.size.width - this.springHitBox.getWidth()) / 2+40;
            const springY = this.position.y - this.springHitBox.getHeight() + this.springOffset;
            this.springHitBox.setPosition({x: springX, y: springY});
        }
    }
    
    public getSpringHitBox(): HitBox {
        return this.springHitBox;
    }
    
    // Kiểm tra collision với spring riêng biệt
    public checkSpringCollision(player: GameObject): boolean {
        const playerHitbox = player.hitbox;
        const playerBottom = player.position.y + player.size.height;
        const playerCenterX = player.position.x + player.size.width / 2;
        
        // Kiểm tra va chạm với spring hitbox
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
    
    // Override để kiểm tra va chạm với lò xo hoặc platform
    public onPlayerLand(player: GameObject): number {
        if (!player) return this.jumpForce;
        
        // Kiểm tra spring collision trước
        if (this.checkSpringCollision(player)) {
            console.log('Spring bounce activated!');
            return -1000; // Lực nhảy cao của spring
        }
        
        // Nếu không va chạm với spring, xử lý như platform thông thường
        return this.jumpForce;
    }
    
    public Render(renderer: Engine.IRenderer): void {
        if (!this.isActive) return;
        
        // Render platform
        super.Render(renderer);
        
        // Render spring
        if (this.springImage) {
            renderer.render(
                this.springImage, 
                this.springHitBox.getPosX(), 
                this.springHitBox.getPosY()
            );
        }
        
        // Debug render spring hitbox
        // renderer.drawRect(
        //     this.springHitBox.getPosX(), 
        //     this.springHitBox.getPosY(), 
        //     this.springHitBox.getWidth(), 
        //     this.springHitBox.getHeight()
        // );
    }
}