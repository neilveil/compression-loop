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
  maxSize: number
  quality?: number
  descentIndex?: number
  onProgress?: (args: { progress: number; quality: number; img: Blob }) => void | boolean
  maxIterations?: number
  timeout?: number // In seconds
}

type result = {
  status:
    | 'success'
    | 'compression-error'
    | 'already-compressed'
    | 'stopped'
    | 'max-compression-reached'
    | 'time-out'
    | 'max-iterations-exceeded'
  compressedImg?: Blob
}

const main = ({
  img,
  maxSize,
  quality = 1,
  descentIndex = 0.1,
  onProgress = () => false,
  maxIterations,
  timeout
}: args) =>
  new Promise<result>(async resolve => {
    maxIterations = maxIterations || Number.MAX_SAFE_INTEGER
    timeout = (timeout || Number.MAX_SAFE_INTEGER / 1000) * 1000

    let result,
      iterations = 0,
      lastSize = 0

    const startTime = Date.now()

    do {
      // Decrement quality
      quality = quality - descentIndex * quality

      try {
        result = await Compressor(img, quality)
      } catch (error) {
        return resolve({ status: 'compression-error' })
      }

      if (onProgress) {
        const progress = parseFloat(
          Math.min(100 - (Math.abs(maxSize - result.size) / Math.abs(maxSize - img.size)) * 100, 100).toFixed(2)
        )

        const stopped = onProgress({ progress, quality: parseFloat(quality.toFixed(10)), img: result })

        // If stopped
        if (stopped) return resolve({ status: 'stopped' })
      }

      // Already compressed
      if (result.size >= img.size)
        return resolve({
          status: result.size > maxSize ? 'already-compressed' : 'success',
          compressedImg: img // As source image is smally than the result image
        })

      if (result.size > maxSize) {
        // If no improvement
        if (result.size === lastSize) return resolve({ status: 'max-compression-reached' })
        lastSize = result.size

        // Check max iteration
        if (maxIterations <= ++iterations) return resolve({ status: 'max-iterations-exceeded' })

        // Check timeout
        if (Date.now() - startTime > timeout) return resolve({ status: 'time-out' })
      } else return resolve({ status: 'success', compressedImg: result })
    } while (img.size > result.size)
  })

export default main
