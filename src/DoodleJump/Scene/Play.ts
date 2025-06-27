import { Collision } from '../../Engine/ResourceManager/Collision';
import { ResourceManager } from '../../Engine/ResourceManager/resourceManage';
import { Button } from '../../Engine/Component/Button';
import { GameObject } from "../../Engine/GameObject/GameObject";
import { Scene } from "../../Engine/GameScene/Scene/Scene";
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';
import { PlatformManager } from './Object/Platform/PlatformManager';
import { Player } from './Object/Player/Player';

export class PlayScene extends Scene {
    // UI Components
    private background: GameObject;
    private button: Button;
    
    // Player
    private player: Player;
    
    // Game state
    private collision: Collision;
    private currentScore: number = 0; 
    private highScore: number = 0;    
    
    // Platform manager
    private platformManager: PlatformManager;
    
    constructor() {
        super();
        this.initializeComponents();
        this.platformManager = new PlatformManager(this.player.getGameObject(), this.collision);
        this.loadHighScore(); 
    }
    
    private loadHighScore(): void {
        const savedHighScore = localStorage.getItem('doodleJumpHighScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore);
        }
    }
    
    private saveHighScore(): void {
        localStorage.setItem('doodleJumpHighScore', this.highScore.toString());
    }
    
    private saveCurrentScore(): void {
        localStorage.setItem('doodleJumpCurrentScore', this.currentScore.toString());
    }
    
    private initializeComponents(): void {
        // Initialize collision system
        this.collision = new Collision();
        
        // Initialize player
        this.player = new Player();
        
        // Initialize background
        this.background = new GameObject(
            { x: 0, y: 0 }, 
            { width: 900, height: 900 }
        );
    }
    
    public Init(): void {
        this.player.InitAnimation()
        this.collision.addHitBox(this.player.getGameObject().hitbox);
        this.background.AddImage(ResourceManager.getInstance().getTexture('background'));
        this.loadHighScore(); 
    }
    
    public update(deltaTime: number): void {
        this.updateGameObjects(deltaTime);
        this.handleCameraFollow();
        this.platformManager.handlePlatformRecycling();
        this.handleCollisions();
        this.checkGameOver();
    }
    
    private updateGameObjects(deltaTime: number): void {
        this.player.update(deltaTime);
        this.platformManager.update(deltaTime);
    }
    
    private handleCameraFollow(): void {
        const playerPosition = this.player.getPosition();
        const playerVelocity = this.player.getVelocity();
        const playerFixedY = this.player.getFixedY();
        
        if (playerPosition.y < playerFixedY && playerVelocity.y < 0) {
            const cameraOffset = playerFixedY - playerPosition.y;
            this.platformManager.movePlatformsDown(cameraOffset);
            this.player.setPosition(playerPosition.x, playerFixedY);
            this.updateScore(cameraOffset);
        }
    }
    
    private updateScore(offset: number): void {
        this.currentScore += offset; 
                if (Math.floor(this.currentScore) > this.highScore) {
            this.highScore = Math.floor(this.currentScore);
        }
    }
    
    private handleCollisions(): void {
        const playerVelocity = this.player.getVelocity();
        
        if (this.platformManager.checkPlayerCollision(this.player.getPhysics())) {
            if (!this.player.getIsJumping() && playerVelocity.y > 0) {
                this.player.setIsJumping(true);
            }
        } else {
            this.player.setIsJumping(false);
        }
    }
    
    private checkGameOver(): void {
        if (this.player.getPosition().y > 700) {
            this.handleGameOver();
        }
    }
    
    private handleGameOver(): void {
        this.saveHighScore();
        this.saveCurrentScore();
        SceneManager.getInstance().changeSceneByName('DashboardScene');
    }
    
    public exit(): void {
        this.resetPlayerState();
        this.platformManager.reset();
        this.resetGameState();
    }
    
    private resetPlayerState(): void {
        this.player.resetPosition();
    }
    
    private resetGameState(): void {
        this.currentScore = 0;
    }
    
    public render(renderer: Engine.IRenderer): void {
        this.background.Render(renderer);
        this.platformManager.render(renderer);
        this.player.render(renderer);
        
        const scoreText = `Score: ${Math.floor(this.currentScore)}`;
        renderer.drawText(
            scoreText, 
            250,  
            50,  
            "40px Arial",  
            "center",      
            "Black"        
        );
    }
    
    public getCurrentScore(): number {
        return Math.floor(this.currentScore);
    }
    
    public getHighScore(): number {
        return this.highScore;
    }
    
    public getPlatformCount(): number {
        return this.platformManager.getPlatformCount();
    }
    
    public getActivePlatformCount(): number {
        return this.platformManager.getActivePlatformCount();
    }
}