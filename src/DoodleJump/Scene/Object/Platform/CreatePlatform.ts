import { Platform } from "./Platform";
import { NormalPlatform } from "./NormalPlatform";
import { SpringPlatform } from "./SpringPlatform";
import { InvisiblePlatform } from "./InvisiblePlatform";
import { MovingPlatform } from "./MovingPlatform";
import { SpringyPlatform } from "./CompositeSpring";
import {NobitaPlatform} from "./NobitaPlatform"

export type PlatformType = 'normal' | 'spring' | 'moving' | 'invi' | 'springy'|'nobita';

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
                return new NobitaPlatform(x,y);
        }
    }
    
    static createRandomPlatform(x: number, y: number, allowSpecial: boolean = true): Platform {
    if (!allowSpecial) {
        return new NormalPlatform(x, y);
    }
    
    const random = Math.random();
    // if (random < 0.40) {  // Giảm xuống 40%
    //     return new InvisiblePlatform(x, y)
           
    // } else if (random < 0.60) {  // 18% cho Spring
    //     return new SpringPlatform(x, y);
    // } else if (random < 0.75) {  // 14% cho Moving
    //     return new MovingPlatform(x, y);
    // } else if (random < 0.85) {  // 14% cho Springy
    //     return new SpringyPlatform(x, y);
    //  } else if (random < 0.92) {  // 9% cho Nobita
    //             return new NormalPlatform(x, y); 

        
    //  } else {  // 5% cho Invisible
    //              return new NobitaPlatform(x, y);

        
    // }
    if (random < 0.50) {  // 50% cho Normal Platform
        return new NormalPlatform(x, y);
    } else if (random < 0.65) {  // 15% cho Spring
        return new SpringPlatform(x, y);
    } else if (random < 0.80) {  // 15% cho Moving
        return new MovingPlatform(x, y);
    } else if (random < 0.90) {  // 10% cho Springy
        return new SpringyPlatform(x, y);
    } else {  // 10% cho Invisible
        return new InvisiblePlatform(x, y);
    }
}

}