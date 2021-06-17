
let totalSec = 120;
let cnt = totalSec;
let minu = 0;
let sec = 0; 
let timeDispOut;

// let dt = new Date();
// let endDt = new Date(dt.getTime() + cnt * 1000);

let id = setInterval(function(){
  cnt--;
  // console.log(cnt);
  minu = Math.floor(cnt / 60);
  sec = cnt % 60;
  if (sec < 10 )sec = ("0" + sec);
  timeDisp = ("0" + minu + " ' " + sec);

  timeDispOut = timeDisp;  
  
  if(cnt == 0){
    GAME_FINISH = true;
    clearInterval(id);
  }

  // let endDt = new Date(dt.getTime() + cnt * 1000);
  // dt = new Date();
  // if(dt.getTime() >= endDt.getTime()) {
    // }
    
}, 1000);

