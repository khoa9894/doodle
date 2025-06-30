import { Scene, SceneName } from "../../Engine/GameScene/Scene/Scene";
import { ResourceManager } from "../../Engine/ResourceManager/resourceManage";
import { Button } from "../../Engine/Component/Button";
import { GameObject } from "../../Engine/GameObject/GameObject";
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';

export class EndScene extends Scene {
    private backgroundImage: HTMLImageElement;
    private currentScore: number = 0;
    private highScore: number = 0;
    private restartButton: Button;
    private menuButton: Button;
    private gameOverText: string = "GAME OVER";
    
    // Fixed values
    private screenWidth: number = 500;
    private screenHeight: number = 750;

    constructor() {
        super();
        this.loadResources();
        this.createButtons();
    }

    private loadResources(): void {
        ResourceManager.getInstance().addTexture('background');
        ResourceManager.getInstance().addTexture('play');
        this.backgroundImage = ResourceManager.getInstance().getTexture('background');
    }

    private createButtons(): void {
        const buttonWidth = 120;
        const buttonHeight = 40;
        
        // Restart Button
        this.restartButton = new Button(
            { x: buttonWidth, y: buttonHeight },
            { 
                x: this.screenWidth / 2 - buttonWidth / 2, 
                y: this.screenHeight / 2 + 100 
            }
        );
        this.restartButton.setOnClick(() => this.onRestartClicked());

        // Menu Button
        this.menuButton = new Button(
            { x: buttonWidth, y: buttonHeight },
            { 
                x: this.screenWidth / 2 - buttonWidth / 2, 
                y: this.screenHeight / 2 + 160 
            }
        );
        this.menuButton.setOnClick(() => this.onMenuClicked());
    }

    public setScores(currentScore: number, highScore: number): void {
        this.currentScore = currentScore;
        this.highScore = highScore;
        
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
    }

    private saveHighScore(): void {
        localStorage.setItem('doodleJump_highScore', this.highScore.toString());
    }

    private loadHighScore(): number {
        const saved = localStorage.getItem('doodleJump_highScore');
        return saved ? parseInt(saved) : 0;
    }

    public Init(): void {
        this.highScore = Math.max(this.highScore, this.loadHighScore());
    }

    public update(deltaTime: number): void {
        // Update buttons
        this.restartButton.Update(deltaTime);
        this.menuButton.Update(deltaTime);
    }

    public render(renderer: Engine.IRenderer): void {
        // Render background
        if (this.backgroundImage && this.backgroundImage.complete) {
            renderer.render(this.backgroundImage, 0, 0);
        }

        renderer.fillRect(0, 0, this.screenWidth, this.screenHeight, 'rgba(0, 0, 0, 0.7)');

        const gameOverY = this.screenHeight / 2 - 150;
        renderer.drawText(
            this.gameOverText,
            this.screenWidth / 2,
            gameOverY,
            "48px Arial",
            "center",
            "white"
        );

        // Render Current Score
        const currentScoreY = this.screenHeight / 2 - 80;
        renderer.drawText(
            `Score: ${Math.floor(this.currentScore)}`,
            this.screenWidth / 2,
            currentScoreY,
            "32px Arial",
            "center",
            "yellow"
        );

        // Render High Score
        const highScoreY = this.screenHeight / 2 - 40;
        renderer.drawText(
            `Best: ${Math.floor(this.highScore)}`,
            this.screenWidth / 2,
            highScoreY,
            "28px Arial",
            "center",
            "orange"
        );

      

        this.renderSimpleButton(renderer, this.menuButton, "MENU");
    }

    private renderSimpleButton(renderer: Engine.IRenderer, button: Button, text: string): void {
        const pos = button.position;
        const size = button.size;
        
        renderer.fillRect(pos.x, pos.y, size.width, size.height, '#666666');
        
        renderer.drawRect(pos.x, pos.y, size.width, size.height);
        
        renderer.drawText(
            text,
            pos.x + size.width / 2,
            pos.y + size.height / 2 + 6,
            "16px Arial",
            "center",
            "white"
        );
    }

    private onRestartClicked(): void {
        console.log('Restart game clicked');
        SceneManager.getInstance().changeSceneByName('PlayScene')
        
    }

    private onMenuClicked(): void {
         window.location.reload()
    }

    public pause(): void {
        console.log('EndScene paused');
    }

    public resume(): void {
        console.log('EndScene resumed');
    }

    public exit(): void {
        console.log('EndScene exited');
    }
}
