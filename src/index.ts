const Compressor = (img: Blob, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    if (!img) return null

    const imgEl = document.createElement('img')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const blobURL = URL.createObjectURL(img)
    imgEl.src = blobURL

    imgEl.onload = () => {
      canvas.width = imgEl.width
      canvas.height = imgEl.height
      if (ctx) ctx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height)
      canvas.toBlob(blob => (blob ? resolve(blob) : null), 'image/jpeg', quality)
    }

    imgEl.onerror = error => reject(error)
  })

interface args {
  img: Blob
  maxSize?: number
  quality?: number
  descentIndex?: number
  onProgress?: (args: { progress: number; quality: number }) => void
}

const main = ({ img, maxSize = 2073600, quality = 1, descentIndex = 0.1, onProgress }: args): Promise<Blob> =>
  new Promise<Blob>(async (resolve, reject) => {
    quality = quality - descentIndex * quality

    try {
      var result = await Compressor(img, quality)
    } catch (error) {
      return reject(error)
    }

    if (onProgress) {
      const progress = parseInt(Math.min(100 - Math.max(((result.size - maxSize) / result.size) * 100), 100).toString())
      onProgress({ progress, quality })
    }

    if (result.size > img.size) return resolve(img)

    if (result.size > maxSize) return resolve(await main({ img, maxSize, quality, descentIndex, onProgress }))
    else return resolve(result)
  })

export default main
