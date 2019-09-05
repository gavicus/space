class Control {
  constructor() {
    this.setupSystemMap();
    this.view = new View({systemMap:this.systemMap});
    this.setupEvents();
  }

  setupEvents() {
    document.body.addEventListener('mousedown', this.view.onMouseDown);
    document.body.addEventListener('mouseup', this.view.onMouseUp);
    document.body.addEventListener('mousemove', this.view.onMouseMove);
    window.addEventListener('resize', this.view.onResize);
  }

  setupSystemMap(){
    const planets = [
      {size:50,type:'star',color:0xffff88, distance:0},
      {distance:0.39, color:0xa08fa2,  size: 1.5},
      {distance:0.72, color:0x8b7d82,  size: 3.7},
      {distance:1,    color:0x3333ff,  size: 3.9},
      {distance:1.52, color:0xff8822,  size: 2.4},
      {distance:5.2,  color:0xff9988,  size: 43},
      {distance:9.58, color:0xffffff,  size: 36},
      {distance:19.2, color:0xffffff,  size: 16},
      {distance:30.05, color:0xffffff, size: 15},
    ];
    const objects = [];
    const distBase = 1;
    const distMult = 0.15;
    let lastDist = 0;
    let gap = 1;
    for(let p of planets){
      let pSize = 0.2 + p.size * 0.01;
      objects.push({
        size: pSize, type: p.type || 'world',
        color: p.color, distance: lastDist,
        theta: Math.random() * 2 * Math.PI,
      });
      if(lastDist === 0){ lastDist += gap; }
      lastDist += gap;
      gap += 0.2;
    }
    this.systemMap = new SystemMap({ objects: objects });
  }
}
