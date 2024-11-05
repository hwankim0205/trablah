const DEEPL_API_KEY = 'dff0b093-db59-4ae4-8afd-3a2c62db1ae1';

let portname = 'COM3';
let serial;
let value;
let ringbell;

let font100;
let font200;
let font300;
let font400;
let font500;
let font600;

let pageState = 0;
let scenState = 0;
let recoState = 0;
let btnState = 0;

let bg00;
let bg01;
let bg02;
let box01;
let box02;
let webcam;

let currentDate;
let currentTime;

let bellTime = 0;
let btnTime = 0;
let ansTime = 0;

let tts;
let stt_outsider;
let stt_insider;

let outsiderText = "";
let japanText = "";

let insiderText = "";
let koreaText ="";

function preload(){
  tts = new p5.Speech();
  tts.setLang("ko-KR");
  stt_outsider = new p5.SpeechRec('ko-KR', gotSpeechOutsider);
  stt_insider = new p5.SpeechRec('ja-JP', gotSpeechInsider);
  bg00 = loadImage('img/00_homeview.png');
  bg01 = loadImage('img/01_conversationview.png');
  bg02 = loadImage('img/02_translationview.png');
  box01 = loadImage('img/03_box01.png');
  box02 = loadImage('img/04_box02.png');
  
  font100 = loadFont('font/Roboto-Thin.ttf');
  font200 = loadFont('font/Roboto-Light.ttf');
  font300 = loadFont('font/Roboto-Regular.ttf');
  font400 = loadFont('font/Roboto-Medium.ttf');
  font500 = loadFont('font/Roboto-Bold.ttf');
  font600 = loadFont('font/Roboto-Black.ttf');
  
  webcam = createCapture(VIDEO);
  webcam.size(1187,942);
  webcam.hide();
  
  ringbell = loadSound('doorbell.mp3');
  
}

function setup() {
  createCanvas(1920,1280);
  create_serial();
  
  calculateCurrentDate();
 
  
}
async function gotSpeechOutsider(){
  console.log(stt_outsider.resultString);
  outsiderText = stt_outsider.resultString;
  
  translateKoJP(outsiderText);
  //console.log(splitTokens(trim(outsiderText, "택배")));
}
async function gotSpeechInsider(){
  console.log(stt_insider.resultString);
  insiderText = stt_insider.resultString;
  
  translateJPKo(insiderText);
  //console.log(splitTokens(trim(outsiderText, "택배")));
}

function create_serial(){
  serial = new p5.SerialPort();
  serial.on("data", serialEvent);
  serial.open(portname);
  
  function serialEvent(){
    let inString = serial.readLine();
    if(inString.length > 0){
      value = Number(inString);
    }
  }
}

function serialEvent(){
  let inString = serial.readLine();
  if(inString.length > 0){
    value = Number(inString);
  }
} 

function draw() {
  //scale(0.5);
  //console.log(value);
  calculateCurrentTime();
  checkDoorbell();
  //serialEvent();  
  
  console.log(value);
  
  noTint();
  background(10);
  
  if(pageState == 0){ //Just Draw Main Page
    image(bg00, 0,0,width,height);
    drawDate_Time();
    if(value > 5000){
      pageState = 1;
    }
  }else if(pageState == 1){
    if(scenState == 0){

      drawCamera();
      image(bg01, 0,0,width,height);
      drawDate_Time();
      
      if(recoState == 0){
        fill(205);
        textSize(32);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto");
        text(". . .", 1575, 490);
        text(". . .", 1575, 770);
  
      }else if(recoState == 1){
        if(btnState == 1){
          tint(255,255 - (255.0*(millis() - btnTime)/3000));
          image(box01, 1287, 370, 573, 240);
        }else if(btnState == 2){
          tint(255,255 - (255.0*(millis()- btnTime)/3000));
          image(box01, 1287, 650, 573, 240);
        }
        if(millis() - btnTime >= 3000 ){
          btnState = 0;
          onceBell = -1;
        }
        noTint();
        fill(232);
        textSize(36);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto");
        text("ドアの前に置いて行ってください", 1575, 482);
        text("ドアを開けてあげます", 1575, 762);
        
        fill(205);
        textSize(32);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto");
        text("문 앞에 두고 가주세요", 1575, 540);
        text("문 열어 드리겠습니다", 1575, 820);
      }else if(recoState == 2){
        fill(232);
        textSize(36);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto");
        text("ドアを開けてあげます", 1575, 482);
        text("ドアを開けてあげます", 1575, 762);
        
        fill(205);
        textSize(32);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto");
        text("문 열어 드리겠습니다", 1575, 540);
        text("네, 잠시만요", 1575, 820);
      }
            
      if(outsiderText == ""){
        
        if((millis() - bellTime)%2400 < 600){
          
        }else if((millis() - bellTime)%2400 >= 600 &&(millis() - bellTime)%2400 < 1200 ){
          fill(205);
          textSize(48);
          textStyle(BOLD);
          textAlign(LEFT);
          textFont("Roboto");
          text(".", 100,944);
        }else if((millis() - bellTime)%2400 >= 1200 &&(millis() - bellTime)%2400 < 1800 ){
          fill(205);
          textSize(48);
          textStyle(BOLD);
          textAlign(LEFT);
          textFont("Roboto");
          text(". .", 100,944);
        }
        else if((millis() - bellTime)%2400 >= 1800 &&(millis() - bellTime)%2400 < 2400 ){
          fill(205);
          textSize(48);
          textStyle(BOLD);
          textAlign(LEFT);
          textFont("Roboto");
          text(". . .", 100,944);
        }
      }else{
        fill(232);
        textSize(48);
        textStyle(BOLD);
        textAlign(LEFT);
        textFont("Roboto"); 
        text(japanText, 100,944);
        
        fill(205);
        textSize(40);
        textStyle(NORMAL);
        textAlign(LEFT);
        textFont("Roboto");
        text(outsiderText, 100,1012);
      }
      
      
      
    }else if(scenState == 1){
      drawCamera();
      image(bg02, 0,0,width,height);
      drawDate_Time();
      
      noTint();
      if(insiderText == ""){
        
        if((millis() - ansTime)%2400 < 600){
          
        }else if((millis() - ansTime)%2400 >= 600 &&(millis() - ansTime)%2400 < 1200 ){
          fill(205);
          textSize(48);
          textStyle(NORMAL);
          textAlign(CENTER);
          textFont("Roboto");
          text(".", 1575, 640);
        }else if((millis() - ansTime)%2400 >= 1200 &&(millis() - ansTime)%2400 < 1800 ){
          fill(205);
          textSize(48);
          textStyle(NORMAL);
          textAlign(CENTER);
          textFont("Roboto");
          text(". .", 1575, 640);
        }
        else if((millis() - ansTime)%2400 >= 1800 &&(millis() - ansTime)%2400 < 2400 ){
          fill(205);
          textSize(48);
          textStyle(NORMAL);
          textAlign(CENTER);
          textFont("Roboto");
          text(". . .", 1575, 640);
        }
      }else{
        fill(232);
        textSize(36);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto"); 
        text(insiderText, 1575, 620);
        
        fill(205);
        textSize(32);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont("Roboto");
        text(koreaText, 1575, 660);
      }
      
      
    }
  }
  
}

function drawCamera(){
  image(webcam, 60,138,1187,942);
}

function drawDate_Time(){
  fill(205);
  noStroke();
  textSize(32);
  textStyle(NORMAL);
  textFont("Roboto");
  textAlign(LEFT);
  text(currentDate, 62, 84);
  textAlign(RIGHT);
  text(currentTime, width-62, 84);
  
}
let onceBell = -1;
function checkDoorbell(){
  if(value >= 5000 && pageState == 0 && onceBell == -1){
    pageState = 1;
    sceneState = 0;
    mouseReleased();
    ringdingdong();
    onceBell = onceBell*onceBell;
  }else if(value >= 5000 && pageState == 1 && onceBell == -1){
    mouseReleased();
    ringdingdong();
    onceBell = onceBell*onceBell;
  }
}

function ringdingdong(){
  bellTime = millis();
  if(!ringbell.isPlaying()){
    ringbell.play();
  }
}


function calculateCurrentDate(){
  currentDate = ''+nf(year(),4,0)+'年'+nf(month(),2,0)+'月'+nf(day(),2,0)+'日'; 
  if(day() == 12){
    currentDate = currentDate + ' ' + '火曜日';
  }else if(day() == 13){
    currentDate = currentDate + ' ' + '水曜日';
  }else if(day() == 14){
    currentDate = currentDate + ' ' + '木曜日';
  }else if(day() == 15){
    currentDate = currentDate + ' ' + '水曜日';
  }else if(day() == 16){
    currentDate = currentDate + ' ' + '金曜日';
  }else if(day() == 17){
    currentDate = currentDate + ' ' + '土曜日';
  }else if(day() == 18){
    currentDate = currentDate + ' ' + '日曜日';
  }else{
    currentDate = currentDate + ' ' + '月曜日';
  }
}
function calculateCurrentTime(){
  currentTime = ''+nf(hour(),2,0)+':'+nf(minute(),2,0);
}

function keyReleased(){
  if(keyCode == ENTER){
    let fs = fullscreen();
    fullscreen(!fs);
  }else if(keyCode == RIGHT_ARROW){
    pageState = (pageState + 1) % 2;
  }else if(keyCode == LEFT_ARROW){
    pageState = (pageState - 1) % 2;
  }else if(keyCode == UP_ARROW){
    scenState = (scenState + 1) % 2;
  }else if(keyCode == DOWN_ARROW){
    scenState = (scenState - 1) % 2;
  }
}

function mouseReleased(){
  if(mouseX <= 50 && mouseY <=50){
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if(mouseX >= 1287 && mouseX <= 1860 && mouseY >= 138 && mouseY <= 258){
    pageState = 0;
    scenState = 0;
    btnState = 0;
    recoState = 0;
    btnTime = 0;
    bellTime = 0;
    ansTime = 0;
    outsiderText = "";
    japanText = "";
    insiderText = "";
    koreaText ="";
    onceBell = -1;
  }else if(mouseX >= 1287 && mouseX <= 1860 && mouseY >= 370 && mouseY <= 609){
    if(pageState == 1 && scenState == 0){
      btnTime = millis();
      if(recoState == 1){
        tts.speak("문 앞에 두고 가주세요");
        btnState = 1;
      }else if(recoState == 2){
        tts.speak("문 열어 드리겠습니다");
        btnState = 1;
      }
    }  
  }else if(mouseX >= 1287 && mouseX <= 1860 && mouseY >= 650 && mouseY <= 890){
    if(pageState == 1 && scenState == 0){
      btnTime = millis();
      if(recoState == 1){
        tts.speak("문 열어 드리겠습니다");
        btnState = 2;
      }else if(recoState == 2){
        tts.speak("네, 잠시만요");
        btnState = 2;
      }
    }  
  }else if(mouseX >= 1287 && mouseX <= 1860 && mouseY >= 960 && mouseY <= 1080){
    btnTime = millis();
    if(pageState == 1 && scenState == 0){
      scenState = 1;
      ansTime = millis();
      stt_insider.start(true, false);
      console.log("Listening Insider");
    }else if(pageState == 1 && scenState == 1 && insiderText != ""){
      tts.speak(koreaText);
      
      delay(4000);
      
      scneState = 0;
      scenState = 0;
      insderText = "";
      koreaText = "";
      outsiderText = "";
      japanText = "";
      recoState = 0;
      btnTime = 0;
      bellTime = 0;
      ansTime = 0;
      onceBell = -1;
      
      stt_outsider.start(true, false);
      console.log("Listening Outsider");
    }  
  }else{
    stt_outsider.start(true, false);
    console.log("Listening Outsider");
  }
  
}

async function translateKoJP(msg) {
  const koreanText = msg;

  // DeepL API를 통한 번역 요청 설정
  const url = `https://api.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(koreanText)}&target_lang=JA`;

  try {
    // API 요청 보내기
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    // 번역된 텍스트 설정
    japanText = data.translations[0].text;
    console.log(japanText);
  } catch (error) {
    console.error('Error translating text:', error);
    japanText = 'Translation failed.';
  }
  if(koreanText.includes("택배")){
    recoState = 1;
    console.log("택배");
  }else if(koreanText.includes("경비실")){
    recoState = 2;
    console.log("경비실");
  }
}


async function translateJPKo(msg) {
  const japaneseText = msg;

  // DeepL API를 통한 번역 요청 설정
  const url = `https://api.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(japaneseText)}&target_lang=KO`;

  try {
    // API 요청 보내기
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    // 번역된 텍스트 설정
    koreaText = data.translations[0].text;
    console.log(koreaText);
  } catch (error) {
    console.error('Error translating text:', error);
    koreaText = 'Translation failed.';
  }
  
}
