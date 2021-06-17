

class Block {

  constructor(block, x, y,ty ,vx, vy) {
    if(ty == undefined)ty  = 0;
    this.ty = ty;
    if(vx == undefined)vx  = 0;
    this.vx = vx;
    if(vy == undefined)vy  = 0;
    this.vy = vy;

    this.block = block;
    this.ox = x;
    this.oy = y;
    this.x = x << 8;
    this.y = y << 8;

    this.kill = false;
    this.count =0;

    fieldData[y * FIELD_SIZE_W + x] = 367;

  }

  update() {
    if(this.kill)return;
    if(++this.count == 11 && this.ty == 0) {
      this.kill=true;
      fieldData[this.oy * FIELD_SIZE_W + this.ox] = this.block;
      return;
    }
    if(this.ty == 0)return;

    if(this.vy<64)this.vy+=GRAVITY;
    this.x+=this.vx;
    this.y+=this.vy;

  }

  draw() {
    if(this.kill)return;

    let an;
    if(this.ty == 0)an = this.block;
    else an = 388 + ((frameCount>>4)&1);

    let sx =(an & 15)<<4;
    let sy =(an>>4)<<4;

    let px = (this.x>>4) - (field.scx);
    let py = (this.y>>4) - (field.scy);

    if(this.ty==0) {
      const anime = [0,2,4,5,6,5,4,2,0,-2,-1];
      py -= anime[this.count];
    }

    vcon.drawImage(chImg, sx, sy, 16, 16, px, py, 16, 16);
  }

}

