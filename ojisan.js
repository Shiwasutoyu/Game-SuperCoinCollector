
const ANIME_STAND = 1;
const ANIME_WALK  = 2;
const ANIME_BREAK = 4;
const ANIME_JUMP  = 8;
// const ANIME_FALL  = 10;
const GRAVITY     = 4;
const MAX_SPEED = 32;

const TYPE_MINI = 1;
const TYPE_BIG = 2;
const TYPE_FIRE = 4;


class Ojisan {
  constructor(x,y) {
    this.x      = x<<4;
    this.y      = y<<4;
    this.ay     = 16;
    // this.ay     = 0;
    this.w      = 16;
    this.h      = 16;
    this.vx     = 0;
    this.vy     = 0;
    this.anime  = 0;
    this.snum   = 0;
    this.aCount = 0;
    this.direc  = 0;
    this.jump   = 0;

    this.kinoko = 0;
    this.dmg = 0;
    this.life = 1;
    this.muteki = 0;
    this.type = TYPE_MINI;
    this.fallAnimeCount = 0;
    this.FALL = false;
    this.hitJump = false;
    this.jumpCount = 0;
    // let nx = ((this.x+this.vx)>>4); 
    // let ny = ((this.y+this.vy)>>4);

  }

  //----床の判定------
  checkFloor() {
    if(this.vy<=0)return;
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);

    let p = this.type == TYPE_MINI?2:0;

    //-----足下の二点で判定------
    if(field.isBlock(lx+1 + p, ly+31) || field.isBlock(lx+14  - p, ly+31)) {
      if(this.anime==ANIME_JUMP)this.anime = ANIME_WALK;
      this.jump = 0;
      this.vy = 0;
      // keyb.ABUTTON = false;
      this.y = ((((ly+31)>>4)<<4)-32)<<4;

    }
  }

  //----横の壁の判定------
  checkWall() {
    
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);
    let p = this.type == TYPE_MINI?16+8:9;


    //-----右側のチェック------
    if(field.isBlock(lx+15, ly+p) ||   //----体の横三点で判定-----
      (this.type == TYPE_BIG && (
       field.isBlock(lx+15, ly+15) ||
       field.isBlock(lx+15, ly+24)))) {
         this.vx = 0;
         this.x -= 8;
       }

    //----左側のチェック-----
    else
    if(field.isBlock(lx, ly+p) ||
        (this.type == TYPE_BIG && (
       field.isBlock(lx, ly+15) ||
       field.isBlock(lx, ly+24)))) {
         this.vx = 0;
         this.x += 8;
       }
  }

  //----天井の判定------
  checkCeil() {
    if(this.vy>=0)return;
    let lx = ((this.x+this.vx)>>4); 
    let ly = ((this.y+this.vy)>>4);

    let ly2 = ly + (this.type == TYPE_MINI?21:5);

    let bl;
    if(bl=field.isBlock(lx+8, ly2)) {   //-----頭上の一点で判定------
      this.jump = 15;
      this.vy = 0;

      let x = (lx+8)>>4;
      let y = (ly2)>>4;

    
      if(bl == 369) {            //----ハテナブロック----
        block.push(new Block(374, x, y));
        let itemNumber = rand(1,4);
        if(itemNumber==1) {
          item.push(new Item(218,x, y,0,0, ITEM_KINOKO));
        }else if(itemNumber==2){
          item.push(new Item(219,x, y,0,0, ITEM_TIME_KINOKO));
        }else if(itemNumber==3){
          item.push(new Item(384,x, y-1,0,0, ITEM_COIN));
        }else{
          item.push(new Item(384,x, y-1,0,0, ITEM_COIN));
        }
        // item.push(new Item(486,x, y,0,0, ITEM_KUSA));
      }

      if(bl == 372){
        item.push(new Item(239,x, y-1,0,0, KILL_FROM_UNDER));
        if(this.type == TYPE_MINI ){
              block.push(new Block(bl, x, y));
        }
        else {
          block.push(new Block(bl, x, y, 1, 20, -60));
          block.push(new Block(bl, x, y, 1, -20, -60));
          block.push(new Block(bl, x, y, 1, 20, -20));
          block.push(new Block(bl, x, y, 1, -20, -20));
        }
      }

    }
  }

  updateJump() {                   //-----ジャンプ------

    if(keyb.ABUTTON) {
      if(this.jump == 0) {
        this.anime = ANIME_JUMP;
        this.jump = 1;
      }
      if(this.jump<15) {
        if(this.y>64){             //-----空近くでは不可-----
          this.vy = -(64-this.jump);
        }
      }
    }


    if(this.jump)this.jump++;
    

  }

  updateWalkSub(direc) {

    if(direc == 0 && this.vx < MAX_SPEED)this.vx++;
    if(direc == 1 && this.vx > -MAX_SPEED)this.vx--;

    //-----ジャンプしてないとき------
    if(!this.jump) {

      //--------立ってるときはカウンタリセット----------
      if(this.anime == ANIME_STAND)this.aCount = 0;

      //----アニメを歩きアニメ-----
      this.anime = ANIME_WALK;

      //----方向を設定-----
      this.direc = direc;

      //----逆方向のときはブレーキをかける-----
      if(direc == 0 && this.vx < 0)this.vx++;
      if(direc == 1 && this.vx > 0)this.vx--;

      //----逆に強い加速のときはブレーキアニメ-----
      if(direc == 1 && this.vx > 8 || direc == 0 && this.vx < -8)this.anime = ANIME_BREAK;

    }
  }

  updateWalk() {

    //-----横移動----
    if(keyb.Left) {
      this.updateWalkSub(1);
        
    } else if(keyb.Right) {
      this.updateWalkSub(0);
        
    } else {
      if(!this.jump) {
        if(this.vx > 0)this.vx-=1;
        if(this.vx < 0)this.vx+=1;
        if(!this.vx)this.anime=ANIME_STAND;
      }
    }

  }

  updateAnime() {

    //-------スプライトの決定------
    switch(this.anime) {

      case ANIME_STAND:
        this.snum = 0;
        break;
      case ANIME_WALK:
        this.snum = 2 + ((this.aCount / 6)%3);
        break;
      case ANIME_JUMP:
        this.snum = 6;
        break;
      case ANIME_BREAK:
        this.snum = 5;
        break;
      // case ANIME_FALL:
      //   this.snum = 16;
      //   break;

    }

    //------小さいとき----------
    if(this.type == TYPE_MINI)this.snum += 32;

    //-----左向きのとき-------
    if(this.direc)this.snum += 48;

  }

  update() {

    //------キノコをとったときのエフェクト--------
    if(this.kinoko) {

      let anime = [32,14,32,14,32,14,9,32,14,0];
      this.snum = anime[this.kinoko>>2];
      this.h = this.snum == 32?16:32;
      if(this.direc)this.snum += 48;
      if(++this.kinoko==40){
        this.type = TYPE_BIG;   //-----大きくなる-----------
        // this.ay = 0;     //////????????
        this.kinoko=0;
      }
      return;

    }

    //------ダメージを受けたとき--------
    if(this.dmg) {

      if(this.life == 0) {

        if(++this.fallAnimeCount <= 37) {     //----ぴょーんと落ちていく-----
          this.sz = (1+this.fallAnimeCount)>>1;
          this.FALL = true;
          if(this.fallAnimeCount >=18) {
            this.y -= 2<<4;
          }
          if(this.fallAnimeCount == 33){
            this.dmg = 0;
          }
        }




      }else{
 
        let anime = [0,14,32,9,14,32,14,32,14,32];
        this.snum = anime[this.dmg>>2];   //----4フレームおきにまわす----------
        this.h = this.snum == 32?16:32;
        if(this.direc)this.snum += 48;
        if(++this.dmg==40){
          this.type = TYPE_MINI;  
          this.dmg = 0;
        }
        
      }

      return;

    }

    if(this.muteki > 0)this.muteki--;

    if((this.y>>4) > FIELD_SIZE_H*16)GAME_OVER = true;  //----落ちたらゲームオーバー

    if(this.FALL){        //------落ちてるときは移動できない------
      this.vx = 0;
    }

    if(this.hitJump == true) {    //-----敵を踏んだらジャンプ------
      if(this.jumpCount <= 5) {
        this.jumpCount++;
        if(this.jumpCount == 1){
          this.jump = 0;
          keyb.ABUTTON = true;
          // item.push(new Item(384,this.nx, this.ny-1,0,0, ITEM_COIN));
        }
        if(this.jumpCount == 5) {
          this.jumpCount = 0;
          this.hitJump = false;
          keyb.ABUTTON = false;
        }
      }
    }

    

    this.aCount++;        //-----アニメ用カウンタ------
    if(Math.abs(this.vx)==MAX_SPEED)this.aCount++;

    this.updateJump();
    this.updateWalk();
    this.updateAnime();


    //--------重力------
    if(this.vy < 64)this.vy+=GRAVITY;
    
    //-----床のチェック-----
    if(this.FALL == false) {
      this.checkFloor();
    }

    //-----横の壁のチェック-----
    this.checkWall();

    //-----天井のチェック------
    this.checkCeil();

    //-----実際の座標------
    this.x += this.vx;
    this.y += this.vy;



  }

  draw() {
    let px = (this.x>>4)-field.scx;
    let py = (this.y>>4)-field.scy;
    let sx = (this.snum&15)<<4;  
    let sy = (this.snum>>4)<<4;
    
    let w = this.w;
    let h = this.h;

    py +=(32-h);

    if(this.FALL == true) {
      vcon.drawImage(chImg,223,33,w,h,px,py,w,h);
    }else{
      vcon.drawImage(chImg,sx,sy,w,h,px,py,w,h);
    }
  
  }


}