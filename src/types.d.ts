declare module 'aframe'
declare module 'aframe-extras'
declare module 'aframe-physics-system'
declare module '*.glb'

// 扩展 Window 接口
declare global {
  const AFRAME: any
  interface Window {
    AFRAME: any
  }
}

// 扩展 Element 接口
interface Element {
  object3D?: any
  body?: any
  components?: any
  setAttribute(name: string, value: any): void
  getAttribute(name: string): {
    x: number
    y: number
    z: number
  }
}

// A-Frame 组件类型
interface AFrameComponent {
  el: Element
  grabbed: any
  grabDistance: number
  joystickValue: number
  grabOffset: any
  tick?: () => void
  init?: () => void
}

// A-Frame 事件类型
interface AFrameEvent {
  detail: {
    axis: number[]
  }
}

// 扩展 JSX 命名空间
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any
    'a-entity': any
    'a-box': any
    'a-sphere': any
    'a-cylinder': any
    'a-plane': any
    'a-text': any
    'a-sky': any
    'a-ring': any
    'a-gltf-model': any
  }
} 