import { Animation } from './../../../../Engine/Component/Animation';
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { Player } from "./Player";
import { InputHandle } from "../../../../Engine/InputHandle/InputHandle";
import { IDoodleState } from "./PlayerState";

export class DoodleSpring implements IDoodleState {
    private Player: Player;
    private Animation: Animation | null = null;
    private readonly SCREEN_WIDTH: number = 400;
    private readonly MOVE_SPEED: number = 300;
    private readonly SPRING_VELOCITY_THRESHOLD: number = -1000; // Spring effect threshold
    
    constructor(player: Player) {
        this.Player = player;
        // Don't get Animation in constructor, get it when needed
    }
    
    private getAnimation(): Animation | null {
        if (!this.Animation) {
            this.Animation = this.Player.getGameObject().getAnimation() as Animation;
        }
        return this.Animation;
    }
    
    public Init(): void {
        console.log('g')
        this.setJumpTexture();
        // Reset spring flag after initialization
        this.Player.setString(false);
    }
    
    private setJumpTexture(): void {
        const animation = this.getAnimation();
        if (!animation) {
            console.warn('Animation component not available in DoodleSpring');
            return;
        }
        
        const texture = this.Player.getIsLeft() ? 'jump-left' : 'jump-right';
        animation.setTexture(ResourceManager.getInstance().getTexture(texture));
        animation.setNumframe({x: 1, y: 1});
        animation.setFrameTime(0);
    }
    
    public flip(): void {
        this.setJumpTexture();
    }
    
    private handleInput(): void {
        const currentVelocity = this.Player.getPhysics().getVelocity();
        const animation = this.getAnimation();
        
        if (!animation) {
            return;
        }
        
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: this.MOVE_SPEED, 
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('jump-right'));
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -this.MOVE_SPEED, 
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('jump-left'));
        } else {
            this.Player.getPhysics().setVelocity({
                x: 0, 
                y: currentVelocity.y
            });
            this.setJumpTexture();
        }
    }  
    
    public Update(deltaTime: number): void {
        this.Player.getGameObject().activeHitbox(false);
        
        this.updateBoundaries();
        this.handleInput();
        this.Player.getGameObject().Update(deltaTime);
    }
    
    public Render(Renderer: Engine.IRenderer): void {
        this.Player.getGameObject().Render(Renderer);
    }
    
    private updateBoundaries(): void {
        const playerWidth = this.Player.getGameObject().size.width;
        const position = this.Player.getGameObject().position;
        
        if (position.x > this.SCREEN_WIDTH + playerWidth) {
            this.Player.setPosition(0, position.y);
        } else if (position.x < -playerWidth) {
            this.Player.setPosition(this.SCREEN_WIDTH, position.y);
        }
    }
}