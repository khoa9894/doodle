import { Collision } from '../../Engine/ResourceManager/Collision';
import { ResourceManager } from '../../Engine/ResourceManager/resourceManage';
import { Button } from '../../Engine/Component/Button';
import { GameObject } from "../../Engine/GameObject/GameObject";
import { Scene } from "../../Engine/GameScene/Scene/Scene";
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';
import { PlatformManager } from './Object/Platform/PlatformManager';
import { BoostManager } from './Object/BoostObject/BoostManager'; 
import { Player } from './Object/Player/Player';
import { EndScene } from './EndScene';

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
    private isGameOver: boolean = false;
    private endScene: EndScene;
    
    // Managers
    private platformManager: PlatformManager;
    private boostManager: BoostManager; 
    
    // Boost spawn tracking
    private lastBoostSpawnScore: number = 0;
    private boostSpawnInterval: number = 200;
    
    constructor() {
        super();
        this.initializeComponents();
        this.platformManager = new PlatformManager(this.player, this.collision);
        this.boostManager = new BoostManager(this.player, this.collision,this.platformManager.ReturnHighest()); 
        this.endScene = new EndScene();
        this.loadHighScore(); 
    }
    
    private loadHighScore(): void {
        const savedHighScore = localStorage.getItem('doodleJump_highScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore);
        }
    }
    
    private saveHighScore(): void {
        localStorage.setItem('doodleJump_highScore', this.highScore.toString());
    }
    
    private saveCurrentScore(): void {
        localStorage.setItem('doodleJumpCurrentScore', this.currentScore.toString());
    }
    
    private initializeComponents(): void {
        // Initialize collision system
        this.collision = new Collision();
        
        // Initialize player
        this.player = new Player();
        console.log('hi', this.player.getPosition())
        // Initialize background
        this.background = new GameObject(
            { x: 0, y: 0 }, 
            { width: 900, height: 900 }
        );
    }
    
    public Init(): void {
        this.player.Init()
        this.collision.addHitBox(this.player.getHitBox());
        this.background.AddImage(ResourceManager.getInstance().getTexture('background'));
        this.loadHighScore();
        this.boostManager.createBoostOnPlatform()
    }
    
    
    public update(deltaTime: number): void {
        if (this.isGameOver) {
            this.endScene.update(deltaTime);
            return;
        }
        
        this.handleCollisions();
        this.updateGameObjects(deltaTime);
        this.handleCameraFollow();
        this.DeleteAndSpawn();
        this.player.update(deltaTime);
        
        this.checkGameOver();
    }
    private DeleteAndSpawn(){
         this.platformManager.deletePlatform();
        this.platformManager.SpawnPlatform();
        this.boostManager.setHighest(this.platformManager.ReturnHighest()); 
      // console.log( 'thuchode',this.platformManager.ReturnHighest().position.y);
        this.boostManager.handleBoostRecycling()
        this.boostManager.createBoostOnPlatform(); 



    }
    private updateGameObjects(deltaTime: number): void {
        this.platformManager.update(deltaTime);
        this.boostManager.update(deltaTime); 
    }
    
    private handleCameraFollow(): void {
        const playerPosition = this.player.getPosition();
        const playerVelocity = this.player.getVelocity();
        const playerFixedY = 300;
        
        if (playerPosition.y < playerFixedY && playerVelocity.y < 0) {
            const cameraOffset = playerFixedY - playerPosition.y;
            this.platformManager.movePlatformsDown(cameraOffset);
            this.boostManager.moveBoostsDown(cameraOffset); 
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
        this.platformManager.checkPlayerCollision(this.player.getPhysics());
        this.boostManager.checkPlayerCollision();
    }
    
    
    
    private checkGameOver(): void {
        if (this.player.getPosition().y > 700) {
            this.handleGameOver();
        }
    }
    
    private handleGameOver(): void {
        if (!this.isGameOver) {
            this.isGameOver = true;
            this.saveHighScore();
            
            this.endScene.setScores(this.currentScore, this.highScore);
            this.endScene.Init();
            
            console.log('Game Over! Score:', Math.floor(this.currentScore), 'High Score:', this.highScore);
        }
    }
    
    public exit(): void {
        this.resetPlayerState();
      //  this.platformManager.reset();
        this.boostManager.reset(); // Reset boosts
        this.resetGameState();
    }
    
    private resetPlayerState(): void {
        this.player.resetPosition();
    }
    
    private resetGameState(): void {
        this.currentScore = 0;
        this.lastBoostSpawnScore = 0;
    }
    
    public render(renderer: Engine.IRenderer): void {
        // Render game objects
        this.background.Render(renderer);
        this.platformManager.render(renderer);
        this.boostManager.render(renderer);
        this.player.render(renderer);
        
        if (!this.isGameOver) {
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
        
        // Render EndScene nếu game over
        if (this.isGameOver) {
            this.endScene.render(renderer);
        }
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
    
    public getBoostCount(): number {
        return this.boostManager.getBoostCount();
    }
    
    public restartGame(): void {
        this.isGameOver = false;
        this.currentScore = 0;
        this.lastBoostSpawnScore = 0;
        
        // Reset player
        this.resetPlayerState();
        
        // Reset managers
        this.boostManager.reset();
        this.resetGameState();
        
        // Recreate managers với fresh state
        this.platformManager = new PlatformManager(this.player, this.collision);
        this.boostManager = new BoostManager(this.player, this.collision, this.platformManager.ReturnHighest());
        
        console.log('Game restarted!');
    }
}