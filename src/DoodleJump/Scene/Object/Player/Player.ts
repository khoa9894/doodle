import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Animation } from "../../../../Engine/Component/Animation";
import { Physic2D } from "../../../../Engine/Component/Physic2D";
import { ResourceManager } from "../../../../Engine/ResourceManager/resourceManage";
import { InputHandle } from "../../../../Engine/InputHandle/InputHandle";

export class Player {
    private gameObject: GameObject;
    private animation: Animation;
    private physics: Physic2D;
    
    private readonly MOVE_SPEED: number = 300;
    private readonly SCREEN_WIDTH: number = 400;
    
    constructor(position: IVec2, size: { width: number; height: number }) {
        // Khởi tạo GameObject
        this.gameObject = new GameObject(position, size);
        
        // Khởi tạo Animation
        this.animation = new Animation(
            ResourceManager.getInstance().getTexture('blue-lik-left'),
            { x: 1, y: 1 },
            0.1
        );
        
        // Khởi tạo Physics
        this.physics = new Physic2D(position, this.gameObject.hitbox);
        
        // Thêm các component vào GameObject
        this.gameObject.AddComponent(this.animation);
        this.gameObject.AddComponent(this.physics);
    }
    
    public init(): void {
        // Khởi tạo các giá trị ban đầu nếu cần
    }
    
    public update(deltaTime: number): void {
        this.handleInput();
        this.updateBoundaries();
        this.gameObject.Update(deltaTime);
    }
    
    public render(renderer: Engine.IRenderer): void {
        this.gameObject.Render(renderer);
    }
    
    private handleInput(): void {
        const currentVelocity = this.physics.getVelocity();
        
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.physics.setVelocity({
                x: this.MOVE_SPEED,
                y: currentVelocity.y
            });
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.physics.setVelocity({
                x: -this.MOVE_SPEED,
                y: currentVelocity.y
            });
        } else {
            this.physics.setVelocity({
                x: 0,
                y: currentVelocity.y
            });
        }
    }
    
    private updateBoundaries(): void {
        const playerWidth = this.gameObject.size.width;
        
        // Wrap player around screen edges
        if (this.gameObject.position.x > this.SCREEN_WIDTH + playerWidth) {
            this.setPosition(0, this.gameObject.position.y);
        } else if (this.gameObject.position.x < -playerWidth) {
            this.setPosition(this.SCREEN_WIDTH, this.gameObject.position.y);
        }
    }
    
    public setPosition(x: number, y: number): void {
        this.gameObject.position.x = x;
        this.gameObject.position.y = y;
        this.physics.setPosition({ x, y });
    }
    
    public setVelocity(velocity: IVec2): void {
        this.physics.setVelocity(velocity);
    }
    
    public getVelocity(): IVec2 {
        return this.physics.getVelocity();
    }
    
    public getPosition(): IVec2 {
        return { 
            x: this.gameObject.position.x, 
            y: this.gameObject.position.y 
        };
    }
    
    public getGameObject(): GameObject {
        return this.gameObject;
    }
    
    public getHitbox(): any {
        return this.gameObject.hitbox;
    }
    
    public getSize(): { width: number; height: number } {
        return this.gameObject.size;
    }
    
    public reset(position: IVec2): void {
        this.setPosition(position.x, position.y);
        this.setVelocity({ x: 0, y: 0 });
    }
}