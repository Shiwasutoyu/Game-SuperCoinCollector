

const ITEM_KINOKO = 1;
const ITEM_COIN = 3;
const ITEM_TIME_KINOKO = 4;
const ITEM_STAR = 5;
const ITEM_FIRE = 8;
const KILL_FROM_UNDER = 99;

// const ITEM_KUSA = 2;

const coinAnime = [5,5,6,7,6,5,5];  
let coinAnimeC = 0;
let coinGet = false;



class Item extends Sprite{

  constructor(sp, x, y, vx, vy, tp) {
    super(sp, x, y, vx, vy);
    if(tp == undefined)tp = ITEM_KINOKO;
    this.tp = tp;
  }

  //-----横の壁の判定-------
  checkWall() {
    
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);

    //-----横の当たりチェック------
    if(field.isBlock(lx+15, ly+3) || 
       field.isBlock(lx+15, ly+12) ||
       field.isBlock(lx, ly+3)   ||
       field.isBlock(lx, ly+12)) {
         this.vx *= -1;
       }

  }

  //----床の判定------
  checkFloor() {
    if(this.vy<=0)return;
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);

    //-----足下の二点で判定------
    if(field.isBlock(lx+1, ly+15) || field.isBlock(lx+14, ly+15)) {
      
      this.vy = 0;
      this.y = ((((ly+15)>>4)<<4)-16)<<4;
      this.stopMove = true;
    }
  }

  update() {

    if(this.kill)return;
    if(ojisan.kinoko)return;   //キノコをとったときは他のキノコは止まる
    if(ojisan.dmg)return;
    if(ojisan.FALL)return;

    switch(this.tp) {

      case ITEM_KINOKO:
        if(this.proc_kinoko())return;
        break;
      case ITEM_COIN:
        if(this.proc_coin())return;
        break;
      case ITEM_TIME_KINOKO:
        if(this.proc_timeKinoko())return;
        break;
          
        case KILL_FROM_UNDER:
          this.proc_killfromunder();
          return;
          
            
            // case ITEM_KUSA:
            //   this.proc_kusa();
            //   return;

    }


    this.checkWall();
    this.checkFloor();
    super.update();

  }

  draw() {
    super.draw();

    // if(this.tp==ITEM_KUSA) {

    //   let c = (this.count-16)>>4;
    //   for(let i = 0; i <= c; i++) {

    //     let an = 486 + 16;
    //     let sx =(an & 15)<<4;
    //     let sy =(an>>4)<<4;
    //     let px = (this.x>>4) - (field.scx);
    //     let py = (this.y>>4) - (field.scy);
    //     let s;
    //     s = 16;
    //     if(i == c) s = (this.count%16);
    //     py += 16 + i * 16;
        
    //     vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, s);
    //   }
    // }

  }


  //----------キノコのとき-----------
  proc_kinoko() {
    if(ojisan.type == TYPE_MINI){
      if(this.checkHit(ojisan)) {   //-------おじさんと当たったかどうか-------
        ojisan.kinoko = 1;
        ojisan.life = 2;
        this.kill = true;
        return true;
      }
    }

    if(++this.count <= 32) {        //-----ニョキニョキでてくる-------
      this.sz = (1+this.count)>>1;
      this.y -= 1<<3;
      if(this.count == 32)this.vx = 24;
      return true;
    }

    return false;
  }


  //-------コインのとき----------
  proc_coin() {
    this.sp = 384;                //-----コインがキラキラする------
    this.sp += coinAnime[coinAnimeC]%5;
    if(coinAnimeC <= 7){
      if(frameCount%8==1){
        coinAnimeC++; 
      }
      if(coinAnimeC==7){
        coinAnimeC = 0;
      }
    }

    if(++this.count <= 1) {        //---コインがとんででてくる-------
      this.vy = -64;
      if(this.count == 1)this.vx = 20;
      return true;
    }

    if(this.checkHit(ojisan)) {   //-------おじさんと当たったかどうか-------
      collectedCoinCount ++;
      coinGet = true;
      this.kill = true;
      return true;
    }

    if(++this.count > 1000){
      this.kill = true;
      return true;
    }

    if(this.stopMove)this.vx = 0;

    return false;  
  }

  //----------タイムキノコのとき-----------
  proc_timeKinoko() {
    if(this.checkHit(ojisan)) {   //-------おじさんと当たったかどうか-------
      cnt += 20;
      timePlus20 = true; 
      this.kill = true;
      return true;
    }

    if(++this.count <= 32) {        //-----ニョキニョキでてくる-------
      this.sz = (1+this.count)>>1;
      this.y -= 1<<3;
      if(this.count == 32)this.vx = 24;
      return true;
    }

    return false;
  }


  //---------敵を下からたおすときの仕組み----------
  proc_killfromunder() {
    for(let i = teki.length - 1; i>=0; i--) {
      if(this.checkHit(teki[i])) {
        teki[i].FALL = true;
        teki[i].KILL_FU = true;
      }
      else {
        this.kill = true;
      }

    }
  }

  //----------くさの処理-----------
  // proc_kusa() {
  //   if(this.y>0) {
  //     this.count++;
  //     if(this.count<16)this.sz = this.count;
  //     else this.sz =16;
  //     this.y -= 1<<4;
  //   }
  // }


}


