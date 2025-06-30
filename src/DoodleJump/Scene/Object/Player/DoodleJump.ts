import { Animation } from './../../../../Engine/Component/Animation';
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { Player } from "./Player";
import { InputHandle } from "../../../../Engine/InputHandle/InputHandle";
import { IDoodleState } from "./PlayerState";

export class DoodleJump implements IDoodleState {
    private Player: Player;
    private Animation: Animation 
    private readonly SCREEN_WIDTH: number = 400;
    private readonly MOVE_SPEED: number = 300;

    constructor(player: Player) {
        this.Player = player;
        this.Animation=this.Player.getAni()
    }

    public Init(): void {
        this.setJumpTexture();
    }


    private setJumpTexture(): void {
      
        
        if (this.Animation) {
            const texture = this.Player.getIsLeft() ? 'jump-left' : 'jump-right';
            this.Animation.setTexture(ResourceManager.getInstance().getTexture(texture));
            this.Animation.setNumframe({x: 1, y: 1});
            this.Animation.setFrameTime(0);
        }
    }

    public flip(): void {
        this.setJumpTexture();
    }

    private handleInput(): void {
        const currentVelocity = this.Player.getPhysics().getVelocity();

        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: this.MOVE_SPEED, 
                y: currentVelocity.y
            });
            if (this.Animation) {
                this.Animation.setTexture(ResourceManager.getInstance().getTexture('jump-right'));
            }
        } else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -this.MOVE_SPEED, 
                y: currentVelocity.y
            });
            if (this.Animation) {
                this.Animation.setTexture(ResourceManager.getInstance().getTexture('jump-left'));
            }
        } else {
            this.Player.getPhysics().setVelocity({
                x: 0, 
                y: currentVelocity.y
            });
            this.setJumpTexture();
        }
    }  

    public Update(deltaTime: number): void {
       

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