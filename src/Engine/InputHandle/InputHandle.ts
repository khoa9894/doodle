export class InputHandle {
    private static keys: Set<string> = new Set();
    private static mouse: IVec2 = { x: 0, y: 0 };
    private static mouseDown: boolean = false;
    private static canvas: HTMLCanvasElement | null = null;

    public static initialize(canvas: HTMLCanvasElement) {
            InputHandle.canvas = canvas;
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                InputHandle.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            });
            canvas.addEventListener('mousedown', () => {
                InputHandle.mouseDown = true;
            });
            canvas.addEventListener('mouseup', () => {
                InputHandle.mouseDown = false;
            });
        
        window.addEventListener('keydown', (e) => {
            InputHandle.keys.add(e.key.toLowerCase());
        });
        window.addEventListener('keyup', (e) => {
            InputHandle.keys.delete(e.key.toLowerCase());
        });
    }

    public static isKeyDown(key: string): boolean {
        return InputHandle.keys.has(key.toLowerCase());
    }

    public static getMouse(): IVec2 {
        return InputHandle.mouse ;
    }

    public static isMouseDown(): boolean {
        return InputHandle.mouseDown;
    }
}


