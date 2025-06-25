import { DashboardScene } from './Dashboard';
import { Collision } from '../../Engine/ResourceManager/Collision';
import { Animation } from '../../Engine/Component/Animation';
import { Physic2D } from '../../Engine/Component/Physic2D';
import { ResourceManager } from '../../Engine/ResourceManager/resourceManage';
import { Button } from '../../Engine/Component/Button';
import { GameObject } from "../../Engine/GameObject/GameObject";
import { Scene } from "../../Engine/GameScene/Scene/Scene";
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';
import { InputHandle } from '../../Engine/InputHandle/InputHandle';
import { PlatformManager } from './Object/Platform/PlatformManager';

export class PlayScene extends Scene {
    // UI Components
    private background: GameObject;
    private button: Button;
    
    // Player related
    private player: GameObject;
    private playerAnimation: Animation;
    private playerPhysics: Physic2D;
    private readonly PLAYER_FIXED_Y: number = 300;
    private readonly PLAYER_MOVE_SPEED: number = 300;
    private readonly PLAYER_SIZE = { width: 40, height: 40 };
    private readonly SCREEN_WIDTH: number = 400;
    
    // Game state
    private collision: Collision;
    private isJumping: boolean = false;
    private highScore: number = 0;
    
    // Platform manager
    private platformManager: PlatformManager;
    
    constructor() {
        super();
        this.initializeComponents();
        this.platformManager = new PlatformManager(this.player, this.collision);
    }
    
    private initializeComponents(): void {
        // Initialize collision system
        this.collision = new Collision();
        
        // Initialize player
        this.player = new GameObject(
            { x: 200, y: this.PLAYER_FIXED_Y }, 
            this.PLAYER_SIZE
        );
        
        // Initialize player animation
        this.playerAnimation = new Animation(
            ResourceManager.getInstance().getTexture('blue-lik-left'), 
            { x: 1, y: 1 }, 
            0.1
        );
        
        this.playerPhysics = new Physic2D(
            { x: 200, y: this.PLAYER_FIXED_Y }, 
            this.player.hitbox
        );
        
        // Initialize background
        this.background = new GameObject(
            { x: 0, y: 0 }, 
            { width: 900, height: 900 }
        );
    }
    
    public Init(): void {
        // Setup player components
        this.collision.addHitBox(this.player.hitbox);
        this.player.AddComponent(this.playerAnimation);
        this.player.AddComponent(this.playerPhysics);
        
        // Setup background
        this.background.AddImage(ResourceManager.getInstance().getTexture('background'));
    }
    
    public update(deltaTime: number): void {
        this.handlePlayerInput();
        this.updatePlayerBoundaries();
        this.updateGameObjects(deltaTime);
        this.handleCameraFollow();
        this.platformManager.handlePlatformRecycling();
        this.handleCollisions();
        this.checkGameOver();
    }
    
    private handlePlayerInput(): void {
        const currentVelocity = this.playerPhysics.getVelocity();
        
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.playerPhysics.setVelocity({
                x: this.PLAYER_MOVE_SPEED, 
                y: currentVelocity.y
            });
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.playerPhysics.setVelocity({
                x: -this.PLAYER_MOVE_SPEED, 
                y: currentVelocity.y
            });
        } else {
            this.playerPhysics.setVelocity({
                x: 0, 
                y: currentVelocity.y
            });
        }
    }
    
    private updatePlayerBoundaries(): void {
        const playerWidth = this.player.size.width;
        
        // Wrap player around screen edges
        if (this.player.position.x > this.SCREEN_WIDTH + playerWidth) {
            this.setPlayerPosition(0, this.player.position.y);
        } else if (this.player.position.x < -playerWidth) {
            this.setPlayerPosition(this.SCREEN_WIDTH, this.player.position.y);
        }
    }
    
    private setPlayerPosition(x: number, y: number): void {
        this.player.position.x = x;
        this.player.position.y = y;
        this.playerPhysics.setPosition({ x, y });
    }
    
    private updateGameObjects(deltaTime: number): void {
        this.player.Update(deltaTime);
        this.platformManager.update(deltaTime);
    }
    
    private handleCameraFollow(): void {
        const velocityY = this.playerPhysics.getVelocity().y;
        
        // Only move camera when player is moving up and above fixed position
        if (this.player.position.y < this.PLAYER_FIXED_Y && velocityY < 0) {
            const cameraOffset = this.PLAYER_FIXED_Y - this.player.position.y;
            this.platformManager.movePlatformsDown(cameraOffset);
            this.setPlayerPosition(this.player.position.x, this.PLAYER_FIXED_Y);
            this.updateScore(cameraOffset);
        }
    }
    
    private updateScore(offset: number): void {
        this.highScore += offset;
    }
    
    private handleCollisions(): void {
        const velocityY = this.playerPhysics.getVelocity().y;
        
        if (this.platformManager.checkPlayerCollision(this.playerPhysics)) {
            if (!this.isJumping && velocityY > 0) {
                this.isJumping = true;
            }
        } else {
            this.isJumping = false;
        }
    }
    
    private checkGameOver(): void {
        if (this.player.position.y > 800) {
            this.handleGameOver();
        }
    }
    
    private handleGameOver(): void {
        console.log(`Game Over! High Score: ${Math.floor(this.highScore)}`);
        SceneManager.getInstance().changeSceneByName('DashboardScene');
    }
    
    public exit(): void {
        this.resetPlayerState();
        this.platformManager.reset();
        this.resetGameState();
    }
    
    private resetPlayerState(): void {
        this.setPlayerPosition(200, this.PLAYER_FIXED_Y);
        this.playerPhysics.setVelocity({ x: 0, y: 0 });
    }
    
    private resetGameState(): void {
        this.highScore = 0;
        this.isJumping = false;
    }
    
    public render(renderer: Engine.IRenderer): void {
        this.background.Render(renderer);
        this.platformManager.render(renderer);
        this.player.Render(renderer);
    }
    
    public getHighScore(): number {
        return Math.floor(this.highScore);
    }
    
    public getPlatformCount(): number {
        return this.platformManager.getPlatformCount();
    }
    
    public getActivePlatformCount(): number {
        return this.platformManager.getActivePlatformCount();
    }
}