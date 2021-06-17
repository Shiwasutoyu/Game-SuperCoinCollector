//-------敵クラス--------
//spにわたす数値でスプライトを決定する


const TEKI_KURIBO = 1;
const DEBUG_KURIBO = 6;
// const TEKI_KAME = 2;


class Teki extends Sprite{

  constructor(sp, x, y, vx, vy, tp) {
    super(sp, x, y, vx, vy);
    if(tp == undefined)tp = TEKI_KURIBO;
    this.tp = tp;
    if(this.tp == TEKI_KURIBO)this.vx = 5;  //----歩くスピード--
    if(this.tp == DEBUG_KURIBO)this.vx = 0; 
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
    }

  }

  update() {

    this.aCount++;

    if(this.kill)return;
    if(ojisan.dmg)return;  
    
    if(ojisan.FALL)return;  
    if(ojisan.kinoko)return;

    switch(this.tp) {

      case TEKI_KURIBO:
        if(this.FALL == true){
          if(this.KILL_FU == true){   //------下からたおされたら-------
            this.sp = 120;
            this.coinDropC++;
            if(this.coinDropC == 1) {
              let lx = ((this.x+this.vx)>>4);   //----コインがでてくる-----
              let ly = ((this.y+this.vy)>>4);
              let x = (lx + 12)>>4;
              let y = (ly)>>4;
              item.push(new Item(384,x, y,0,0, ITEM_COIN));
            }

          } 
        }
        else if(this.Stamped == true) {
          this.sp = 98;         //-----ふまれたアニメ-------
          this.stampedCount++;
          if(this.stampedCount == 30)this.kill = true;
        }
        else{
          this.sp = 96 + (this.aCount/20%2);    //-----歩いているアニメ-----
          if(ojisan.muteki == 0 ) {
            if(this.proc_kuribo())return;  //------マリオがムテキのとき、敵がふまれたときは当たり判定しない----------
          }
        }
        break;

      case DEBUG_KURIBO:       //----デバッグ用クリボー------
        this.sp = 99;
        if(ojisan.muteki == 0 ) {
          if(this.proc_D_kuribo())return;  
        }
        
    }

    // if(this.FALL == false)this.checkWall();
    // if(this.Stamped == false)this.checkWall();

    if(!this.FALL && !this.Stamped)this.checkWall();
    if(!this.FALL && !this.Stamped)this.checkFloor();
    
    // if(this.FALL == false)this.checkFloor();
    // if(this.Stamped == false)this.checkFloor();

    if(this.Stamped == false)super.update();

  }

  draw() {
    super.draw();
  }

  //----------クリボーの処理-----------
  proc_kuribo() {
    
    if(this.FALL == false) {
      if(this.checkHit(ojisan)) {   //-------おじさんと当たったら-------   
  
        if(this.checkStamp(ojisan)){
          this.Stamped = true;      //---------ふまれたらつぶれる--------
          ojisan.hitJump = true;

          let lx = ((this.x+this.vx)>>4);   //----コインがでてくる-----
          let ly = ((this.y+this.vy)>>4);
          let x = (lx + 12)>>4;
          let y = (ly)>>4;
          item.push(new Item(384,x, y,0,0, ITEM_COIN));

        }else{
          ojisan.muteki = 50;     //------横からあたっていればマリオにダメージ&一定時間ムテキ----------
  
          this.vx *= -1;
          ojisan.dmg = 1;
          ojisan.life -= 1;
        }
        return true;
      }
    }

  
    return false;

  }

  proc_D_kuribo() {

    if(this.checkHit(ojisan)) {   //-------おじさんと当たったら-------   

      if(this.checkStamp(ojisan)){
        this.FALL = true;      //---------ふまれてたら落ちる--------
      }else{
        ojisan.muteki = 50;     //------横からあたっていればマリオにダメージ&一定時間ムテキ----------

        this.vx *= -1;
        ojisan.dmg = 1;
      }
      return true;
    }

    return;
  }





}


