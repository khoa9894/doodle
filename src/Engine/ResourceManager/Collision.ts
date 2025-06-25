export class Collision  {
    private listHitbox: Engine.IHitBox[] = [];
    constructor() {
        
    }

    public addHitBox(hitBox: Engine.IHitBox): void {
        this.listHitbox.push(hitBox);
    }
    public update(deltaTime: number): void {
        
    }

    public render(renderer: Engine.IRenderer): void {
   
    }
    public check():boolean{
        for (let i = 0; i < this.listHitbox.length; i++) {
            for (let j = i + 1; j < this.listHitbox.length; j++) {
                if (this.listHitbox[i].intersects(this.listHitbox[j])) {
                    return true;
                }
            }
        }
        return false;
    }
    
}