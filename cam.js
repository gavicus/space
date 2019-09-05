class Cam {
  constructor() {
    this.dist = 20;
    this.theta = 0;
    this.elev = 0;
    this.look = new THREE.Vector3(0,0,0);
    this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 0.1, 1000);
    this.camera.up = new THREE.Vector3(0,0,1);
    this.reposition();
  }

  changeDist(d) { this.setDist(this.dist + d); }
  changeElev(d) { this.setElev(this.elev + d); }
  changeTheta(d) { this.setTheta(this.theta + d); }

  getAspectRatio = () => { return window.innerWidth / window.innerHeight; };

  getCameraObject() { return this.camera; }

  reposition() {
    const height = this.dist * Math.sin(this.elev);
    const flatDist = this.dist * Math.cos(this.elev);
    this.camera.position.set(
      flatDist * Math.cos(this.theta),
      flatDist * Math.sin(this.theta),
      height
    );
    this.camera.lookAt(this.look);
  }

  setDist(d) {
    this.dist = d;
    this.reposition();
  }

  setElev(e){
    this.elev = e;
    this.reposition();
  }

  setTheta(t) {
    this.theta = t;
    this.reposition();
  }

  updateAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
}
