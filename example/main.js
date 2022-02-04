import * as THREE from 'three';
import CameraControls from "camera-controls";
import { BIMLoader} from "dotbim-three";

CameraControls.install( { THREE: THREE } );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000000 );
camera.position.set( 0, 0, 5 );

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();

const gridHelper = new THREE.GridHelper( 50, 50 );
gridHelper.position.y = - 1;
scene.add( gridHelper );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const cameraControls = new CameraControls( camera, renderer.domElement );

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
light.intensity = 2;
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.setX(2);
directionalLight.position.setZ(2);
scene.add( directionalLight );


// Start load file
let fileData = null;
let bimObjects = []

let jsonInput = document.getElementById("input-json");
jsonInput.onchange = function() {
    const input = this.files[0];
    const loader = new BIMLoader();
    const url = window.URL.createObjectURL(input);
    loader.load(url, (root, parsed) => {
        root.rotateX(-Math.PI / 2);
        scene.add(root);
        bimObjects.push(root);
        fileData = parsed;
    });
};

// Properties
function getPropertiesForMesh(guid){
    const element = fileData?.elements?.find((element) => element.guid === guid);
    if(element) {
        console.log("Properties for: " + guid)
        console.log(element?.info);
        const el = document.getElementById("properties");
        el.innerHTML = JSON.stringify(element.info, null, 4)
    }
}

let selected = null;

// Raycasting
function cast(event){
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.firstHitOnly = true;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const objects = raycaster.intersectObjects(bimObjects, true);
    if(objects.length > 0){

        const object = objects[0].object;

        if(selected){
            selected.material = selected.userData.originalMat;
        }

        selected = object;

        if(object.material){

            if(!object.userData.originalMat){
                object.userData.originalMat = object.material.clone();
            }

            object.material = new THREE.MeshBasicMaterial({ color: "#E95A32", side: THREE.DoubleSide})

            // Get properties
            getPropertiesForMesh(object.userData.Guid)
        }
    }else {
        if(selected){
            selected.material = selected.userData.originalMat;
        }
    }
}

window.addEventListener("mousedown", (event) => {
    if(event.button === 0){
        cast(event);
    }
})

// Render loop
function animate() {
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update( delta );
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();