export interface Dot {
    id: string;
    x: number;
    y: number;
}

export interface Bloom {
    id: number;
    x: number;
    y: number;
    visualSize: number; 
    blobShape: string; 
    color: string;
    isFadingOut?: boolean;
    dots: Dot[];
}