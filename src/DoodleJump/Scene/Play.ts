import { DashboardScene } from './Dashboard';
import { Collision } from './../../Engine/ResourceManager/Collision';
import { Animation } from './../../Engine/Component/Animation';
import { Physic2D } from './../../Engine/Component/Physic2D';
import { ResourceManager} from './../../Engine/ResourceManager/resourceManage';
import { Button } from './../../Engine/Component/Button';
import { GameObject } from "../../Engine/GameObject/GameObject";
import { Platform } from "./Object/Platform"
import { Scene, SceneName } from "../../Engine/GameScene/Scene/Scene";
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';
import { InputHandle } from '../../Engine/InputHandle/InputHandle';

export class PlayScene extends Scene{
    private PlayButton: GameObject;
    private anim1: Animation;
    private Background: GameObject;
    private Physic2D: Physic2D;
    private Player: GameObject;
    private Collision: Collision;
    private listPlatform: Platform[] = [];
    private Butt: Button;
    private isJump: boolean = false;
    private cameraY: number = 0;
    private playerFixedY: number = 300; 
    
    constructor() {
        super();
        this.Collision = new Collision();
        this.Player = new GameObject({ x: 200, y: this.playerFixedY }, { width: 40, height: 40 });
        this.anim1 = new Animation(ResourceManager.getInstance().getTexture('blue-lik-left'), { x: 1, y: 1 }, 0.1);
        this.Physic2D = new Physic2D({ x: 200, y: this.playerFixedY }, this.Player.getComponentByName('HitBox') as Engine.IHitBox);
        this.Background = new GameObject({ x: 0, y: 0 }, { width: 900, height: 900 });

        this.createPlatforms();
    }
    // Create random platform
    private createPlatforms(): void {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * (400);
            const y = 600 + (i * -100); 
            
            let platformType: 'normal' | 'spring' | 'moving' | 'invi' = 'normal';
            if (i > 2) {   // make sure first platform is normal :D
                const random = Math.random();
                if (random < 0.7) {
                    platformType = 'normal';
                } else if (random < 0.85) {
                    platformType = 'spring';
                } else if (random < 0.95) {
                    platformType = 'moving';
                } else {
                    platformType = 'invi';
                }
            }
            
            const plat = new Platform(x, y, platformType);
            this.Collision.addHitBox(plat.hitbox);
            this.listPlatform.push(plat);
        }
    }

    public Init(): void {
        this.Collision.addHitBox(this.Player.hitbox);
        this.Player.AddComponent(this.anim1);
        this.Player.AddComponent(this.Physic2D);
        this.Background.AddImage(ResourceManager.getInstance().getTexture('background'));
    }
    
    public update(deltaTime: number): void {
        const currentVelocity = this.Physic2D.getVelocity();
        const moveSpeed = 300; 
        // move player
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Physic2D.setVelocity({x: moveSpeed, y: currentVelocity.y});
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Physic2D.setVelocity({x: -moveSpeed, y: currentVelocity.y});
        } else {
            this.Physic2D.setVelocity({x: 0, y: currentVelocity.y});
        }
        // make sure player stay in da screen
        if (this.Player.position.x > 400) {
            this.Player.position.x = 0;
            this.Physic2D.setPosition({x: 0, y: this.Player.position.y});
        } else if (this.Player.position.x < 0) {
            this.Player.position.x = 400;
            this.Physic2D.setPosition({x: 400, y: this.Player.position.y});
        }
        
        this.Player.Update(deltaTime);
        
        for (let platform of this.listPlatform) {
            platform.Update(deltaTime);
        }
        
        const velocityY = this.Physic2D.getVelocity().y;
        
        if (this.Player.position.y < this.playerFixedY && velocityY < 0) {
            const offset = this.playerFixedY - this.Player.position.y;
            
            for (let platform of this.listPlatform) {
                platform.position.y += offset;
                platform.hitbox.setPosition(platform.position);
            }
            
            this.Player.position.y = this.playerFixedY;
            this.Physic2D.setPosition({x: this.Player.position.x, y: this.playerFixedY});
            
            this.cameraY += offset;
        }
        
        this.recyclePlatforms();
        
        if (this.checkPlayerPlatformCollision()) {
            if (!this.isJump && velocityY > 0) { // Chỉ nhảy khi đang rơi xuống
                this.isJump = true;
            }
        } else {
            this.isJump = false;
        }
        
        if (this.Player.position.y > 800) {
            //this.restartGame();
             SceneManager.getInstance().pushScene(SceneName.DashboardScene);
        }
    }
    
    private recyclePlatforms(): void {
        let highestY = Math.min(...this.listPlatform.map(p => p.position.y));
        
        for (let platform of this.listPlatform) {
            if (platform.position.y > 900) {
                const newX = Math.random() * (400);
                const newY = highestY - (80 + Math.random() * 40); 
                
                platform.resetPosition(newX, newY);
                
                highestY = newY;
            }
        }
    }
    
    private checkPlayerPlatformCollision(): boolean {
        const playerHitbox = this.Player.hitbox;
        
        for (let platform of this.listPlatform) {
            if (!platform.isActivePlatform) continue; 
            
            if (playerHitbox.intersects(platform.hitbox)) {
                const playerBottom = this.Player.position.y + this.Player.size.height;
                const platformTop = platform.position.y;
                
                if (Math.abs(playerBottom - platformTop) < 10) {
                    const jumpForce = platform.onPlayerLand();
                    this.Physic2D.setVelocity({
                        x: this.Physic2D.getVelocity().x, 
                        y: jumpForce
                    });
                    return true;
                }
            }
        }
        return false;
    }
    
    private restartGame(): void {
        this.Player.position.y = this.playerFixedY;
        this.Player.position.x = 200;
        this.Physic2D.setPosition({x: 200, y: this.playerFixedY});
        this.Physic2D.setVelocity({x: 0, y: 0});
        this.cameraY = 0;
        
        for (let i = 0; i < this.listPlatform.length; i++) {
            const newX = Math.random() * (400 - 68);
            const newY = 600 + (i * -100);
            this.listPlatform[i].resetPosition(newX, newY);
        }
    }

    public render(Renderer: Engine.IRenderer): void {
        this.Background.Render(Renderer);
        
        for (const platform of this.listPlatform) {
            platform.Render(Renderer);
        }
        
        this.Player.Render(Renderer);
    }
}