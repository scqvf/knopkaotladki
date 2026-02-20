import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import gsap from "gsap";

const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const raycasterObjects = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );

const textureMap = {
  First: {
    day: "/textures/TextureSetFirst.webp",
    // night: "/textures/room/NightTextureSetFirst.webp",
  },
  Second: {
    day: "/textures/TextureSetSecond.webp",
    // night: "/textures/room/NightTextureSetSecond.webp",
  },
  Third: {
    day: "/textures/TextureSetThird.png",
    // night: "/textures/room/NightTextureSetThird.webp",
  },
}

const loadedTextures = {
  day:{},
  night:{},
}

Object.entries(textureMap).forEach(([key, paths])=>{
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;

  const nightTexture = textureLoader.load(paths.night);
  nightTexture.flipY = false
  loadedTextures.night[key] = nightTexture;
})

window.addEventListener("mousemove", (e)=>{
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
})

loader.load("/models/room.glb", (glb)=>{
  glb.scene.traverse(child=>{
    if(child.isMesh){
      Object.keys(textureMap).forEach(key=>{
        if(child.name.includes(key)){
          const isTransparent = child.name.includes('Transparency');

          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
            transparent: isTransparent,
            opacity: isTransparent ? 1 : 1,
            side: THREE.DoubleSide,
          });

          child.material = material;

          if (child.name.includes('Pointer')) {
            raycasterObjects.push(child);
          }
        }
        
      });
    }
  });
  scene.add(glb.scene)
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(
19.165596109554876,
10.366829967866206,
11.755602978410923)

const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Делает картинку более киношной и мягкой
renderer.toneMappingExposure = 1;

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(
  
-0.5916869120073701,

3.9581975581167312,

-2.1551166648476023
)


// Event Listeners
window.addEventListener("resize", ()=> {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const pageLinks = {
  'My_Work': '../work.html',
  'Contacts': '../contacts.html',
  'Services': '../services.html',
  'About': '../about.html'
};

window.addEventListener("click", () => {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(raycasterObjects);

  if (intersects.length > 0) {
    const clickedName = intersects[0].object.name; // Берем имя первого объекта в который попали
    
    // Ищем ключ в нашем списке ссылок
    Object.entries(pageLinks).forEach(([key, url]) => {
      if (clickedName.includes(key)) {
        window.location.href = url;
      }
    });
  }
});

const render = () => {
  controls.update();

  // Raycaster
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(raycasterObjects);
  for (let i = 0; i <intersects.length; i++) {
  }

  if(intersects.length>0){
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }

  renderer.render( scene, camera );

  window.requestAnimationFrame(render);
};

render();