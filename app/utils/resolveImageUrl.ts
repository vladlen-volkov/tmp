export function resolveImageUrl(img: HTMLImageElement, url: string): Promise<void> {
  return new Promise(resolve => {
    img.onload = () => {
      resolve();
      img.onload = null
    };
    img.src = url
  });
}
