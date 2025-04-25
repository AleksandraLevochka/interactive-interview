// this activates the listening button and prints the text//

const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");

const leftPanel = document.getElementById("leftPanel"); // animate bg of left screen

// stores timestamp of the last word heard
let lastTimestamp = null;

let recognition;

// to understand if the site is currently listening or not
let isListening = false;

// when start button is clicked
startBtn.addEventListener("click", () => {
  // If it's already listening, stop the speech recognition
  if (isListening) {
    recognition.stop(); // stops listening
    startBtn.textContent = "Start Listening"; // update button text
    startBtn.style.backgroundColor = ""; // reset button color

    leftPanel.classList.remove("pulsating-gradient"); // keyframes animation

    isListening = false;
    return; 
  }

  // Web Speech API
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  // Tell it to keep listening even after each phrase ends so it makes up sentences
  recognition.continuous = true;

  // only want final result (not in-progress guesses) 
  recognition.interimResults = false;

  console.log("Recognition started"); // check to see if recognition started

  recognition.onstart = () => {
    console.log("Listening...");
    startBtn.textContent = "Stop Listening";
    startBtn.style.backgroundColor = "#EDDD53";

    leftPanel.classList.add("pulsating-gradient"); // begin left screen animation

    isListening = true;
  };

  // double check for errors in console 
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  // When recognition stops 
  recognition.onend = () => {
    startBtn.textContent = "Start Listening"; // reset text
    startBtn.style.backgroundColor = ""; // reset style

    leftPanel.classList.remove("pulsating-gradient"); // stop left screen animation

    isListening = false;
  };

  // get the most recent result
  recognition.onresult = (event) => {
    let fullTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.trim();
      fullTranscript += transcript + " ";
    }

    const words = fullTranscript.trim().split(" ");
    const now = Date.now();

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word;

      if (lastTimestamp) {
        const gap = now - lastTimestamp;

        if (gap < 600) {
          span.className = "short-pause";
        } else if (gap < 1500) {
          span.className = "medium-pause";
        } else {
          span.className = "long-pause";
        }
      }

      // update timestamp only once for the last word
      if (index === words.length - 1) {
        lastTimestamp = now;
      }

      output.appendChild(span);
    });
  };

  // jesus christ, you can finally start 
  recognition.start();
});