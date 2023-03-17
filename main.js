import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 6);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio));

// オブジェクトの作成
// マテリアル
const material = new THREE.MeshPhysicalMaterial({
    color: "#3c94d7",
    metalness: 0.86,
    roughness: 0.37,
    flatShading: true
});

// メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60,), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronBufferGeometry(), material);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// 回転用に配置する
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);

renderer.render(scene, camera);
