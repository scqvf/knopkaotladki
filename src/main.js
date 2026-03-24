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
  Object.values(loadedTextures.day).forEach(tex => renderer.initTexture(tex));
  Object.values(loadedTextures.night).forEach(tex => renderer.initTexture(tex));
  setTimeout(() => {
    loadingScreenButton.classList.add("ready"); 
    loadingScreenButton.textContent = "ВОЙтИ";
    loadingScreenButton.style.cursor = "pointer";

    loadingScreenButton.onclick = () => {
      playReveal();
    };
  }, 1); 
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
    night: "/textures/NightTextureSetFirst.webp",
  },
  Second: {
    day: "/textures/TextureSetSecond.webp",
    night: "/textures/NightTextureSetSecond.webp",
  },
  Third: {
    day: "/textures/TextureSetThird.png",
    night: "/textures/NightTextureSetThird.png",
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
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.night[key] = nightTexture;
})

window.addEventListener("mousemove", (e)=>{
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
})

loader.load("/models/room.glb", (glb)=>{
  let internalCount = 0;
  glb.scene.traverse(child=>{
    if(child.isMesh){
      Object.keys(textureMap).forEach(key=>{
        if(child.name.includes(key)){
          const isTransparent = child.name.includes('Transparency');
          const material = new THREE.MeshPhongMaterial({
            map: loadedTextures.day[key],
            transparent: isTransparent,
            opacity: isTransparent ? 1 : 1,
            side: THREE.DoubleSide,
            shininess: 10,
          });

          child.material = material;

          child.userData.dayTex = loadedTextures.day[key];
          child.userData.nightTex = loadedTextures.night[key];
          child.userData.meshKey = key;

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
            if (internalCount < buttonLights.length) {
              const currentLight = buttonLights[internalCount];
              child.updateWorldMatrix(true, true);

              const worldPos = new THREE.Vector3();
              child.getWorldPosition(worldPos);
              currentLight.position.copy(worldPos);

              const offset = new THREE.Vector3(0, 0.5, 0.3); 
              
              offset.applyQuaternion(child.quaternion);

              currentLight.position.add(offset);

              internalCount++;
            }
            child.userData.inititialScale = new THREE.Vector3().copy(child.scale);
            child.userData.inititialPosition = new THREE.Vector3().copy(child.position);
            child.userData.inititialRotation = new THREE.Euler().copy(child.rotation);
            child.scale.set(0, 0, 0);
            child.userData.buttonMat = child.material;
            child.material.color.setRGB(1, 1, 1); 
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

const buttonLights = [];
const buttonColors = [0xffffff, 0xffffff, 0xffffff, 0xffffff];
for (let i = 0; i < 4; i++) {
  const bLight = new THREE.PointLight(buttonColors[i], 0, 2);
  scene.add(bLight);
  buttonLights.push(bLight);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffe9a8, 0, 100);
pointLight.position.set(2, 8, 5);
scene.add(pointLight);

// визуальный помощник scene.add(new THREE.PointLightHelper(pointLight, 0.5));

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
let isNight = false;

function toggleTheme() {
  isNight = !isNight;

  const themeBtn = document.getElementById('theme-switch');
  if (themeBtn) themeBtn.classList.toggle('is-night', isNight);

  const tl = gsap.timeline();

  tl.to(renderer, {
    toneMappingExposure: isNight ? 0.4 : 1.6,
    duration: 0.5,
    ease: "power2.in",
    onComplete: () => {
      scene.traverse((child) => {
        if (child.isMesh && child.userData.dayTex) {
          child.material.map = isNight ? child.userData.nightTex : child.userData.dayTex;
          child.material.needsUpdate = true;
        }
      });
    }
  })

  .to(renderer, {
    toneMappingExposure: isNight ? 0.7 : 1,
    duration: 0.8,
    ease: "power2.out"
  });

  buttonLights.forEach((light) => {
    gsap.to(light, {
      intensity: isNight ? 8 : 0,
      duration: 1.5,
      ease: "sine.inOut"
    });
  });

  gsap.to(ambientLight, {
    intensity: isNight ? 3 : 2.5,
    duration: 1.5,
    ease: "sine.inOut"
  });

  gsap.to(pointLight, {
    intensity: isNight ? 120 : 0,
    duration: 2,
    ease: "power1.inOut"
  });
}

const themeBtn = document.getElementById('theme-switch');
if (themeBtn) {
  themeBtn.addEventListener('click', toggleTheme);
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