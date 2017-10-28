console.log("Loading three.js scene...")

var scene, camera, renderer;
var objectsLeft, objectsRight;
var leftSpriteFlip, rightSpriteFlip;

var group;

init();
animate();
startSpawning();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);



    document.body.appendChild(renderer.domElement);
    leftSpriteFlip = false;
    rightSpriteFlip = false;
    objectsRight = [];
    objectsLeft = [];

    var loader = new THREE.FontLoader();

    loader.load('fonts/helvetiker_regular.typeface.json', function (loadedfont) {

        var material = new THREE.MeshPhongMaterial({
            color: 0xdddddd
        });
        var textGeom = new THREE.TextGeometry('Hello World!', {
            font: loadedfont,
            size: 1,
            height: 0.4,
            curveSegments: 12,
        });
        var textMesh = new THREE.Mesh(textGeom, material);

        scene.add(textMesh);
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
        spawnAvo("right", rightSpriteFlip, -edge - 0.5, 3);
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
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


