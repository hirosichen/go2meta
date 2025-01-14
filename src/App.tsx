import { useEffect, useState } from 'react'
import * as THREE from 'three'

function App() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const loadAFrame = async () => {
      if (typeof window !== 'undefined') {
        await import('aframe')
        await import('aframe-extras')
        const physics = await import('aframe-physics-system')
        
        if (window.AFRAME && !window.AFRAME.components['grab-handler']) {
          window.AFRAME.registerComponent('grab-handler', {
            init: function(this: AFrameComponent) {
              const el = this.el
              this.grabbed = null
              const debugText = document.querySelector('#debugText') as Element
              this.grabDistance = 2
              this.joystickValue = 0
              
              this.el.addEventListener('triggerdown', (e) => {
                debugText.setAttribute('value', 'Trigger pressed')
                const intersectedEls = el.components.raycaster.intersectedEls
                if (intersectedEls && intersectedEls.length > 0) {
                  const grabbable = intersectedEls[0]
                  
                  if (grabbable.classList.contains('grabbable')) {
                    this.grabbed = grabbable
                    
                    if (grabbable.body) {
                      grabbable.body.sleep()
                    }
                    
                    const intersection = el.components.raycaster.getIntersection(grabbable)
                    if (intersection) {
                      const controllerPos = new THREE.Vector3()
                      el.object3D.getWorldPosition(controllerPos)
                      this.grabDistance = intersection.distance
                      
                      const objectWorldPos = new THREE.Vector3()
                      grabbable.object3D.getWorldPosition(objectWorldPos)
                      this.grabOffset = new THREE.Vector3().subVectors(
                        intersection.point,
                        objectWorldPos
                      )
                    }
                    
                    debugText.setAttribute('value', `Grabbed at distance: ${this.grabDistance.toFixed(2)}m`)
                  }
                }
              })
              
              this.el.addEventListener('axismove', (e) => {
                const axes = e.detail.axis
                this.joystickValue = axes[3]
              })
              
              this.el.addEventListener('triggerup', (e) => {
                if (this.grabbed) {
                  if (this.grabbed.body) {
                    this.grabbed.body.wakeUp()
                  }
                  
                  document.querySelector('a-scene').object3D.attach(this.grabbed.object3D)
                  this.grabbed = null
                  this.grabOffset = null
                }
              })
            },
            
            tick: function(this: AFrameComponent) {
              if (this.grabbed) {
                if (Math.abs(this.joystickValue) > 0.1) {
                  this.grabDistance -= this.joystickValue * 0.1
                  this.grabDistance = Math.max(0.5, Math.min(10, this.grabDistance))
                }
                
                const controllerPos = new THREE.Vector3()
                this.el.object3D.getWorldPosition(controllerPos)

                // 使用 raycaster 的方向而不是手動計算
                const raycaster = this.el.components.raycaster.raycaster
                const targetPos = controllerPos.clone().add(
                  raycaster.ray.direction.clone().multiplyScalar(this.grabDistance)
                )

                if (this.grabOffset) {
                  const offsetDir = this.grabOffset.clone()
                  offsetDir.applyQuaternion(this.el.object3D.quaternion)
                  targetPos.sub(offsetDir)
                }

                if (this.grabbed.body) {
                  this.grabbed.body.position.copy(targetPos)
                  this.grabbed.body.velocity.set(0, 0, 0)
                  this.grabbed.body.angularVelocity.set(0, 0, 0)
                } else {
                  this.grabbed.object3D.position.copy(targetPos)
                }
                
                const currentRotation = this.grabbed.getAttribute('rotation')
                this.grabbed.object3D.rotation.set(
                  THREE.MathUtils.degToRad(currentRotation.x),
                  THREE.MathUtils.degToRad(currentRotation.y),
                  THREE.MathUtils.degToRad(currentRotation.z)
                )
              }
            }
          })

          if (!AFRAME.components['scene-debug']) {
            AFRAME.registerComponent('scene-debug', {
              init: function() {
                this.sceneDebugText = document.querySelector('#sceneDebugText')
                this.tick = this.tick.bind(this)
              },
              
              tick: function() {
                const grabbables = document.querySelectorAll('.grabbable')
                let debugInfo = 'Scene Objects:\n'
                
                grabbables.forEach((obj, index) => {
                  const pos = obj.getAttribute('position')
                  const rot = obj.getAttribute('rotation')
                  debugInfo += `${index + 1}. ${obj.tagName} - ` +
                    `Pos(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}) ` +
                    `Rot(${rot.x.toFixed(2)}, ${rot.y.toFixed(2)}, ${rot.z.toFixed(2)})\n`
                })
                
                this.sceneDebugText.setAttribute('value', debugInfo)
              }
            })
          }

          if (!AFRAME.components['debug-toggle']) {
            AFRAME.registerComponent('debug-toggle', {
              init: function() {
                this.debugVisible = false
                const debugEntities = document.querySelectorAll('.debug-text')
                
                debugEntities.forEach(entity => {
                  entity.setAttribute('visible', false)
                })
                
                document.querySelector('#leftHand').addEventListener('xbuttondown', () => {
                  this.debugVisible = !this.debugVisible
                  debugEntities.forEach(entity => {
                    entity.setAttribute('visible', this.debugVisible)
                  })
                })
              }
            })
          }

          if (!AFRAME.components['teleport-debug']) {
            AFRAME.registerComponent('teleport-debug', {
              init: function() {
                const debugText = document.querySelector('#debugText')
                const leftHand = document.querySelector('#leftHand')
                const cameraRig = document.querySelector('#cameraRig')
                const teleportIndicator = document.querySelector('#teleportIndicator')
                let intersectionPoint = null
                
                leftHand.addEventListener('triggerdown', () => {
                  debugText.setAttribute('value', 'Left Trigger Pressed')
                })
                
                leftHand.addEventListener('triggerup', () => {
                  debugText.setAttribute('value', 'Left Trigger Released')
                  if (intersectionPoint) {
                    cameraRig.setAttribute('position', {
                      x: intersectionPoint.x,
                      y: intersectionPoint.y,
                      z: intersectionPoint.z
                    })
                    debugText.setAttribute('value', 'Teleported!')
                    teleportIndicator.setAttribute('visible', false)
                  }
                })
                
                this.tick = () => {
                  const teleportables = document.querySelectorAll('.teleportable')
                  let closestIntersection = null
                  let minDistance = Infinity

                  teleportables.forEach(teleportable => {
                    const intersection = leftHand.components.raycaster.getIntersection(teleportable)
                    if (intersection) {
                      const distance = intersection.distance
                      if (distance < minDistance) {
                        minDistance = distance
                        closestIntersection = intersection
                      }
                    }
                  })

                  if (closestIntersection) {
                    intersectionPoint = closestIntersection.point
                    teleportIndicator.setAttribute('visible', true)
                    teleportIndicator.setAttribute('position', {
                      x: intersectionPoint.x,
                      y: intersectionPoint.y + 0.01,
                      z: intersectionPoint.z
                    })
                    
                    debugText.setAttribute('value', 
                      `Raycast hit point: \n` +
                      `x: ${intersectionPoint.x.toFixed(2)}, \n` +
                      `y: ${intersectionPoint.y.toFixed(2)}, \n` +
                      `z: ${intersectionPoint.z.toFixed(2)}`)
                  } else {
                    debugText.setAttribute('value', 'No raycast intersection')
                    intersectionPoint = null
                    teleportIndicator.setAttribute('visible', false)
                  }
                }
              }
            })
          }
        }
        
        setIsClient(true)
      }
    }

    loadAFrame()
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <a-scene 
      debug-toggle
      physics="driver: local; debug: false; gravity: -9.8;">
      {/* 调试文本 - 默认隐藏 */}
      <a-entity position="0 3 -2.01" class="debug-text" visible="false">
        <a-plane 
          color="white" 
          width="6" 
          height="1.5"
          opacity="0.7">
        </a-plane>
        <a-text 
          id="debugText"
          value="Waiting for interaction..."
          position="0 0 0.01"
          scale="1 1 1"
          color="red"
          align="center"
          width="5"
          anchor="center">
        </a-text>
      </a-entity>

      {/* 场景物体列表调试文本 - 默认隐藏 */}
      <a-entity position="-3 2 -2.01" class="debug-text" visible="false">
        <a-plane 
          color="white" 
          width="6" 
          height="3"
          opacity="0.7">
        </a-plane>
        <a-text 
          id="sceneDebugText"
          value="Loading scene objects..."
          position="0 0 0.01"
          scale="0.7 0.7 0.7"
          color="blue"
          align="left"
          width="8"
          anchor="center">
        </a-text>
      </a-entity>

      {/* 物理地面 - 設置為透明 */}
      <a-box
        position="0 -0.5 -4" 
        rotation="0 0 0" 
        width="20" 
        height="1" 
        depth="20" 
        color="#7BC8A4"
        visible="false"
        static-body="shape: box"
        class="teleportable"
        nav-mesh
        geometry="primitive: box">
      </a-box>

      {/* 原有的可抓取物体，添加更精确的物理特性 */}
      <a-box 
        position="-1 3 -3" 
        rotation="0 45 0" 
        color="#4CC3D9"
        class="grabbable"
        scale="0.3 0.3 0.3"
        dynamic-body="shape: box; mass: 1; linearDamping: 0.5">
      </a-box>

      <a-sphere 
        position="0 4 -5" 
        radius="0.25" 
        color="#EF2D5E"
        class="grabbable"
        dynamic-body="shape: sphere; mass: 1; linearDamping: 0.5">
      </a-sphere>

      <a-cylinder 
        position="1 2 -3" 
        radius="0.5" 
        height="1.5" 
        color="#FFC65D"
        class="grabbable"
        dynamic-body="shape: cylinder; mass: 2; linearDamping: 0.5">
      </a-cylinder>

      {/* 添加一些新的物理物体 */}
      <a-box 
        position="-2 5 -4" 
        width="0.4" 
        height="0.4" 
        depth="0.4"
        color="#FF88AA"
        class="grabbable"
        dynamic-body="shape: box; mass: 0.5; linearDamping: 0.5">
      </a-box>

      <a-sphere 
        position="2 6 -4" 
        radius="0.2" 
        color="#88FFAA"
        class="grabbable"
        dynamic-body="shape: sphere; mass: 0.3; linearDamping: 0.5">
      </a-sphere>

      {/* 斜坡 - 設置與地板相同的屬性 */}
      {/* <a-box 
        position="3 1 -4" 
        rotation="0 0 -30"
        width="4" 
        height="0.1" 
        depth="2"
        color="#888888"
        static-body="shape: box"
        class="teleportable"
        nav-mesh
        geometry="primitive: box">
      </a-box> */}

      {/* 添加边界墙防止物体掉出场景 */}
      <a-box 
        position="-10 2.5 -4" 
        width="0.1" 
        height="5" 
        depth="20"
        color="#888888"
        opacity="0.0"
        static-body="shape: box">
      </a-box>

      <a-box 
        position="10 2.5 -4" 
        width="0.1" 
        height="5" 
        depth="20"
        color="#888888"
        opacity="0.0"
        static-body="shape: box">
      </a-box>

      <a-box 
        position="0 2.5 -14" 
        width="20" 
        height="5" 
        depth="0.1"
        color="#888888"
        opacity="0.0"
        static-body="shape: box">
      </a-box>

      <a-box 
        position="0 2.5 6" 
        width="20" 
        height="5" 
        depth="0.1"
        color="#888888"
        opacity="0.0"
        static-body="shape: box">
      </a-box>

      {/* 添加傳送目標指示器 */}
      <a-entity id="teleportIndicator" visible="false">
        <a-ring
          color="#00ff00"
          radius-inner="0.25"
          radius-outer="0.30"
          rotation="-90 0 0"
          material="shader: flat; opacity: 0.75"
          animation="property: rotation; to: -90 360 0; loop: true; dur: 1500; easing: linear">
        </a-ring>
        <a-ring
          color="#00ff00"
          radius-inner="0.15"
          radius-outer="0.20"
          rotation="-90 0 0"
          material="shader: flat; opacity: 0.75"
          animation="property: rotation; to: -90 -360 0; loop: true; dur: 1500; easing: linear">
        </a-ring>
      </a-entity>

      {/* 相机设置 */}
      <a-entity id="cameraRig" movement-controls="constrainToNavMesh: true; fly: false; speed: 0.2">
        <a-entity id="camera" camera position="0 1.6 0" look-controls="pointerLockEnabled: true"></a-entity>
        
        {/* 左手控制器 - 修改為拋物線設置 */}
        <a-entity 
          id="leftHand" 
          oculus-touch-controls="hand: left" 
          raycaster="
            objects: .teleportable; 
            far: 30; 
            lineColor: #00ff00;
            showLine: true;
            lineOpacity: 1;
            lineWidth: 0.02;
            interval: 0;
            enabled: true"
          teleport-controls="
            cameraRig: #cameraRig; 
            teleportOrigin: #camera; 
            button: trigger;
            collisionEntities: .teleportable; 
            landingMaxAngle: 45; 
            hitCylinderColor: #7BC8A4; 
            hitCylinderRadius: 0.3; 
            hitCylinderHeight: 0.3;
            visualArcStyle: parabolic;
            curveHitColor: #00ff00;
            curveShootingSpeed: 5;
            curveNumberPoints: 30;
            type: parabolic"
          teleport-debug>
        </a-entity>
        
        {/* 右手控制器 - 用于抓取 */}
        <a-entity 
          id="rightHand" 
          oculus-touch-controls="hand: right" 
          raycaster="objects: .grabbable; far: Infinity; showLine: true; lineColor: red; lineOpacity: 0.8; lineWidth: 0.01; interval: 0; enabled: true"
          grab-handler>
        </a-entity>
      </a-entity>
      
      <a-sky color="#ECECEC"></a-sky>

      {/* 加載 scene.glb */}
      <a-gltf-model
        src="/scene.glb"
        position="0 0 0"
        scale="1 1 1"
        rotation="0 0 0"
        static-body="shape: mesh"
        class="teleportable"
        nav-mesh>
      </a-gltf-model>
    </a-scene>
  )
}

export default App
