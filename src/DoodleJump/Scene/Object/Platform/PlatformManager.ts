import { Platform } from "./Platform";
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Collision } from "../../../../Engine/ResourceManager/Collision";
import { PlatformFactory } from "./CreatePlatform";
import { SpringyPlatform } from "./CompositeSpring";
import { Physic2D } from "../../../../Engine/Component/Physic2D";
import { NobitaPlatform } from "./NobitaPlatform";
export class PlatformManager {
    private platformList: Platform[] = [];
    private readonly PLATFORM_COUNT: number = 10;
    private readonly PLATFORM_VERTICAL_SPACING: number = 100;
    private readonly PLATFORM_MIN_SPAWN_DISTANCE: number = 90;
    private readonly PLATFORM_MAX_SPAWN_DISTANCE: number = 150;
    private readonly SCREEN_WIDTH: number = 400;
    
    private player: GameObject;
    private collision: Collision;
    
    constructor(player: GameObject, collision: Collision) {
        this.player = player;
        this.collision = collision;
        this.createInitialPlatforms();
    }
    
    private createInitialPlatforms(): void {
        this.platformList = [];
        
        for (let i = 0; i < this.PLATFORM_COUNT; i++) {
            const platform = this.createPlatformAtIndex(i);
            this.addPlatformToGame(platform);
        }
    }
    
    private createPlatformAtIndex(index: number): Platform {
        const x = this.generateRandomX();
        const y = 900 + (index * -this.PLATFORM_VERTICAL_SPACING);
        
        const allowSpecialPlatforms = index > 2;
        
        return PlatformFactory.createRandomPlatform(x, y, allowSpecialPlatforms);
    }
    
    private generateRandomX(): number {
        return Math.random() * this.SCREEN_WIDTH;
    }
    
    private addPlatformToGame(platform: Platform): void {
        if (platform instanceof SpringyPlatform) {
            this.collision.addHitBox(platform.getSpringHitBox());
        }
        this.collision.addHitBox(platform.hitbox);
        this.platformList.push(platform);
    }
    
    public update(deltaTime: number): void {
        for (const platform of this.platformList) {
            platform.Update(deltaTime);
        }
    }
    
    public movePlatformsDown(offset: number): void {
        for (const platform of this.platformList) {
            platform.position.y += offset;
            platform.hitbox.setPosition(platform.position);
        }
    }
    
    public handlePlatformRecycling(): void {
        const highestPlatformY = this.getHighestPlatformY();
        
        for (const platform of this.platformList) {
            if (this.isPlatformBelowScreen(platform)) {
                this.recyclePlatform(platform, highestPlatformY);
            }
        }
    }
    
    private getHighestPlatformY(): number {
        return Math.min(...this.platformList.map(p => p.position.y));
    }
    
    private isPlatformBelowScreen(platform: Platform): boolean {
        return platform.position.y > 900;
    }
    
    private recyclePlatform(platform: Platform, highestY: number): void {
        const newX = this.generateRandomX();
        const newY = highestY - this.getRandomSpawnDistance();
        platform.resetPosition(newX, newY);
        platform.onReset()
    }
    
    private getRandomSpawnDistance(): number {
        return this.PLATFORM_MIN_SPAWN_DISTANCE + 
               Math.random() * (this.PLATFORM_MAX_SPAWN_DISTANCE - this.PLATFORM_MIN_SPAWN_DISTANCE)-20;
    }
    

public checkPlayerCollision(playerPhysics: Physic2D): boolean {
    const playerHitbox = this.player.hitbox;
    const collisionThreshold = 10;
    
    for (const platform of this.platformList) {
        if (!platform.isActivePlatform) continue;
        
        if (platform instanceof NobitaPlatform) {
            if (platform.checkSpringCollision(this.player)) {
                this.handlePlayerLandingOnPlatform(platform, playerPhysics);
                return true;
            }
        }
        
        if (platform instanceof SpringyPlatform) {
            if (this.checkSpringyPlatformCollision(platform, playerPhysics)) {
                return true;
            }
        }
        
        if (this.isPlayerLandingOnPlatform(playerHitbox, platform, collisionThreshold)) {
            this.handlePlayerLandingOnPlatform(platform, playerPhysics);
            return true;
        }
    }
    
    return false;
}
    
    private checkSpringyPlatformCollision(springyPlatform: SpringyPlatform, playerPhysics: Physic2D): boolean {
        const playerHitbox = this.player.hitbox;
        const collisionThreshold = 10;
        
        if (springyPlatform.checkSpringCollision(this.player)) {
            this.handlePlayerLandingOnPlatform(springyPlatform, playerPhysics);
            return true;
        }
        
        if (this.isPlayerLandingOnPlatform(playerHitbox, springyPlatform, collisionThreshold)) {
            this.handlePlayerLandingOnPlatform(springyPlatform, playerPhysics);
            return true;
        }
        
        return false;
    }
    
    private isPlayerLandingOnPlatform(
        playerHitbox: any, 
        platform: Platform, 
        threshold: number
    ): boolean {
        if (!playerHitbox.intersects(platform.hitbox)) {
            return false;
        }
        
        const playerBottom = this.player.position.y + this.player.size.height;
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
    
    public reset(): void {
        for (let i = 0; i < this.platformList.length; i++) {
            const newX = this.generateRandomX();
            const newY = 600 + (i * -this.PLATFORM_VERTICAL_SPACING);
            this.platformList[i].resetPosition(newX, newY);
            this.platformList[i].onReset();
        }
    }
    
    public getPlatformCount(): number {
        return this.platformList.length;
    }
    
    public getActivePlatformCount(): number {
        return this.platformList.filter(p => p.isActivePlatform).length;
    }
}