// this activates the listening button and prints the text//

const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");


// This stores timestamp of the last word heard
let lastTimestamp = null;

// define 'recognition' outside the function so we can start and stop it
let recognition;

// This flag tells us if the app is currently listening or not
let isListening = false;

// When the Start button is clicked
startBtn.addEventListener("click", () => {

  // If it's already listening, stop the speech recognition
  if (isListening) {
    recognition.stop(); // stops listening
    startBtn.textContent = "Start Listening"; // update button text
    startBtn.style.backgroundColor = ""; // reset button color
    isListening = false;
    return; // exit the function
  }

  // Create a new SpeechRecognition object (Web Speech API)
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  // Tell it to keep listening even after each phrase ends
  recognition.continuous = true;

  // We only want final results (not in-progress guesses)
  recognition.interimResults = false;


  console.log("Recognition started");  // checking to see if recognition started

 
  recognition.onstart = () => {
    console.log("Listening...");
    startBtn.textContent = "Stop Listening";
    startBtn.style.backgroundColor = "#d7263d";
    isListening = true;
  };

  // check for errors in console 
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  // When recognition stops 
  recognition.onend = () => {
    startBtn.textContent = "Start Listening"; // reset text
    startBtn.style.backgroundColor = ""; // reset style
    isListening = false;
  };



 // Get the most recent heard result
  recognition.onresult = (event) => {
    console.log("Result recorded");
    console.log(event);
   
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.trim(); 
    const words = transcript.split(" ");
    const now = Date.now();
    const word = words[words.length - 1];


    // display that word
    let span = document.createElement("span");
    span.textContent = word;

    // Check how much time passed since the last word
    if (lastTimestamp) {
      let gap = now - lastTimestamp; // difference in milliseconds


      if (gap < 600) {
        span.className = "short-pause"; // quick pause = maybe excited
      } else if (gap < 1500) {
        span.className = "medium-pause"; // medium pause = natural pacing
      } else {
        span.className = "long-pause"; // long pause = maybe thinking or dramatic
      }
    }


    // Save this timestamp for the next comparison + Add the word to html 
    lastTimestamp = now;
    output.appendChild(span);
};

  // Start listening 
  recognition.start();
});