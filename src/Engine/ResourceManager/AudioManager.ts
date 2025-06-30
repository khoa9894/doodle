export class AudioManager {
    private static instance: AudioManager;
    private audioCache: Map<string, HTMLAudioElement> = new Map();
    
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    
    public loadSound(name: string, path: string): void {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.audioCache.set(name, audio);
    }
    
    public playSound(name: string, volume: number = 1.0): void {
        const audio = this.audioCache.get(name);
        if (audio) {
            audio.currentTime = 0; // Reset về đầu
            audio.volume = volume;
            audio.play().catch(error => {
                console.error(`Error playing sound ${name}:`, error);
            });
        }
    }
    
    public stopSound(name: string): void {
        const audio = this.audioCache.get(name);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}