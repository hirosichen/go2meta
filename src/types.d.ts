declare module 'aframe'
declare module 'aframe-extras'
declare module 'aframe-physics-system'
declare module '*.glb'

// 扩展 Window 接口
declare global {
  interface Window {
    AFRAME: any
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