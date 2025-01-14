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
interface AFrameEvent {
  type: string
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
interface AFrameElement extends Element {
  object3D: THREE.Object3D
  body?: any
  components: {
    raycaster: {
      intersectedEls: AFrameElement[]
      getIntersection: (el: AFrameElement) => Intersection | undefined
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
  el: AFrameElement
  grabbed: AFrameElement | null
  grabDistance: number
  joystickValue: number
  grabOffset: THREE.Vector3 | null
  sceneDebugText?: AFrameElement
  debugVisible?: boolean
  tick?: () => void
  init?: () => void
}

// 扩展 Document 接口
interface Document {
  querySelector(selectors: string): AFrameElement | null
  querySelectorAll(selectors: string): NodeListOf<AFrameElement>
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