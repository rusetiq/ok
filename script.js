import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 30);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    // Lighting
    setupLighting();

    // Skybox and Ground
    createSkyboxAndGround();

    // Create objects
    createPicnicTable();
    createFlowers();
    createMonitor();
    createPictureFrame();
    createPapers();

    // Set shadow properties for all meshes
    scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    // Start animation loop
    animate();
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);
}

function createSkyboxAndGround() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader
        .setPath('textures/skybox/')
        .load([
            'posx.jpg', 'negx.jpg',
            'posy.jpg', 'negy.jpg',
            'posz.jpg', 'negz.jpg',
        ]);
    scene.background = texture;

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x556b2f });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

function createPicnicTable() {
    const table = new THREE.Group();
    scene.add(table);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    // Tabletop
    const tabletopGeometry = new THREE.BoxGeometry(20, 1, 10);
    const tabletop = new THREE.Mesh(tabletopGeometry, tableMaterial);
    tabletop.position.y = 2.5;
    table.add(tabletop);

    // Legs
    const legGeometry = new THREE.BoxGeometry(1, 2.5, 1);
    const positions = [[-8, 4], [8, 4], [-8, -4], [8, -4]];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, tableMaterial);
        leg.position.set(pos[0], 1.25, pos[1]);
        table.add(leg);
    });

    // Benches
    const benchGeometry = new THREE.BoxGeometry(20, 1, 2);
    const bench1 = new THREE.Mesh(benchGeometry, tableMaterial);
    bench1.position.set(0, 1.5, 7);
    table.add(bench1);

    const bench2 = new THREE.Mesh(benchGeometry, tableMaterial);
    bench2.position.set(0, 1.5, -7);
    table.add(bench2);

    // Bench Supports
    const supportGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const supportPositions = [[-8, 7], [8, 7], [-8, -7], [8, -7]];
    supportPositions.forEach(pos => {
        const support = new THREE.Mesh(supportGeometry, tableMaterial);
        support.position.set(pos[0], 0.75, pos[1]);
        table.add(support);
    });
}

function createFlowers() {
    const petalGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);

    for (let i = 0; i < 20; i++) {
        const flower = new THREE.Group();
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 1;
        flower.add(stem);

        const flowerHead = new THREE.Group();
        flowerHead.position.y = 2;
        flower.add(flowerHead);

        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        flowerHead.add(center);

        for (let j = 0; j < 6; j++) {
            const petal = new THREE.Mesh(petalGeometry, flowerMaterial);
            const angle = (j / 6) * Math.PI * 2;
            petal.position.x = Math.cos(angle) * 0.4;
            petal.position.z = Math.sin(angle) * 0.4;
            flowerHead.add(petal);
        }

        flower.position.set((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
        scene.add(flower);
    }
}

function createMonitor() {
    const monitor = new THREE.Group();
    monitor.position.set(0, 3.0, 0);
    scene.add(monitor);

    // Stand
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const standBaseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
    const standBase = new THREE.Mesh(standBaseGeometry, standMaterial);
    standBase.position.y = 0.1;
    monitor.add(standBase);

    const standNeckGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const standNeck = new THREE.Mesh(standNeckGeometry, standMaterial);
    standNeck.position.y = 0.7;
    monitor.add(standNeck);

    // Body and Screen
    const bodyGeometry = new THREE.BoxGeometry(4, 3, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2.2;
    monitor.add(body);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = "30px Arial";
    context.fillText("I'm sorry", 50, 70);

    const screenTexture = new THREE.CanvasTexture(canvas);
    const screenGeometry = new THREE.BoxGeometry(3.8, 2.8, 0.1);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 2.2;
    screen.position.z = 0.51;
    monitor.add(screen);
}

function createPictureFrame() {
    const pictureFrame = new THREE.Group();
    pictureFrame.position.set(-8, 3.0, 0); // Corrected Y position to sit on the table
    scene.add(pictureFrame);

    const frameGeometry = new THREE.BoxGeometry(4.2, 5.2, 0.5);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 2.6;
    pictureFrame.add(frame);

    const pictureGeometry = new THREE.PlaneGeometry(4, 5);
    const pictureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Placeholder for user's image
    const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
    picture.position.y = 2.6;
    picture.position.z = 0.26;
    pictureFrame.add(picture);
}

function createPapers() {
    const paperGeometry = new THREE.PlaneGeometry(3, 4);
    const paperMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
    });

    const paper1 = new THREE.Mesh(paperGeometry, paperMaterial);
    paper1.position.set(5, 3.01, 2); // Corrected Y position to sit just above the table
    paper1.rotation.x = -Math.PI / 2;
    scene.add(paper1);

    const paper2 = new THREE.Mesh(paperGeometry, paperMaterial);
    paper2.position.set(5, 3.01, -2); // Corrected Y position
    paper2.rotation.x = -Math.PI / 2;
    scene.add(paper2);

    const paper3 = new THREE.Mesh(paperGeometry, paperMaterial);
    paper3.position.set(10, 3.01, 0); // Corrected Y position
    paper3.rotation.x = -Math.PI / 2;
    scene.add(paper3);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

init();
