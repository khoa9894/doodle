import { Platform } from "./Platform";
import { NormalPlatform } from "./NormalPlatform";
import { SpringPlatform } from "./SpringPlatform";
import { InvisiblePlatform } from "./InvisiblePlatform";
import { MovingPlatform } from "./MovingPlatform";
import { SpringyPlatform } from "./CompositeSpring";

export type PlatformType = 'normal' | 'spring' | 'moving' | 'invi' | 'springy';

export class PlatformFactory {
    static createPlatform(type: PlatformType, x: number, y: number): Platform {
        switch (type) {
            case 'normal':
                return new NormalPlatform(x, y);
            case 'spring':
                return new SpringPlatform(x, y);
            case 'moving':
                return new MovingPlatform(x, y);
            case 'invi':
                return new InvisiblePlatform(x, y);
            case 'springy':
                return new SpringyPlatform(x, y);
            default:
                throw new Error(`Unknown platform type: ${type}`);
        }
    }
    
    static createRandomPlatform(x: number, y: number, allowSpecial: boolean = true): Platform {
        if (!allowSpecial) {
            return new NormalPlatform(x, y);
        }
        
        const random = Math.random();
        if (random < 0.45) {
            return new NormalPlatform(x, y);
        } else if (random < 0.65) {
            return new SpringPlatform(x, y);
        } else if (random < 0.80) {
            return new MovingPlatform(x, y);
        } else if (random < 0.95) {
            return new SpringyPlatform(x, y);
            
        } else {
            return new InvisiblePlatform(x, y);
            
        }
         
    }
}