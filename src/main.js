import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { gsap } from 'gsap';

const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const raycasterObjects = [];
const buttonsToAnimate = [];
let HoveredObject = null;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const manager = new THREE.LoadingManager();
const loadingScreen = document.querySelector(".loading-screen");
const loadingScreenButton = document.querySelector(".loading-screen-button");
const Instructions = document.querySelector(".instructions");

manager.onLoad = () => {
  setTimeout(() => {
    loadingScreenButton.classList.add("ready"); 
    loadingScreenButton.textContent = "ВОЙтИ";
    loadingScreenButton.style.cursor = "pointer";

    loadingScreenButton.onclick = () => {
      playReveal();
    };
  }, 2500); 
};

function playReveal() {
  const tl = gsap.timeline();

  tl.to(loadingScreen, {
    scale: 0.5,
    duration: 0.8,
    ease: "back.inOut(1.4)",
    onStart: () => {
      loadingScreenButton.classList.remove("ready");
      loadingScreenButton.classList.add("final");
      loadingScreenButton.textContent = "КноПка отЛаДки";
      loadingScreenButton.style.pointerEvents = "none";
      loadingScreen.style.background = "#223148";
      gsap.to(Instructions, { 
        opacity: 0,
      });
    }
  })
  
  .to(loadingScreen, {
    duration: 0.3,
    ease: "power2.inOut"
  }, "-=0.2")

  .to(loadingScreen, {
    scale: 30,
    opacity: 0,
    duration: 0.8,
    ease: "expo.in",
    onComplete: () => {
      startSceneAnimation();
      loadingScreen.remove();
    }
  }, "+=0.3");
}

const textureLoader = new THREE.TextureLoader(manager);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader(manager);
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

          if (child.name.includes('chair_Anim_Second')) {
            const initialRotationY = child.rotation.y;

            gsap.to(child.rotation, {
              y: initialRotationY - 0.2,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }

          if (child.name.includes('Pointer') || child.name.includes('Button') || child.name.includes('keyboard')) {
            raycasterObjects.push(child);
          }
          if (child.name.includes('Button')) {
            child.userData.inititialScale = new THREE.Vector3().copy(child.scale);
            child.userData.inititialPosition = new THREE.Vector3().copy(child.position);
            child.userData.inititialRotation = new THREE.Euler().copy(child.rotation);
            child.scale.set(0, 0, 0);
            buttonsToAnimate.push(child);
          }

          if (child.name.includes('keyboard')) {
            child.userData.inititialScale = new THREE.Vector3().copy(child.scale);
            child.userData.inititialPosition = new THREE.Vector3().copy(child.position);
            child.userData.inititialRotation = new THREE.Euler().copy(child.rotation);
          }
        }
      });
    }
  });
  scene.add(glb.scene);
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 5; 
controls.minPolarAngle = 0.5; 
controls.maxPolarAngle = Math.PI / 2.2;
controls.minAzimuthAngle = - Math.PI / 36;
controls.maxAzimuthAngle = Math.PI / 2.3;
controls.enablePan = true;

if (window.innerWidth < 768) {
  controls.maxDistance = 45; 
  camera.position.set(27.33, 13.31, 29.61);
  controls.target.set(-1.27, 3.63, -1.44);
} else {
  controls.maxDistance = 27; 
  camera.position.set(17.20, 11.54, 15.67);
  controls.target.set(-0.59, 3.95, -2.15);
}

controls.update();

window.addEventListener("resize", ()=> {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const pageLinks = {
  'My_Work': '/work.html',
  'Contacts': '/contacts.html',
  'Services': '/services.html',
  'About': '/about.html'
};

window.addEventListener("click", () => {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(raycasterObjects);

  if (intersects.length > 0) {
    const clickedName = intersects[0].object.name;
    Object.entries(pageLinks).forEach(([key, url]) => {
      if (clickedName.includes(key)) {
        window.location.href = url;
      }
    });
  }
});

function startSceneAnimation() {
  buttonsToAnimate.forEach((child) => {
    const finalScale = child.userData.inititialScale;
    gsap.to(child.scale, {
      x: finalScale.x, y: finalScale.y, z: finalScale.z,
      duration: 1, ease: "back.out(1.7)",
      delay: Math.random() * 0.5,
      onComplete: () => {
        child.userData.idleTween = gsap.to(child.scale, {
          x: finalScale.x * 1.05, y: finalScale.y * 1.1, z: finalScale.z * 1.05,
          duration: 0.8 + Math.random(), repeat: -1, yoyo: true, ease: "sine.inOut"
        });
      }
    });
  });
}

function playHoverAnimation (object, isHovering) {
  const isKeyboard = object.name.includes('keyboard');

  if(isHovering) {
    if (object.userData.idleTween) object.userData.idleTween.pause();

    if (isKeyboard) {
      gsap.to(object.scale, {
        y: object.userData.inititialScale.y * 1.5,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });
    } else {
      gsap.to(object.scale, {
        x: object.userData.inititialScale.x * 1.1,
        y: object.userData.inititialScale.y * 1.1,
        z: object.userData.inititialScale.z * 1.1,
        duration: 0.4,
        overwrite: "auto"
      });
      gsap.to(object.rotation, {
        x: object.userData.inititialRotation.x + Math.PI / 50,
        duration: 0.3,
        overwrite: "auto"
      });
    }
  } else {
    gsap.to(object.scale, {
      x: object.userData.inititialScale.x,
      y: object.userData.inititialScale.y,
      z: object.userData.inititialScale.z,
      duration: 0.3, 
      overwrite: "auto",
      onComplete: () => {
        if (object.userData.idleTween) object.userData.idleTween.play();
      }
    });
    gsap.to(object.rotation, {
      x: object.userData.inititialRotation.x,
      y: object.userData.inititialRotation.y,
      z: object.userData.inititialRotation.z,
      duration: 0.3, 
      overwrite: "auto"
    });
  }
}

const render = () => {
  const minPan = new THREE.Vector3(-2, 2, -7); // Лево, Низ, Глубина
  const maxPan = new THREE.Vector3(5, 6, 2);  // Право, Верх, Перед

  controls.target.x = Math.max(minPan.x, Math.min(maxPan.x, controls.target.x));
  controls.target.y = Math.max(minPan.y, Math.min(maxPan.y, controls.target.y));
  controls.target.z = Math.max(minPan.z, Math.min(maxPan.z, controls.target.z));

  controls.update();
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(raycasterObjects);

  if (intersects.length > 0) {
    const currentIntersect = intersects[0].object;
    
    const isButton = currentIntersect.name.includes("Button");
    const isKeyboard = currentIntersect.name.includes("keyboard");
    if (isButton) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }

    if ((isButton || isKeyboard) && currentIntersect !== HoveredObject) {
      if (HoveredObject) playHoverAnimation(HoveredObject, false);
      
      playHoverAnimation(currentIntersect, true);
      HoveredObject = currentIntersect;
    }
  } else {
    document.body.style.cursor = "default";
    if (HoveredObject) {
      playHoverAnimation(HoveredObject, false);
      HoveredObject = null;
    }
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};


render();