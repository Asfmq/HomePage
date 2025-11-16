export default defineNuxtPlugin(() => {
  // 加载SVG图标
  const loadSVGIcons = () => {
    return new Promise<void>((resolve, reject) => {
      // 检查是否已经存在SVG元素
      if (document.querySelector('svg[style*="position: absolute"]')) {
        resolve()
        return
      }

      // 直接加载SVG文件并注入到DOM中
      fetch('/icons.svg')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch SVG icons: ${response.status}`)
          }
          return response.text()
        })
        .then(svgContent => {
          // 创建一个临时的div来解析SVG内容
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = svgContent

          // 将SVG元素移动到body中
          const svgElement = tempDiv.querySelector('svg')
          if (svgElement) {
            document.body.insertBefore(svgElement, document.body.firstChild)
            console.log('SVG icons loaded successfully')
            resolve()
          } else {
            reject(new Error('No SVG element found in the loaded content'))
          }
        })
        .catch(error => {
          console.error('Failed to load SVG icons:', error)
          reject(error)
        })
    })
  }

  // 在客户端立即加载SVG图标
  if (typeof window !== 'undefined') {
    loadSVGIcons().catch(console.error)
  }
})