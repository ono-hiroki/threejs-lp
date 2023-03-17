import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

const gui = new dat.GUI();

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
    flatShading: true,
});

gui.addColor(material, 'color').name('color');
gui.add(material, 'metalness').min(0).max(1).step(0.001).name('metalness');
gui.add(material, 'roughness').min(0).max(1).step(0.001).name('roughness');

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
const meshes = [mesh1, mesh2, mesh3, mesh4];

// ライト
const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
directionalLight.position.set(0.5,1,0);
scene.add(directionalLight);

// ブラウザのリサイズに対応
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio));
});

// ホイールでのアニメーション
let speed = 0;
let rotation = 0;
window.addEventListener('wheel', (event) => {
    speed += event.deltaY * 0.0002;
});

const r = 4;
const origin = new THREE.Vector3(3.5, 0, -3);
function rotateMeshes() {
    rotation += speed;
    speed *= 0.9;

    mesh1.position.x = origin.x + r * Math.cos(rotation);
    mesh1.position.z = origin.z + r * Math.sin(rotation);
    mesh2.position.x = origin.x + r * Math.cos(rotation + Math.PI / 2);
    mesh2.position.z = origin.z + r * Math.sin(rotation + Math.PI / 2);
    mesh3.position.x = origin.x + r * Math.cos(rotation + Math.PI);
    mesh3.position.z = origin.z + r * Math.sin(rotation + Math.PI * 1.5 / 2);
    mesh4.position.x = origin.x + r * Math.cos(rotation + 3 / 2 * Math.PI);
    mesh4.position.z = origin.z + r * Math.sin(rotation + 3 / 2 * Math.PI / 2);

    window.requestAnimationFrame(rotateMeshes);
}

rotateMeshes();

// カーソルの位置を取得
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5; // -0.5 ~ 0.5
    cursor.y = event.clientY / sizes.height - 0.5;
});

// アニメーション
const clock = new THREE.Clock();
const animate = () => {
    renderer.render(scene, camera);

    let getDeltaTime = clock.getDelta();

    // 回転
    meshes.forEach(mesh => {
        mesh.rotation.x += 0.1 * getDeltaTime;
        mesh.rotation.y += 0.1 * getDeltaTime;
    });

    // カメラの位置
    camera.position.x = cursor.x * getDeltaTime * 10;
    camera.position.y = -cursor.y * getDeltaTime * 10;

    window.requestAnimationFrame(animate);
};

animate();

