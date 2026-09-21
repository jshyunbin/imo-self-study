import * as THREE from 'three';
import * as bvh_parser from './bvh_parser.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x808080);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
camera.position.set(-500, 500, 100);
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

const jointGeo = new THREE.SphereGeometry( 1, 32, 16 );
const jointMat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const rootMat = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
const root = new THREE.Mesh( jointGeo, rootMat );
scene.add( root );

function drawFigure(parent, h, m) {
  var joint = new THREE.Mesh( jointGeo, jointMat );
  joint.translateX(h.offset[0]);
  joint.translateY(h.offset[1]);
  joint.translateZ(h.offset[2]);

  if (h.type == "end") {
    parent.add(joint);
    return;
  }

  for (const channel of h.channels) {
const jointMat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    switch (channel.ch_name) {
      case "Xposition":
        joint.translateX(m[channel.index]);
        break;
      case "Yposition":
        joint.translateY(m[channel.index]);
        break;
      case "Zposition":
        joint.translateZ(m[channel.index]);
        break;

      case "Xrotation":
        joint.rotateX(m[channel.index]);
        break;

      case "Yrotation":
        joint.rotateY(m[channel.index]);
        break;
      case "Zrotation":
        joint.rotateZ(m[channel.index]);
        break;
      default:
        break;
    }
  }

  parent.add(joint);

  for (const links of h.conn_links) {
    drawFigure(joint, links, m);
  }
}






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
    drawFigure(root, fileObject.hierarchy, fileObject.motion.frames[0]);
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

const gridHelper = new THREE.GridHelper( 1000, 10 );
scene.add( gridHelper );



function animate( time ) {

  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );