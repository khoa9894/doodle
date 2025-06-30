import { Platform } from "./Platform";
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Collision } from "../../../../Engine/ResourceManager/Collision";
import { PlatformFactory } from "./CreatePlatform";
import { Physic2D } from "../../../../Engine/Component/Physic2D";
import { Player } from "../Player/Player";
import { HitBox } from "../../../../Engine/Component/HitBox";
import { SpringPlatform } from "./SpringPlatform";

export class PlatformManager {
    private platformList: Platform[] = [];
    private PositionInit: IVec2[]=[]
    private PositionRecycle: IVec2[]=[]
    private highest:Platform
    private isDelete:boolean=false
    private readonly PLATFORM_COUNT: number = 10;
    private readonly PLATFORM_VERTICAL_SPACING: number = 115;
    private readonly PLATFORM_MIN_SPAWN_DISTANCE: number = 90;
    private readonly PLATFORM_MAX_SPAWN_DISTANCE: number = 150;
    private readonly SCREEN_WIDTH: number = 400;
    
    private player: Player;
    private collision: Collision;
    
    constructor(player: Player, collision: Collision) {
        this.player = player;
        this.collision = collision;
        this.initializePositionArrays();
        this.createInitialPlatforms();
    }
    
    private initializePositionArrays(): void {
        this.PositionInit = [];
        for (let i = 0; i < this.PLATFORM_COUNT; i++) {
            this.PositionInit.push({ x: 0, y: 0 });
        }
    }
    
    public createInitialPlatforms(): void {
        this.platformList = [];
        for (let i = 0; i < this.PLATFORM_COUNT; i++) {
            const platform = this.createPlatformAtIndex(i)
            this.addPlatformToGame(platform);
        }
        this.highest=this.platformList[9];
    }
    
    private createPlatformAtIndex(index: number): Platform {
         if(index==0){
            return PlatformFactory.createRandomPlatform(200,600,false)
       }
        const x = this.generateRandomX();
        const y = 600 + (index * -this.PLATFORM_VERTICAL_SPACING);
        this.PositionInit[index].x=x;
        this.PositionInit[index].y=y;
        return PlatformFactory.createRandomPlatform(x, y);
    }
    public returnPosInit():IVec2[]{
        return this.PositionInit
    }
    private generateRandomX(): number {
        return Math.random() * this.SCREEN_WIDTH;
    }
    
    private addPlatformToGame(platform: Platform): void {
        this.collision.addHitBox(platform.getHitBox());
        this.platformList.push(platform);
    }
    public deletePlatform(): void {
    const beforeCount = this.platformList.length;

    this.platformList = this.platformList.filter(
        hi => !this.isPlatformBelowScreen(hi)
    );

    const afterCount = this.platformList.length;
    this.isDelete = beforeCount > afterCount;
}

    
    public update(deltaTime: number): void {
        for (const platform of this.platformList) {
            platform.Update(deltaTime);
        }
    }
    
    public movePlatformsDown(offset: number): void {
        for (const platform of this.platformList) {
            platform.position.y += offset;
            platform.getHitBox().setPosition(platform.position);
        }
    }
    
    private isPlatformBelowScreen(platform: Platform): boolean {
        return platform.position.y > 900;
    }
    
    public SpawnPlatform():void{
        if(!this.isDelete) return;
        const x = this.generateRandomX();
        const y = 900 + (10 * -this.PLATFORM_VERTICAL_SPACING);
        const platform= PlatformFactory.createRandomPlatform(x,y);
        this.addPlatformToGame(platform);
        this.highest=platform
        this.isDelete=true;

    }
    public ReturnHighest():Platform{
     return this.highest
    }
    public checkPlayerCollision(playerPhysics: Physic2D): boolean {
        const playerHitbox = this.player.getHitBox();
        const collisionThreshold = 10;
        
        for (const platform of this.platformList) {
            if (!platform.isActivePlatform) continue;
            
            if (this.isPlayerLandingOnPlatform(playerHitbox, platform, collisionThreshold)) {
                this.handlePlayerLandingOnPlatform(platform, playerPhysics);
                return true;
            }
        }
        
        return false;
    }
   
    
   
    
    private isPlayerLandingOnPlatform(
        playerHitbox: HitBox, 
        platform: Platform, 
        threshold: number
    ): boolean {
        if (!playerHitbox.intersects(platform.getHitBox())) {
            return false;
        }
        
        const playerBottom = this.player.getPosition().y + this.player.getSize().height;
        const platformTop = platform.position.y;
        
        return Math.abs(playerBottom - platformTop) < threshold;
    }
    
    private handlePlayerLandingOnPlatform(platform: Platform, playerPhysics: Physic2D): void {
        const jumpForce = platform.onPlayerLand(this.player);
        playerPhysics.setVelocity({
            x: playerPhysics.getVelocity().x,
            y: jumpForce
        });
    }
    
    public render(renderer: Engine.IRenderer): void {
        for (const platform of this.platformList) {
            platform.Render(renderer);
        }
    }
    
    public getPlatformCount(): number {
        return this.platformList.length;
    }
    
    public getActivePlatformCount(): number {
        return this.platformList.filter(p => p.isActivePlatform).length;
    }
}