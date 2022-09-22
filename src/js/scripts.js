import * as THREE from 'three'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .01, 10000)
camera.position.set(0,1,3)

const loader = new THREE.TextureLoader()
const texture = loader.load('./assets/texture.jpg')
const height = loader.load('./assets/height.png')
const alpha = loader.load('./assets/alpha.png')

const planeGeometry = new THREE.PlaneGeometry(3,3,64,64)
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color : 0xFFFFFF,
  map: texture,
  displacementMap: height,
  displacementScale: .6,
  alphaMap: alpha,
  transparent: true,
  depthTest: false
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -.5 * Math.PI

const pointLight = new THREE.PointLight(0xdcf9, 1)
scene.add(pointLight)
pointLight.position.set(0,2,0)

gui.add(plane.rotation, "x").min(0).max(4).step(.001)
const pointLightColor = { color: 0xdcf9 }

gui.addColor(pointLightColor, "color").onChange(function(e){
  pointLight.color.set(e)
})

let mouseY = 0;

document.addEventListener('mousemove', function(e){
  mouseY = e.clientY
})

const clock = new THREE.Clock()

function animate(time){
  const elapsedTime = clock.getElapsedTime()
  plane.rotation.z = elapsedTime * .2
  plane.material.displacementScale = .3 + mouseY * .0008
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1
})