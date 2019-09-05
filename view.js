class View {
  constructor(data) {
    this.systemMap = data.systemMap;
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();

    this.items = [];
    this.mouse = null;

    this.events = {
      mouseDown: false,
      mouseLast: new THREE.Vector2(0,0),
      mouseDownPlace: new THREE.Vector2(0,0),
      hoveredMesh: null,
      selectedMesh: null,
    };

    this.setupScene();

    this.cam = new Cam();

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( this.renderer.domElement );

    this.render();
  }

  cameraElevate(delta) {
    this.cam.changeElev(delta);
    this.render();
  }

  cameraRotate(delta) {
    this.cam.changeTheta(delta);
    this.render();
  }

  getAspectRatio = () => { return window.innerWidth / window.innerHeight; };

  getCamera() {
    return this.cam.getCameraObject();
  }

  // getItemFromMesh(mesh) {
  //   return this.items.find(item => item.getMesh() === mesh);
  // }

  getMeshes() {
    return this.items.map(item => item.getMesh());
  }

  onClick = mouse => {
    if(this.events.hoveredMesh){
      const item = this.getItem(this.events.hoveredMesh);

      // console.log('item',item);

      this.selectMesh(this.events.hoveredMesh);
    } else {
      this.selectMesh();
    }
  };

  selectMesh(mesh) {
    if(mesh){
      this.selectObj.position.copy(mesh.position);
      this.selectObj.visible = true;
      this.events.selectedMesh = mesh;
    } else {
      this.selectObj.visible = false;
      this.events.selectedMesh = null;
    }
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render( this.scene, this.cam.getCameraObject() );
  };

  setupScene() {
    const sphereSegs = 15;

    for(let object of this.systemMap.worlds){
      let options = {position:object.getLocation().toArray(), color:object.color};
      if(object.type === 'star'){
        options.material = new THREE.MeshBasicMaterial({color: object.color});
      }
      const item = new Item(
        new THREE.SphereGeometry(object.size, sphereSegs, sphereSegs),
        this.scene,
        options,
      )
      item.mapObject = object;
      this.items.push(Item);

      if(object.type === 'world'){
        const innerRad = object.distance;
        const outerRad = innerRad + 0.1;
        const thetaSegs = sphereSegs * 4;
        const phiSegs = 1;
        const ringGeom = new THREE.RingGeometry(
          innerRad, outerRad, thetaSegs, phiSegs
        );
        const ringMat = new THREE.MeshBasicMaterial({color: 0x555555});
        const ring = new THREE.Mesh(ringGeom, ringMat);
        this.scene.add(ring);
      }
    }

    const selGeom = new THREE.RingGeometry(0.1, 1, 20, 1);
    const selMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
    this.hoverRing = new THREE.Mesh(selGeom, selMat);
    this.hoverRing.visible = false;
    this.scene.add(this.hoverRing);


    const trad=1;
    const ttub=0.1;
    const trsegs = 4;
    const ttsegs = 20;
    const tMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
    const t1g = new THREE.TorusGeometry(trad, ttub, trsegs, ttsegs);
    const torus1 = new THREE.Mesh(t1g, tMat);
    this.selectObj = new THREE.Group();
    this.selectObj.add(torus1);
    const torus2 = torus1.clone();
    torus2.rotation.x = Math.PI/2;
    this.selectObj.add(torus2);
    const torus3 = torus1.clone();
    torus3.rotation.y = Math.PI/2;
    this.selectObj.add(torus3);
    this.scene.add(this.selectObj);
    // this.selectObj.position.set(1,0,0);
    this.selectObj.visible = false;

    // this.items.push(
    //   new Item( new THREE.BoxGeometry(1,1,1), this.scene, {position:[0,3,0]})
    // );

    let light = new THREE.PointLight(0xffffcc, 2, 500);
    light.position.set(0,0,0);
    this.scene.add(light);

    let ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    this.setupStars();
  }

  setupStars() {
    const count = 500;
    const dist = 20;
    for(let i=0; i<count; ++i){
      let size = 0.03 + Math.random() * 0.1;
      let mat = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
      let geom = new THREE.SphereGeometry(size, 4, 4);
      let star = new THREE.Mesh(geom, mat);
      let elev = Math.random() * Math.PI - Math.PI/2;
      let theta = Math.random() * 2 * Math.PI;
      let z = dist * Math.sin(elev);
      let flat = dist * Math.cos(elev);
      let x = flat * Math.cos(theta);
      let y = flat * Math.sin(theta);
      star.position.set(x,y,z);
      this.scene.add(star);
    }
  }

  updateViewSize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cam.updateAspect(this.getAspectRatio());
  }

  getMouseDelta(event) {
    const mouse = this.getMouse(event);
    mouse.sub(this.events.mouseLast);
    return mouse;
  }

  getMouse(event) {
    return new THREE.Vector2(
      (event.clientX / window.innerWidth)*2-1,
      - (event.clientY / window.innerHeight)*2+1
    );
  }

  onMouseDown = event => {
    this.events.mouseDown = true;
    const mouse = this.getMouse(event);
    this.events.mouseDownPlace.copy(mouse);
    this.events.mouseLast.copy(mouse);
  };

  onMouseMove = event => {
    const mouse = this.getMouse(event);
    if(this.events.mouseDown){
      const delta = this.getMouseDelta(event);
      this.cameraElevate(-delta.y * Math.PI * 1);
      this.cameraRotate(-delta.x * Math.PI * 0.5);
      this.events.mouseLast.copy(mouse);
    } else {
      const raycaster = new THREE.Raycaster();
      const camera = this.getCamera();
      raycaster.setFromCamera(mouse,camera);
      const intersects = raycaster.intersectObjects(this.scene.children);
      if(intersects.length > 0){
        const mesh = this.getNearestIntersect(intersects).object;
        if(mesh !== this.events.hoveredMesh){
          if(this.events.hoveredMesh){
            this.clearHover(this.events.hoveredMesh);
          }
          this.setHover(mesh);
        }
      } else if(this.events.hoveredMesh) {
        this.clearHover(this.events.hoveredMesh);
      }
    }
  };

  getItem(mesh){
    return mesh.item;
    /*
    for(let item of this.items){
      if(item.getMesh() === mesh){
        return item;
      }
    }
    */
  }

  clearHover(mesh){
    const item = this.getItem(mesh);
    if(item){
      this.hoverRing.visible = false;
      this.events.hoveredMesh = null;
    }
  }

  setHover(mesh){
    const item = this.getItem(mesh);
    if(item){
      this.hoverRing.position.copy(mesh.position);
      this.hoverRing.visible = true;
      this.events.hoveredMesh = mesh;
    }
  }

  getNearestIntersect(intersects){
    let intersect = null;
    let distance = 0;
    for(let i of intersects){
      if(!intersect || i.distance < distance){
        intersect = i;
        distance = i.distance
      }
    }
    return intersect;
  }

  onMouseUp = event => {
    const mouse = this.getMouse(event);
    const dragged = mouse.clone();
    dragged.sub(this.events.mouseDownPlace);
    if(dragged.manhattanLength() === 0){
      this.onClick(mouse);
    }
    this.events.mouseDown = false;
  };

  onResize = event => { this.updateViewSize(); };

}
