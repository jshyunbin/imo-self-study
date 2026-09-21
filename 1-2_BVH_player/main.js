import * as THREE from 'three';
import * as bvh_parser from './bvh_parser.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x808080);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
camera.position.set(-28, 28, 10);
camera.lookAt(scene.position);

var controls = new OrbitControls(camera, renderer.domElement);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

const input = document.querySelector("input");
const messageDisplay = document.getElementById("message");
var fileText = "";
var fileObject = null;
input.addEventListener("change", updateBVHFile);


function updateBVHFile(event) {
  const file = event.target.files[0];
  fileText = ""; // Clear previous file content
  messageDisplay.textContent = ""; // Clear previous messages

  // Validate file existence and type
  if (!file) {
    showMessage("No file selected. Please choose a file.", "error");
    return;
  }

  // Read the file
  const reader = new FileReader();
  reader.onload = () => {
    fileText = reader.result;
    fileObject = bvh_parser.parse(fileText);
    console.log(fileObject);
  };
  reader.onerror = () => {
    showMessage("Error reading the file. Please try again.", "error");
  };
  reader.readAsText(file);
}

// Displays a message to the user
function showMessage(message, type) {
  messageDisplay.textContent = message;
  messageDisplay.style.color = type === "error" ? "red" : "green";
}



const axesHelper = new THREE.AxesHelper( 3 );
scene.add( axesHelper );

const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );



function animate( time ) {

  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );