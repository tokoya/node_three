window.onload = function() {
  // three.js設定
  var width = 640;
  var height = 480;
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
  var camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
  camera.position.set(150,150,150);
  trackball = new THREE.TrackballControls(camera);
  trackball.rotateSpeed = 4.0;
  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(20, 50, 10).normalize();
  scene.add(light);
  var ambientLight = new THREE.AmbientLight(0x440000);
  scene.add(ambientLight);
  var geometry = new THREE.BoxGeometry(100,100,100);
  var texture  = new THREE.ImageUtils.loadTexture('/images/Raspi_Colour_R.jpg');
  var material = new THREE.MeshLambertMaterial({map: texture});
  var cube = new THREE.Mesh(geometry, material);
  var axis = new THREE.AxisHelper(1000);
  scene.add(cube);
  scene.add(axis);
  camera.lookAt(cube.position);

  var render = function () {
      requestAnimationFrame(render);
      trackball.update();
      renderer.render(scene, camera);
  };
  render();

  // socket.io設定
  var socket = io.connect();
  var cv = document.getElementById("cv");
  var ctx = cv.getContext('2d');
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
 
  socket.on('connect', function() {
    console.log('connect');
    socket.on('event', function(data) {
      ctx.fillStyle = '#FFF';
      ctx.fillRect(0, 0, 640, 300);
      ctx.fillStyle = '#F00';
      ctx.fillRect(320, 5, data.x * 2, 45);
      ctx.fillStyle = '#0F0';
      ctx.fillRect(320, 55, data.y * 2, 45);
      ctx.fillStyle = '#00F';
      ctx.fillRect(320, 105, data.z * 2, 45);
      cube.rotation.x = data.x * Math.PI / 180;
      cube.rotation.y = data.y * Math.PI / 180;
    });
  });
}
