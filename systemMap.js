class SystemMap {
  constructor(data){
    this.worlds = [];
    this.lastId = 0;
    if(data.objects){
      for(let obj of data.objects){
        this.addWorld(obj);
      }
    }
  }

  addWorld(data){
    data.id = ++this.lastId;
    const world = new MapObject(data);
    this.worlds.push(world);
    return world;
  }
}
