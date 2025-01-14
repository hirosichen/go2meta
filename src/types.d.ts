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

// A-Frame 事件类型
interface AFrameEvent extends Event {
  detail: {
    axis: number[]
  }
}

// A-Frame 交叉点类型
interface Intersection {
  point: THREE.Vector3
  distance: number
}

// 扩展 Element 接口
interface Element {
  object3D?: any
  body?: any
  components?: {
    raycaster: {
      intersectedEls: Element[]
      getIntersection: (el: Element) => Intersection
      raycaster: THREE.Raycaster
    }
  }
  setAttribute(name: string, value: any): void
  getAttribute(name: string): {
    x: number
    y: number
    z: number
  }
  addEventListener(type: string, listener: (event: Event | AFrameEvent) => void): void
}

// A-Frame 组件类型
interface AFrameComponent {
  el: Element
  grabbed: Element | null
  grabDistance: number
  joystickValue: number
  grabOffset: THREE.Vector3 | null
  sceneDebugText?: Element
  debugVisible?: boolean
  tick?: () => void
  init?: () => void
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