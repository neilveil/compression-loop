interface args {
    img: Blob;
    maxSize?: number;
    quality?: number;
    descentIndex?: number;
    onProgress?: (args: {
        progress: number;
        quality: number;
    }) => void;
}
declare const main: ({ img, maxSize, quality, descentIndex, onProgress }: args) => Promise<Blob>;
export default main;
