setTimeout(() => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
    }, 1000); // allow fade-out to finish
  }
}, 3000); // 3 sec



// connecting json to js
let afinnData = {};

fetch('afinn.json')
  .then(response => response.json())
  .then(data => {
    afinnData = data;
    console.log("AFINN data loaded"); // confirm it's working
  })
  .catch(error => console.error("Error loading AFINN data:", error));



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
    startBtn.style.backgroundColor = "#E8669C";

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

    // adding these for switch toggles
    const sentimentOn = document.getElementById("toggleSentiment").checked;
    const fontSizeOn = document.getElementById("toggleFontSize").checked;
    const spacingOn = document.getElementById("toggleSpacing").checked;
    const ellipsisOn = document.getElementById("toggleEllipsis").checked;
    const fadingOn = document.getElementById("toggleFading").checked;

    const pauseDuration = lastTimestamp ? now - lastTimestamp : 0; 

    // SPAN 5: visually represent pauses (silences) in the text

    //If silence was more than 2 seconds, insert a visual ellipsis
    if (ellipsisOn && pauseDuration > 2000) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.classList.add("dynamic-ellipsis");
  
      const baseSize = 16;
      const sizeMultiplier = pauseDuration / 1000;
      const fontSize = baseSize + sizeMultiplier * 2;
      ellipsis.style.fontSize = fontSize + "px";
  
      output.appendChild(ellipsis);
    }

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word;


      // SPAN 4: storing the time stamp for future 
      const wordTimestamp = now;


      // SPAN 1: color and typeface of the word are based on the mood score assigned in JSON
      // words are put through json, analysed and style is assigned (check css for style)

      const sentimentScore = afinnData[word.toLowerCase()];

      if (sentimentOn && sentimentScore !== undefined) {
        if (sentimentScore >= 2) {
          span.classList.add("sentiment-positive");
        } else if (sentimentScore <= -2) {
          span.classList.add("sentiment-negative");
        } else {
          span.classList.add("sentiment-neutral");
        }
      }

      
      //  SPAN 2: font size based on gap length 
      if (fontSizeOn && lastTimestamp) {
        const gap = now - lastTimestamp;
        const calculatedSize = gap / 200;
        const maxSize = 50;
        const fontSize = Math.min(calculatedSize, maxSize);
        span.style.fontSize = fontSize + "px";
      }

      // SPAN 3: letter spacing based on length of the word 

      if (spacingOn) {
        let spacing;
        if (word.length <= 4) {
          spacing = "0.3em";
        } else if (word.length <= 7) {
          spacing = "0.15em";
        } else {
          spacing = "0.05em";
        }
        span.style.letterSpacing = spacing;
      }

      span.style.marginRight = "8px"; // this is for space between words but check when testing if it's needed 


      // SPAN 4: The words start fading out after 1.5 min and disappear after 3min -- ghost effect 

      if (fadingOn) {
        const fadeStart = 1.5 * 60 * 1000;
        const fadeDuration = 3 * 60 * 1000;
  
        const interval = setInterval(() => {
          const elapsed = Date.now() - wordTimestamp;
  
          if (elapsed >= fadeStart) {
            const opacity = 1 - (elapsed - fadeStart) / (fadeDuration - fadeStart);
            span.style.opacity = Math.max(opacity, 0);
          }
  
          if (elapsed >= fadeDuration) {
            span.style.visibility = "hidden";
            clearInterval(interval);
          }
        }, 1000);
      }
  
      if (index === words.length - 1) {
        lastTimestamp = now;
      }

      output.appendChild(span);
      output.scrollTo({ top: output.scrollHeight, behavior: "smooth" });
    });
  };

  // jesus christ, you can finally start 
  recognition.start();
});


 //code below went under const gap = now - lastTimestamp;

        // if (gap < 600) {
        //   span.className = "short-pause";
        // } else if (gap < 1500) {
        //   span.className = "medium-pause";
        // } else {
        //   span.className = "long-pause";
        // }