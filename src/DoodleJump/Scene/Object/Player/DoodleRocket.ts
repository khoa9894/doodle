import { Physic2D } from './../../../../Engine/Component/Physic2D';
import { Animation } from './../../../../Engine/Component/Animation'
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage'
import { Player } from "./Player"
import { InputHandle } from "../../../../Engine/InputHandle/InputHandle";
import { DoodleLanding } from './DoodleLanding';
import {IDoodleState} from "./PlayerState"

export class DoodleRocket implements IDoodleState{
    private Player: Player
    private Animation: Animation
    private readonly SCREEN_WIDTH: number = 400;
    private animationSetup: boolean = false;
    private rocketTimer: number = 0;
    private readonly ROCKET_DURATION: number = 1; 
    
    constructor(player:Player){
        this.Player = player;
        this.Animation=this.Player.getAni()
    }
    
    
    public Init(): void {
        this.setupRocketAnimation();
        this.animationSetup = true;
        this.rocketTimer = 0; 
    }
    
    private setupRocketAnimation(): void {
        const animation = this.Animation;
        if (!animation) {
            console.warn('Animation component not available in DoodleRocket');
            return;
        }
        
        animation.setTexture(ResourceManager.getInstance().getTexture('rocket'));
        animation.setNumframe({x:3, y:3});
        animation.setFrameTime(0.1);
    }
    
    private handleInput(): void {
        const currentVelocity = this.Player.getPhysics().getVelocity();
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: 300, 
                y: currentVelocity.y
            });
            console.log('Rocket moving right');
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -300, 
                y: currentVelocity.y
            });
        } else {
            this.Player.setLeft(this.Player.getIsLeft());
            this.Player.getPhysics().setVelocity({
                x: 0, 
                y: currentVelocity.y
            });
        }
    }
    
    public Update(deltaTime: number): void {
        if (!this.animationSetup) {
            this.setupRocketAnimation();
            this.animationSetup = true;
            this.rocketTimer = 0;
        }
        
        this.Player.getGameObject().activeHitbox(false);
        
        this.rocketTimer += deltaTime;
        
        this.updateBoundaries();
        this.handleInput();
        this.Player.getGameObject().Update(deltaTime);
        
        this.checkStateTransition();
    }
    
    private checkStateTransition(): void {
        if (this.rocketTimer >= this.ROCKET_DURATION) {
            this.Player.getGameObject().activeHitbox(true); 
            this.Player.setRocket(false); 
            
            this.animationSetup = false; 
            this.rocketTimer = 0; // Reset timer
            if(this.Player.getLanding())
                this.Player.changeState(this.Player.getLandingState());
            else{
            this.Player.changeState(this.Player.getJumpingState());}
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