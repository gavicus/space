class MapObject {
  constructor(data){
    this.id = data.id;
    this.name = data.name || null;
    this.type = data.type || 'world';
    this.distance = data.distance || 0;
    this.size = data.size || 0.3;
    this.color = data.color || 0x888888;
    this.theta = data.theta || Math.PI/2;
  }

  getLocation() {
    return new THREE.Vector3(
      this.distance * Math.cos(this.theta),
      this.distance * Math.sin(this.theta),
      0
    );
  }
}

