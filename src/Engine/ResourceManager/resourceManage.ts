export class ResourceManager {
    private static instance: ResourceManager;
    private path_name: string;
    private texture_path: string;
    private map_texture: Map<string, HTMLImageElement>;

    private constructor() {
        this.path_name = "assets/images/";
        this.texture_path = this.path_name ;
        this.map_texture = new Map();
    }

    public static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    public addTexture(name: string): void {
        if (this.map_texture.has(name)) return;
        const img = new Image();
        img.src = this.texture_path + name + ".png";
        this.map_texture.set(name, img);
    }

    public getTexture(name: string): HTMLImageElement {
        let texture = this.map_texture.get(name);
        if (texture) return texture;
        texture = new Image();
        texture.src = this.texture_path + name + ".png";
        this.map_texture.set(name, texture);
        return texture;
    }
}

