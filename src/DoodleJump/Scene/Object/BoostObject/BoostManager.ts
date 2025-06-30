import { BoostObject } from "./BoostObject";
import { Collision } from "../../../../Engine/ResourceManager/Collision";
import { BoostFactory } from "./BoostFactory";
import { Player } from "../Player/Player";
import { HitBox } from "../../../../Engine/Component/HitBox";
import { Platform } from "../Platform/Platform";
import { SpringObject } from "./SpringObject";

export class BoostManager {
    private boostList: BoostObject[] = [];
    
    private readonly BASE_BOOST_COUNT: number = 1;
    private readonly BASE_BOOST_SPAWN_CHANCE: number = 1;
    
    private readonly BOOST_COUNT: number;
    private readonly BOOST_SPAWN_CHANCE: number;
    
    private highestNumber: Platform;
    private player: Player;
    private collision: Collision;
    
    constructor(player: Player, collision: Collision, highestNumber: Platform) {
        this.player = player;
        this.collision = collision;
        this.highestNumber = highestNumber;
        
        
        
       
    }
    
    public createBoostOnPlatform(): void {
        if(this.boostList.length <= 0) {
            const boostX = this.highestNumber.position.x;
            const boostY = this.highestNumber.position.y; 
            const boost = BoostFactory.createRandomBoost(boostX, boostY);
            
            
            boost.attachToPlatform(this.highestNumber);
            this.addBoostToGame(boost);
        }
    }
//     public createBoostOnPlatform(): void {
//     // Kiểm tra xem có boost nào đang ở gần platform cao nhất không
//     const PROXIMITY_THRESHOLD = 50; // pixels
//     const hasNearbyBoost = this.boostList.some(boost => 
//         Math.abs(boost.position.y - this.highestNumber.position.y) < PROXIMITY_THRESHOLD
//     );
    
//     if (!hasNearbyBoost) {
//         const boostX = this.highestNumber.position.x;
//         const boostY = this.highestNumber.position.y; 
//         const boost = BoostFactory.createRandomBoost(boostX, boostY);
//         console.log('create new boost');
//         boost.attachToPlatform(this.highestNumber);
//         this.addBoostToGame(boost);
//     }
// }
    private addBoostToGame(boost: BoostObject): void {
        this.collision.addHitBox(boost.getHitBox());
        this.boostList.push(boost);
    }
    
    public update(deltaTime: number): void {
        for (const boost of this.boostList) {
            boost.Update(deltaTime);
        }
    }
    
    public moveBoostsDown(offset: number): void {
        for (const boost of this.boostList) {
            boost.position.y += offset;
            boost.getHitBox().setPosition(boost.position);
        }
    }
    public setHighest(hi:Platform):void{
        this.highestNumber=hi;
    }
    public handleBoostRecycling(): void {

        this.boostList = this.boostList.filter(boost => !this.isBoostBelowScreen(boost));
    }
    
    private isBoostBelowScreen(boost: BoostObject): boolean {
        return boost.position.y > 900;
    }
    
    public checkPlayerCollision(): boolean {
        const playerHitbox = this.player.getHitBox();
        
        for (let i = this.boostList.length - 1; i >= 0; i--) {
            const boost = this.boostList[i];
            
            if (!boost.isActivePlatform) continue;
            
            if (playerHitbox.intersects(boost.getHitBox())) {
                this.applyBoostEffect(boost);
                
                // Remove boost after collection
                this.boostList.splice(i, 1);
                
                return true;
            }
        }
        
        return false;
    }
    
    private applyBoostEffect(boost: BoostObject): void {
        const baseJumpForce = boost.onPlayerLand(this.player);
        
        
        
        const playerPhysics = this.player.getPhysics();
        if (playerPhysics) {
            playerPhysics.setVelocity(baseJumpForce);
        }
     
        console.log('Boost collected!', boost.constructor.name);
    }
    
    public render(renderer: Engine.IRenderer): void {
        for (const boost of this.boostList) {
            boost.Render(renderer);
        }
    }
    
    public reset(): void {
        this.boostList = [];
    }
    
    public getBoostCount(): number {
        return this.boostList.length;
    }
    
    public getActiveBoostCount(): number {
        return this.boostList.filter(b => b.isActivePlatform).length;
    }

   
}