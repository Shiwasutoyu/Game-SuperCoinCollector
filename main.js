

//----仮想画面------
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

//----実画面-----
let can = document.getElementById("can");
let con = can.getContext("2d");

//-----------------

let canSIZE = 0.7;

let realSize = 1.4;

vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width = SCREEN_SIZE_W*canSIZE;
can.height = SCREEN_SIZE_H*canSIZE;

con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

//----フレームレート維持------
let frameCount = 0;
let startTime;

//---------ゲームシステム-----------
let GAME_FINISH = false;
let GAME_OVER = false;
let timePlus20 = false;
let timePlusC = 0;
let coinGetC = 0;
let fnishedC = 0;

//-------集めたコインの数----------
let collectedCoinCount = 0;

let chImg = new Image();
chImg.src = "images/sprite_mario4.png";

//-------------オブジェクトたち-------------
//-----キーボード-----
let keyb = {};

//-----おじさん------
let ojisan = new Ojisan(320,576);

//-----フィールド------
let field = new Field();

//------ブロック--------
let block = [];
let item = [];
let teki = [];

//---------------更新処理------------------

function updateObj(obj) {
  //------スプライトのブロック------
  for(let i = obj.length - 1; i>=0; i--) {
    obj[i].update();
    if(obj[i].kill)obj.splice(i,1);
  }
}

function update(){

  //------マップ------
  field.update();

  updateObj(block);
  updateObj(item);
  updateObj(teki);
  
  //------おじさん------
  ojisan.update();  

}

//----スプライトの描画-----
function drawSprite(snum, x, y) {
  let sx = (snum&15)*16;
  let sy = (snum>>4)*16;
  vcon.drawImage(chImg,sx,sy,16,32, x,y,16,32);
}

//--------------描画---------------------------

function drawObj(obj) {
  //------スプライトのブロックを表示------
  for(let i = 0; i<obj.length; i++) {
    obj[i].draw();
  }
}

function draw(){
  
  //------画面を水色でクリア-------
  vcon.fillStyle = "#66AAFF";
  // vcon.fillStyle = "#66bfff";
  vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);

  //------マップを表示--------
  field.draw();
  
  drawObj(block);
  drawObj(item);
  drawObj(teki);
  //-------おじさんを表示--------
  ojisan.draw();
  
  //------デバッグ情報---------
  // vcon.font = "24px 'Impact'";
  // vcon.fillStyle = "white";
  // vcon.fillText("FRAME:" + frameCount, 10,20);

  //-----タイム表示--------
  vcon.font = "22px 'Impact'";
  vcon.fillStyle = "#FFF";
  // vcon.fillStyle = "#11FFFF";
  // vcon.fillStyle = "#43FF6B";
  if(timeDispOut!=undefined){
    vcon.fillText(timeDispOut, 299, 275);
    vcon.font = " 16px 'Impact'";
    vcon.fillText(" s", 360, 275);
  }else{
    vcon.fillStyle = "white";
    vcon.fillText("S T A R T !!", 286, 275);
  }

  //------プラスタイムの表示--------
  if(timePlus20) {
    vcon.font = "18px 'Impact'";
    vcon.fillStyle = "#11FFFF";
    vcon.fillText("+ 20s", 371, 275);
    if(++timePlusC==50){
      timePlus20 = false;
      timePlusC = 0;
    }
  }

  //------コイン数の表示--------
  vcon.font = " 15px 'Impact'";
  vcon.fillStyle = "#FFF";
  vcon.fillText(" x " , 322, 297);
  vcon.font = " 18px 'Impact'";
  if(coinGet == false){
    vcon.fillText(collectedCoinCount, 340, 298);
  }
  vcon.drawImage(chImg,0,384,16,16, 302,283,16,16);

  //------コインゲットの表示--------
  if(coinGet) {
    vcon.font = "18px 'Impact'";
    vcon.fillStyle = "#11FFFF";
    vcon.fillText(collectedCoinCount, 340, 298);
    if(++coinGetC==50){
      coinGet = false;
      coinGetC = 0;
    }
  }


  if(GAME_FINISH) {
    // vcon.fillStyle = "#000";
    // vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    vcon.font = "24px 'Impact'";
    vcon.fillStyle = "white";
    vcon.fillText("F I N I S H  ! !", 278, 360);
    vcon.fillText("T h a n k   y o u  !", 255, 410);
  }

  //-----ゲームオーバー表示--------
  if(GAME_OVER){

    vcon.fillStyle = "#000";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    vcon.font = "22px 'Impact'";
    vcon.fillStyle = "white";
    
    vcon.fillText("G A M E  O V E R . . .", 260, 330);

    vcon.font = "18px 'Impact'";
    vcon.fillText(collectedCoinCount, 342, 371);
    vcon.drawImage(chImg,0,384,16,16, 304,356,16,16);
    vcon.fillText(" x " , 322, 370);

    vcon.fillText("c o i n s   c o l l e c t e d  !", 245, 402);
    vcon.fillText("T h a n k   y o u  !", 273, 435);
  }
    
  //----仮想画面から実画面へ拡大転送-------
  con.drawImage(vcan, 204, 248, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SCREEN_SIZE_W*realSize, SCREEN_SIZE_H*realSize);
}



//---メインループ-----

window.onload = function() {
  startTime = performance.now();

  no_scaling();
  

  // block.push(new Block(374, 10, 19));
  // block.push(new Block(374, 20, 19));
  mainLoop();

}

function mainLoop() {

  let nowTime = performance.now();
  let nowFrame = (nowTime - startTime)/ GAME_FPS;

  if(nowFrame > frameCount) {
    let c = 0;
    while(nowFrame > frameCount) {

      frameCount++;
      update();

      if(++c >= 4)break;

    } 

    //-----------敵がランダムで出てくる、4ポイント------------
    if(rand(1,500 ) == 1){
      teki.push(new Teki(96, 35,34,0,0));     
    };
    // if(rand(1,1000 ) == 1){
    //   teki.push(new Teki(96, 5,24,0,0));     
    // };
    // if(rand(1,1000 ) == 1){
    //   teki.push(new Teki(96, 25,4,0,0));     
    // };
    // if(rand(1,1000 ) == 1){
    //   teki.push(new Teki(96, 5,4,0,0));     
    // };

    //----------定期的にハテナブロックでてくる----------
    if(rand(1,2000 ) == 1){
      block.push(new Block(369, 20, 34));
    };
    if(rand(1,4000 ) == 1){
      block.push(new Block(369, 9, 27));
    };
    if(rand(1,4000 ) == 1){
      block.push(new Block(369, 31, 27));
    };
    if(rand(1,4000 ) == 1){
      block.push(new Block(369, 9, 18));
    };
    if(rand(1,4000) == 1){
      block.push(new Block(369, 31, 18));
    };
    if(rand(1,2000 ) == 1){
      block.push(new Block(369, 20, 18));
    };

    

    draw();
  }
  
  if(GAME_OVER){
    return;
  }

  if(GAME_FINISH){
    return;
  }

  requestAnimationFrame(mainLoop);
  
  
}


//----押されたとき------
document.onkeydown = function(e) {

  if(ojisan.life){

    if(e.keyCode == 37)keyb.Left = true;
    if(e.keyCode == 39)keyb.Right = true;
    if(e.keyCode == 90)keyb.BBUTTON = true;
    if(e.keyCode == 88)keyb.ABUTTON = true;
    
  }
  
  if(e.keyCode == 65 )field.scx--;
  if(e.keyCode == 83 )field.scx++;
}

//----離されたとき------
document.onkeyup = function(e) {

  if(e.keyCode == 37)keyb.Left = false;
  if(e.keyCode == 39)keyb.Right = false;
  if(e.keyCode == 90)keyb.BBUTTON = false;
  if(e.keyCode == 88)keyb.ABUTTON = false;


}

//---------------スマホでタッチのとき--------------------

//---------ズームできないようにする------------
function no_scaling(){
  document.addEventListener("touchmove",mobile_no_scroll,{passive:false});
}
function mobile_no_scroll(event){
  if(event.touches.length >= 1) {
    event.preventDefault();
  }
}

//-----L & R------
LeftBTN.addEventListener("touchstart", () =>{
  keyb.Left = true; 
})

RightBTN.addEventListener("touchstart", () =>{
  keyb.Right = true; 
})

LeftBTN.addEventListener("touchend", () =>{
  keyb.Left = false; 
})

RightBTN.addEventListener("touchend", () =>{
  keyb.Right = false; 
})

//------A & B----------

aBTN.addEventListener("touchstart", () =>{
  keyb.ABUTTON = true; 
})

bBTN.addEventListener("mousedown", () =>{
  keyb.ABUTTON = true;
})

aBTN.addEventListener("touchend", () =>{
  keyb.ABUTTON = false; 
})

bBTN.addEventListener("mouseup", () =>{
  keyb.ABUTTON = false;
})

//-----SIZE------
// resizeBTN.addEventListener("touch", () =>{
//   if(sizeUp == false){
//     sizeUp = true; 
//     canSIZE = 1;
//     realSize = 2;
//   }else{
//     sizeUp = false;
//     canSIZE = 0.7;
//     realSize = 1.4;
//   }

// })



