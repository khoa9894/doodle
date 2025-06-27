import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Animation } from "../../../../Engine/Component/Animation";
import { Physic2D } from "../../../../Engine/Component/Physic2D";
import { ResourceManager } from "../../../../Engine/ResourceManager/resourceManage";
import { InputHandle } from "../../../../Engine/InputHandle/InputHandle";

export class Player {
    private gameObject: GameObject;
    private animation: Animation;
    private physics: Physic2D;
    private isRocketActive: boolean = false;
    // Constants
    private readonly FIXED_Y: number = 300;
    private readonly MOVE_SPEED: number = 300;
    private readonly SIZE = { width: 40, height: 40 };
    private readonly SCREEN_WIDTH: number = 400;
    
    // State
    private isJumping: boolean = false;
    
    constructor() {
        this.initializePlayer();
    }



public activateRocketMode(): void {
    this.isRocketActive = true;
    console.log('cc')
    //this.animation.setTexture(ResourceManager.getInstance().getTexture('fu'))
}

public deactivateRocketMode(): void {
    this.isRocketActive = false;
   // this.animation.setTexture(ResourceManager.getInstance().getTexture('blue-lik-left'))
}

public isInRocketMode(): boolean {
    return this.isRocketActive;
}

public update(deltaTime: number): void {
    this.handleInput();
    this.updateBoundaries();
    
    // Kiểm tra nếu đang trong rocket mode theo velocity
    const velocity = this.physics.getVelocity();
    if (velocity.y ==-1500) {
        if (!this.isRocketActive) {
            this.activateRocketMode();
        }
    } else {
        if (this.isRocketActive) {
            this.deactivateRocketMode();
        }
    }
    
    this.gameObject.Update(deltaTime);
}
    private initializePlayer(): void {
        // Create game object
        this.gameObject = new GameObject(
            { x: 200, y: this.FIXED_Y }, 
            this.SIZE
        );
        
        // Initialize animation
        
        
        // Initialize physics
        this.physics = new Physic2D(
            { x: 200, y: this.FIXED_Y }, 
            this.gameObject.hitbox
        );
        
        // Add components to game object
        this.gameObject.AddComponent(this.physics);
    }
    
   public InitAnimation():void{
this.animation = new Animation(
            ResourceManager.getInstance().getTexture('blue-lik-left'), 
            { x: 1, y: 1 }, 
            0
        );
                this.gameObject.AddComponent(this.animation);

   }
    
    private handleInput(): void {
        const currentVelocity = this.physics.getVelocity();
        this.getPhysics
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.physics.setVelocity({
                x: this.MOVE_SPEED, 
                y: currentVelocity.y
            });
            this.animation.setTexture(ResourceManager.getInstance().getTexture('blue-lik-right'))
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.physics.setVelocity({
                x: -this.MOVE_SPEED, 
                y: currentVelocity.y
            });
            this.animation.setTexture(ResourceManager.getInstance().getTexture('blue-lik-left'))
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
    
    public resetPosition(): void {
        this.setPosition(200, this.FIXED_Y);
        this.physics.setVelocity({ x: 0, y: 0 });
    }
    
    public render(renderer: Engine.IRenderer): void {
      //console.log(this.isRocketActive)
       
        this.gameObject.Render(renderer);
    
}
    
    // Getters
    public getGameObject(): GameObject {
        return this.gameObject;
    }
    
    public getPhysics(): Physic2D {
        return this.physics;
    }
    
    public getPosition(): { x: number; y: number } {
        return this.gameObject.position;
    }
    
    public getSize(): { width: number; height: number } {
        return this.gameObject.size;
    }
    
    public getFixedY(): number {
        return this.FIXED_Y;
    }
    
    public getIsJumping(): boolean {
        return this.isJumping;
    }
    
    public setIsJumping(jumping: boolean): void {
        this.isJumping = jumping;
    }
    
    public getVelocity(): IVec2 {
        return this.physics.getVelocity();
    }
}