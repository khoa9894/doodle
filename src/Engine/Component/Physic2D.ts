import { GameObject } from './../GameObject/GameObject';
import { HitBox } from './HitBox';
import { Component } from './Component';

export class Physic2D extends Component implements Engine.IPhysic2D{
    private velocity: IVec2;
    private acceleration: IVec2;
    private GameObject: Engine.IGameObject
    private position: IVec2;
    private gravity: number; 
    private useGravity: boolean;
    private reverseGravity: boolean=false;
    private totalTime: number = 0;
    private startY: number;
    private startX: number;

    constructor(
        position: IVec2,
        GameObject: Engine.IGameObject,
        velocity = { x: 0, y: 0 },
        acceleration = { x: 0, y: 0 },
        gravity = 980, 
        useGravity = true,
      //  reverseGravity=false,

    ) {
        super();
        
        this.GameObject = GameObject;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.gravity = gravity;
        this.useGravity = useGravity;
        this.startY = position.y;
        this.startX = position.x;
        
    }

    public Init(): void {
    }
    public setReverse(hi:boolean):void{
        this.reverseGravity=hi
    }
    public update(deltaTime: number): void {
        if(!this.reverseGravity){
    this.velocity.y += this.gravity * deltaTime;  
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.GameObject.setPosition(this.position);}
       else{
         this.velocity.y += this.gravity * deltaTime;  
         this.position.x += this.velocity.x * deltaTime;
         this.position.y -= this.velocity.y * deltaTime;
       }
}
    public render(): void {
    }
    public getVelocity(): IVec2{
        return this.velocity
    }
    public getPosition() {
        return this.position;
    }
    public setPosition(pos: IVec2) {
        this.position = pos;
    }
    public setVelocity(vel: IVec2) {
        this.velocity = vel;
    }
    public setAcceleration(acc: IVec2) {
        this.acceleration = acc;
    }
    public setGravity(g: number) {
        this.gravity = g;
    }
    public enableGravity(enable: boolean) {
        this.useGravity = enable;
    }
    public addForce(force: IVec2) {
        this.velocity.x += force.x;
        this.velocity.y += force.y;
    }
   
}