console.log("Loading three.js scene...")

var scene, camera, renderer;
var objectsLeft, objectsRight;
var leftSpriteFlip, rightSpriteFlip;

var group;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
startSpawning();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffeffa);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    group = new THREE.Group();
    createText();

    document.body.appendChild(renderer.domElement);
    leftSpriteFlip = false;
    rightSpriteFlip = false;
    objectsRight = [];
    objectsLeft = [];
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

}

function onDocumentMouseUp(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentMouseOut(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

    }

}

function createText() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/droid_sans_regular.typeface.json', function (loadedfont) {
        var material = new THREE.MeshNormalMaterial({
            color: 0xf1abf4
        });
        var materials = [
            new THREE.MeshBasicMaterial({ color: 0xf1abf4, overdraw: 0.5 }),
            new THREE.MeshBasicMaterial({ color: 0x000000, overdraw: 0.5 })
        ];
        var textGeom = new THREE.TextGeometry('Liana <3', {
            font: loadedfont,
            size: 2,
            height: 0.4,
            curveSegments: 6,
        });
        textGeom.computeBoundingBox();
        var centerOffset = -0.5 * (textGeom.boundingBox.max.x - textGeom.boundingBox.min.x);
        var textMesh = new THREE.Mesh(textGeom, material);
        textMesh.rotation.x = 0;
        textMesh.rotation.y = Math.PI * 2;
        textMesh.position.x = centerOffset;
        group.add(textMesh);
        scene.add(group);
        console.log(group);
    });
}

function spawnAvo(direction, flip, x, y) {
    var spriteMap = flip ?
        new THREE.TextureLoader().load("images/avocado.png") :
        new THREE.TextureLoader().load("images/heart.png");

    var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, 0);
    scene.add(sprite);

    if (direction === "right") {
        objectsRight.push(sprite);
    } else {
        objectsLeft.push(sprite);
    }
}


function startSpawning() {

    // Get half of the cameras field of view angle in radians
    var fov = camera.fov / 180 * Math.PI / 2;
    // Get the adjacent to calculate the opposite
    // This assumes you are looking at the scene
    var adjacent = camera.position.distanceTo(scene.position);
    // Use trig to get the leftmost point (tangent = o / a)
    var edge = Math.tan(fov) * adjacent * camera.aspect;
    console.log(edge)

    row1 = setInterval(function () {
        spawnAvo("right", rightSpriteFlip, -edge - 0.5, 5);
        rightSpriteFlip = !rightSpriteFlip;
    }, 400);

    row2 = setInterval(function () {
        spawnAvo("left", leftSpriteFlip, edge + 0.5, -3);
        leftSpriteFlip = !leftSpriteFlip;
    }, 400);
}

function animate() {
    for (var i = 0; i < objectsRight.length; i++) {
        objectsRight[i].position.x += 0.06;
    }

    for (var i = 0; i < objectsLeft.length; i++) {
        objectsLeft[i].position.x -= 0.06;
    }
    console.log(group);
    group.rotation.y += (targetRotation - group.rotation.y) * 0.05;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


