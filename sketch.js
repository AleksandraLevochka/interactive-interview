let bttn; //a button to click to start speech recognition
let rec = new p5.SpeechRec("en-US"); //a speech recognition object set up to recognize US English
rec.interimResults = true; //setting interimResults to be true so we can see results as we speak
let displayT = ""; //a global variable to store what the program hears/text to display

function setup() {
  createCanvas(windowWidth, windowHeight);
  bttn = createButton("START TALKING");
  bttn.position(50,height/10);
  bttn.mousePressed(startListening); //when the button is pressed go to a callback function to start speech recognition
}
function startListening() {
  rec.start(); //start speech recognition
  rec.onResult = displaySpeech; //when results come in, go to the function displaySpeech
}

function displaySpeech() {
  displayT = rec.resultString; //save the result string to the variable
}
function draw() {
  background("lightgreen");
  textAlign(CENTER);
  textSize(height/20);
  text(displayT, 0, height / 2, width); //display what the program hears
}
