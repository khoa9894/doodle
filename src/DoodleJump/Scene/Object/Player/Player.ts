import { HitBox } from './../../../../Engine/Component/HitBox';
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Animation } from "../../../../Engine/Component/Animation";
import { Physic2D } from "../../../../Engine/Component/Physic2D";
import { AudioManager } from '../../../../Engine/ResourceManager/AudioManager';
import { IDoodleState } from './PlayerState';
import { DoodleJump } from './DoodleJump';
import { DoodleLanding } from './DoodleLanding';
import { DoodleRocket } from './DoodleRocket';
import { DoodleSpring } from './DoodleSpring';

export class Player {
    private gameObject: GameObject;
    private isLanding: boolean = false;
    private isString: boolean = false;
    private isRocketActive: boolean = false;
    private current_state: IDoodleState;
    private JumpingState: DoodleJump;
    private SpringState: DoodleSpring;
    private LandingState: DoodleLanding;
    private RocketState: DoodleRocket;
    private HitBox: HitBox;
    private physics: Physic2D;
    private Animation: Animation;
    private readonly FIXED_Y: number = 300;
    private readonly SIZE = { width: 40, height: 40 };
    private isLeft: boolean = false;

    constructor() {
        this.gameObject = new GameObject(
            { x: 200, y: this.FIXED_Y }, 
            this.SIZE
        );
        this.Animation = new Animation();
        this.HitBox = new HitBox({x: 200, y: this.FIXED_Y}, this.SIZE.width, this.SIZE.height);        
        this.physics = new Physic2D(
            { x: 200, y: this.FIXED_Y }, 
            this.gameObject
        );
        
        this.gameObject.AddComponent(this.Animation);
        this.gameObject.AddComponent(this.HitBox);
        this.gameObject.AddComponent(this.physics);
        
            this.JumpingState = new DoodleJump(this);
            this.LandingState = new DoodleLanding(this);
            this.SpringState = new DoodleSpring(this);
            this.RocketState = new DoodleRocket(this);
      
    }

    public Init(): void {
        console.log('duma');
        this.JumpingState.Init();
        this.LandingState.Init();
        this.SpringState.Init();
        this.current_state = this.JumpingState;
        console.log('ditme');
    }

    public changeState(newState: IDoodleState): void {
        this.current_state = newState;
        this.current_state.Init();
    }

    public update(deltaTime: number): void {
        const velocity = this.getVelocity();
        
        if(velocity.y > -500){
            
            this.getGameObject().activeHitbox(true);
            this.changeState(this.JumpingState);
        }
        else{
            if (velocity.y === -500) {
                this.changeState(this.LandingState);
            }
            else if(velocity.y === -1500 ){
                console.log('Switching to SpringState - hello');
                this.changeState(this.RocketState);
            }
            else if(velocity.y === -1000){
                this.changeState(this.SpringState);
            }
        }
        
        this.current_state.Update(deltaTime);
    }

    public render(renderer: Engine.IRenderer): void {
        this.current_state.Render(renderer);
    }

    // Getters
    public getIsLeft(): boolean { return this.isLeft; }
    public getLanding(): boolean { return this.isLanding; }
    public getString(): boolean { return this.isString; }
    public getRocket(): boolean { return this.isRocketActive; }
    public getGameObject(): GameObject { return this.gameObject; }
    public getPhysics(): Physic2D { return this.physics; }
    public getHitBox(): HitBox { return this.HitBox; }
    public getPosition(): { x: number; y: number } { return this.gameObject.position; }
    public getSize(): { width: number; height: number } { return this.gameObject.size; }
    public getVelocity(): IVec2 { return this.physics.getVelocity(); }

    public getJumpingState(): IDoodleState { return this.JumpingState; }
    public getLandingState(): IDoodleState { return this.LandingState; }
    public getStringState(): DoodleSpring { return this.SpringState; }
    public getRocketState(): IDoodleState { return this.RocketState; }

    public setLeft(value: boolean): void { this.isLeft = value; }
    public setLanding(value: boolean): void { this.isLanding = value; }
    public setString(value: boolean): void { this.isString = value; }
    public setRocket(value: boolean): void { this.isRocketActive = value; }

    public setPosition(x: number, y: number): void {
        this.gameObject.position.x = x;
        this.gameObject.position.y = y;
        this.physics.setPosition({ x, y });
    }

    public resetPosition(): void {
        this.setPosition(200, 300);
        this.physics.setVelocity({ x: 0, y: 0 });
    }
}