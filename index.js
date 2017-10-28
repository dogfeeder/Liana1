console.log("Loading three.js scene...")
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var objectsRight = [];
var objectsLeft = [];
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.body.appendChild(renderer.domElement);
var isHeart = false;

camera.position.z = 5;

function spawnAvo(direction, x, y) {
    var spriteMap = isHeart ?
        new THREE.TextureLoader().load("images/avocado.png") :
        new THREE.TextureLoader().load("images/heart.png");

    var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5, 0.5, 0.5);
    sprite.position.set(x, y, 0);
    scene.add(sprite);

    if (direction === "right") {
        objectsRight.push(sprite);
    } else {
        objectsLeft.push(sprite);
    }
}


function startSpawning() {

    row1 = setInterval(function () {
        spawnAvo("right", -6, 3);
    }, 400);

    row2 = setInterval(function () {
        spawnAvo("left", 6, -3);
        isHeart = !isHeart;
    }, 400);
}

function animate() {
    for (var i = 0; i < objectsRight.length; i++) {
        objectsRight[i].position.x += 0.03;
    }

    for (var i = 0; i < objectsLeft.length; i++) {
        objectsLeft[i].position.x -= 0.03;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
startSpawning();
