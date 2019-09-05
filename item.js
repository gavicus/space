class Item {
  constructor(geom, scene, options) {
    this.mainColor = options.mainColor || options.color || 0x888888;
    this.hoverColor = options.selectColor || 0xffff99;
    this.selectColor = options.selectColor || 0xff9999;
    const material = options.material
      || new THREE.MeshLambertMaterial({color: this.mainColor});
    this.mesh = new THREE.Mesh(geom, material);
    this.mesh.item = this;
    this.setPosition( options.position || [0,0,0] );
    scene.add(this.mesh);
    this.selected = false;
  }

  getMesh() {
    return this.mesh;
  }

  select(selected) {
    this.selected = selected;
    if(selected) {
      this.mesh.material.color.set(this.selectColor);
    } else {
      this.mesh.material.color.set(this.mainColor);
    }
  }

  selectToggle() {
    this.select(!this.selected);
  }

  setPosition(p) {
    this.position = p;
    this.mesh.position.set(...p);
  }
}
