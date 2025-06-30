import { BoostObject } from "./BoostObject";
import { RocketObject } from "./RocketObject";
import { SpringObject } from "./SpringObject";

export type BoostType = 'spring' | 'rocket' | 'jetpack' | 'shield';

export class BoostFactory {
    static createRandomBoost(x: number, y: number): BoostObject {
        const random = Math.random();
        
         if (random < 0.6) {  
                     return new SpringObject(x, y,{x:0,y:-1000},77,32);
         }
         else{
                   return new RocketObject(x, y,{x:0,y:-1500},77,50);

         }
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // } else if (random < 0.85) {  // 15% cho Rocket (cần implement)
        //     // return new RocketObject(x, y);
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // } else if (random < 0.95) {  // 10% cho Jetpack (cần implement)
        //     // return new JetpackObject(x, y);
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // } else {  // 5% cho Shield (cần implement)
        //     // return new ShieldObject(x, y);
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // }
    }
    
    // static createBoostByType(type: BoostType, x: number, y: number): BoostObject {
    //     switch (type) {
    //         case 'spring':
    //             return new SpringObject(x, y,{x:200,y:-1000},80,130);
    //         case 'rocket':
    //             // return new RocketObject(x, y);
    //             return new SpringObject(x, y,{x:200,y:-1000},80,130);
    //         case 'jetpack':
    //             // return new JetpackObject(x, y);
    //             return new SpringObject(x, y,{x:200,y:-1000},80,130);
    //         case 'shield':
    //             // return new ShieldObject(x, y);
    //             return new SpringObject(x, y,{x:200,y:-1000},80,130);
    //         default:
    //             return new SpringObject(x, y,{x:200,y:-1000},80,130);
    //     }
    // }
}