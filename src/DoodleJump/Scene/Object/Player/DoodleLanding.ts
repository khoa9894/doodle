import { Animation } from './../../../../Engine/Component/Animation'
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage'
import { Player } from "./Player"
import { InputHandle } from "../../../../Engine/InputHandle/InputHandle";
import {IDoodleState} from "./PlayerState"

export class DoodleLanding implements IDoodleState{
    private Player: Player
    private Animation: Animation | null = null;
    private readonly SIZE = { width: 40, height: 40 };
    private readonly SCREEN_WIDTH: number = 400;
    
    constructor(player:Player){
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
        this.setLandingTexture()
    }
    
    private setLandingTexture(): void {
        const animation = this.getAnimation();
        if (!animation) {
            console.warn('Animation component not available in DoodleLanding');
            return;
        }
        
        if (this.Player.getIsLeft()) {
            animation.setTexture(ResourceManager.getInstance().getTexture('touch-left'));
        } else {
            animation.setTexture(ResourceManager.getInstance().getTexture('touch-right'));
        }
        animation.setNumframe({x:1,y:1});
        animation.setFrameTime(0);
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
                x: 300, 
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('touch-right'));
            animation.setNumframe({x:1,y:1});
            animation.setFrameTime(0);   
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -300, 
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('touch-left'));
            animation.setNumframe({x:1,y:1});
            animation.setFrameTime(0);   
        } else {
            this.Player.setLeft(this.Player.getIsLeft());
            this.Player.getPhysics().setVelocity({
                x: 0, 
                y: currentVelocity.y
            });
            this.setLandingTexture();
        }
    }  
    
    public Update(deltaTime: number): void {
        if(this.Player.getVelocity().y>-500){
            this.Player.changeState(this.Player.getJumpingState())
        }
        this.handleInput();
        this.updateBoundaries();
        this.Player.getGameObject().Update(deltaTime);
        
        if(this.Player.getRocket()){
            this.Player.setRocket(false);
            this.Player.changeState(this.Player.getRocketState());
        }

        if (!this.Player.getLanding()) { 
            this.Player.changeState(this.Player.getJumpingState());
        }
    }
    
    public flip(): void {
        const animation = this.getAnimation();
        if (!animation) {
            return;
        }
        
        switch (this.Player.getIsLeft()){
            case true:
                animation.setTexture(ResourceManager.getInstance().getTexture('touch-left'));
                break;  
            case false:
                animation.setTexture(ResourceManager.getInstance().getTexture('touch-right'));
                break;   
        }
    }
    
    public Render(Renderer: Engine.IRenderer): void {
        this.Player.getGameObject().Render(Renderer);
    }
    
    private updateBoundaries(): void {
        const playerWidth = this.Player.getGameObject().size.width;
        if (this.Player.getGameObject().position.x > this.SCREEN_WIDTH + playerWidth) {
            this.setPosition(0, this.Player.getGameObject().position.y);
        } else if (this.Player.getGameObject().position.x < -playerWidth) {
            this.setPosition(this.SCREEN_WIDTH, this.Player.getGameObject().position.y);
        }
    }
    
    public setPosition(x: number, y: number): void {
        this.Player.getGameObject().position.x = x;
        this.Player.getGameObject().position.y = y;
        this.Player.getPhysics().setPosition({ x, y });
    }
    
    public resetPosition(): void {
        this.setPosition(200, 300);
        this.Player.getPhysics().setVelocity({ x: 0, y: 0 });
    }
}