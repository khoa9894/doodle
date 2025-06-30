import { Platform } from "./Platform";
import { NormalPlatform } from "./NormalPlatform";
import { SpringPlatform } from "./SpringPlatform";
import { InvisiblePlatform } from "./InvisiblePlatform";
import { MovingPlatform } from "./MovingPlatform";


export type PlatformType = 'normal' | 'spring' | 'moving' | 'invi' ;

export class PlatformFactory {
    // static createPlatform(type: PlatformType, x: number, y: number): Platform {
    //     switch (type) {
    //         case 'normal':
    //             return new NormalPlatform(x, y);
    //         case 'spring':
    //             return new SpringPlatform(x, y);
    //         case 'moving':
    //             return new MovingPlatform(x, y);
    //         case 'invi':
    //             return new InvisiblePlatform(x, y);
    //         case 'springy':
    //             return new SpringyPlatform(x, y);
    //         default:
    //             return new NobitaPlatform(x,y);
    //     }
    // }
    
    static createRandomPlatform(x: number, y: number, allowSpecial: boolean = true): Platform {
        console.log('conca',x,y)
    if (!allowSpecial) {
        return new NormalPlatform(x, y);
    }
   // return new NormalPlatform(x, y);
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

        
    
    if (random < 0.70) {  // 70% cho Normal Platform
                //console.log('nor', x, y)

        return new NormalPlatform(x, y);
    } else if (random < 0.85) {  // 15% cho Spring Platform (tăng tốc độ nhảy)
     //   console.log('sp', x, y)
        return new SpringPlatform(x, y);
    } else if (random < 0.95) {  // 10% cho Moving Platform (khó hơn)
      //  console.log('concho', x, y)
        return new MovingPlatform(x, y);
    } else {  // 5% cho Invisible Platform (khó nhất)
       // console.log('hehe', x, y)
        return new InvisiblePlatform(x, y);
    }
}

}