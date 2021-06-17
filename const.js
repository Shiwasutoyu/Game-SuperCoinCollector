
const GAME_FPS = 1000/60;
const SCREEN_SIZE_W = 496;
const SCREEN_SIZE_H = 496;


//-----一画面あたりのブロック数--------
const MAP_SIZE_W = SCREEN_SIZE_W/16;
const MAP_SIZE_H = SCREEN_SIZE_H/16;

//-------------------
const FIELD_SIZE_W = 41;
const FIELD_SIZE_H = 41;

//-------ランダムの生成---------
function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

//--------スマホのとき関連--------
const LeftBTN = document.getElementById("move-btn1");
const RightBTN = document.getElementById("move-btn2");
const aBTN = document.getElementById("a-btn");
const bBTN = document.getElementById("b-btn");
const resizeBTN = document.getElementById("resize-btn");
// let sizeUp = false;



//--------------基本クラス-----------------
class Sprite {

  constructor(sp, x, y, vx, vy) {

    this.sp = sp;
    this.x = x<<8;
    this.y = y<<8;
    this.ay = 0;
    this.w = 16;
    this.h = 16;
    this.vx = vx;
    this.vy = vy;
    this.sz = 0;
    
    this.kill = false;
    this.FALL = false;
    this.count = 0;
    this.aCount = 0;
    this.KILL_FU = false;
    this.KILL_FU_JUMP = false;
    this.KILL_FU_C = 0;
    this.Stamped = false;
    this.stampedCount = 0;
    this.stopMove = false;
    this.nx = ((this.x+this.vx)>>4); 
    this.ny = ((this.y+this.vy)>>4);
    this.coinDropC = 0;

    

  }

  //------当たり判定-------
  checkHit(obj) {

    let left1 = (this.x >> 4)    +2;
    let right1 = left1 + this.w  -4;
    let top1 = (this.y >> 4)     +5 + this.ay;
    let bottom1 = top1 + this.h  -7;

    let left2 = (obj.x >> 4)     +2;
    let right2 = left2 + obj.w   -4;
    let top2 = (obj.y >> 4)      +5 + obj.ay;
    let bottom2 = top2 + obj.h   -7;

    return (
      left1 <= right2 &&
      right1 >= left2 &&
      top1 <= bottom2 &&
      bottom1 >= top2
    );

  } 

  //----ふまれたかどうか----
  checkStamp(obj) {
    
    let left1 = (this.x >> 4)    +2;
    let right1 = left1 + this.w  -4;
    let top1 = (this.y >> 4)     +5 + this.ay;
    let bottom1 = top1 + this.h  -7;

    let left2 = (obj.x >> 4)     +2;
    let right2 = left2 + obj.w   -4;
    let top2 = (obj.y >> 4)      +5 + obj.ay;
    let bottom2 = top2 + obj.h   -7;

    let ENMly = ((obj.y+obj.vy)>>4);    //-----マリオの上半分---
    let ENMly2 = ENMly + (obj.type == TYPE_MINI?22:23);

    return (
      left1 <= right2 &&
      right1 >= left2 &&
      top1 <= bottom2 &&
      bottom1 >= top2 &&
      ENMly2 <= (top1)
    );
    
  }

  


  update() {
    if(this.vy<64)this.vy+=GRAVITY;
    this.x+=this.vx;
    this.y+=this.vy;
    if((this.y>>4) > FIELD_SIZE_H*16)this.kill = true;             
  }

  draw() {
    let an = this.sp;
    let sx =(an & 15)<<4;
    let sy =(an>>4)<<4;
    let px = (this.x>>4) - (field.scx);
    let py = (this.y>>4) - (field.scy);
    let s;

    if(this.sz)s = this.sz;
    else s = 16;

    vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, s);
  }
}

