let musicOn = false;
let bgMusic;

window.onload = function() {
    bgMusic = document.getElementById("bgMusic");

    // 🔁 Auto restart music when it ends
    if(bgMusic){
        bgMusic.addEventListener("ended", () => {
            if(musicOn){              // only loop if music is ON
                bgMusic.currentTime = 0;
                bgMusic.play();
            }
        });
    }
};

function toggleMusic(){
    const btn = document.getElementById("musicToggle");

    if(!bgMusic) return;

    if(musicOn){
        bgMusic.pause();
        btn.innerText = "🔇 Music Off";
        btn.classList.remove("on");
        musicOn = false;
    } else {
        bgMusic.volume = 0.4;
        bgMusic.play();
        btn.innerText = "🔊 Music On";
        btn.classList.add("on");
        musicOn = true;
    }
}
// Alphabet Data
const alphabets = [
    { letter:"A", word:"Apple", image:"images/apple.jpg" },
    { letter:"B", word:"Ball", image:"images/ball.jpg" },
    { letter:"C", word:"Cat", image:"images/cat.jpg" },
    { letter:"D", word:"Dog", image:"images/dog.jpg" },
    { letter:"E", word:"Elephant", image:"images/elephant.jpg" },
    { letter:"F", word:"Fish", image:"images/fish.jpg" },
    { letter:"G", word:"Grapes", image:"images/grapes.jpg" },
    { letter:"H", word:"Hen", image:"images/hen.jpg" },
    { letter:"I", word:"Ice Cream", image:"images/icecream.jpg" },
    { letter:"J", word:"Jug", image:"images/jug.jpg" },
    { letter:"K", word:"Kite", image:"images/kite.jpg" },
    { letter:"L", word:"Lion", image:"images/lion.jpg" },
    { letter:"M", word:"Mango", image:"images/mango.jpg" },
    { letter:"N", word:"Nest", image:"images/nest.jpg" },
    { letter:"O", word:"Orange", image:"images/orange.jpg" },
    { letter:"P", word:"Parrot", image:"images/parrot.jpg" },
    { letter:"Q", word:"Queen", image:"images/queen.jpg" },
    { letter:"R", word:"Rabbit", image:"images/rabbit.jpg" },
    { letter:"S", word:"Sun", image:"images/sun.jpg" },
    { letter:"T", word:"Tiger", image:"images/tiger.jpg" },
    { letter:"U", word:"Umbrella", image:"images/umbrella.jpg" },
    { letter:"V", word:"Van", image:"images/van.jpg" },
    { letter:"W", word:"Watch", image:"images/watch.jpg" },
    { letter:"X", word:"Xylophone", image:"images/xylophone.jpg" },
    { letter:"Y", word:"Yak", image:"images/yak.jpg" },
    { letter:"Z", word:"Zebra", image:"images/zebra.jpg" }
];

// Elements
const container = document.getElementById("alphabetContainer");
const imageBox = document.getElementById("imageBox");
const textBox = document.getElementById("textBox");
const scoreBox = document.getElementById("score");
const timerBox = document.getElementById("timer");
const leaderboard = document.getElementById("leaderboard");
const questionBox = document.getElementById("question");

// Game variables
let mode = "learn";
let score = 0;
let currentAnswer = "";
let timer = null;
let timeLeft = 0;

// 🔊 Voice (Indian female style)
function speak(text){
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 0.7;
    speech.pitch = 1;
    speechSynthesis.cancel(); // stop previous
    speechSynthesis.speak(speech);
}

// Load alphabet grid
function loadAlphabet(){
    container.innerHTML = "";

    alphabets.forEach(item=>{
        let div = document.createElement("div");
        div.className = "box";
        div.innerText = item.letter;

        div.onclick = () => {
            div.classList.add("active");
            setTimeout(()=>div.classList.remove("active"),300);
            handleClick(item, div);
        };

        container.appendChild(div);
    });
}

// 📘 Learn Mode
function startLearning(){
    clearInterval(timer);
    mode = "learn";
    score = 0;
    scoreBox.innerText = score;

    questionBox.innerText = "📘 Learn Mode";
    textBox.innerText = "Click a letter 👆";
    imageBox.src = "";

    speak("Learn mode");

    // 🎵 Play only if music is ON
    if(musicOn){
        bgMusic.play();
    }
}

// 🎮 Quiz Mode
function startQuiz(level){
    mode = "quiz";
    score = 0;
    scoreBox.innerText = score;

    let userTime = document.getElementById("customTime").value;
    timeLeft = userTime ? parseInt(userTime) : 30;

    questionBox.innerText = level.toUpperCase() + " MODE";
    speak(level + " mode");

    startTimer();

    setTimeout(()=>{
        nextQuestion();
    },1000);
}

// ⏱ Timer
function startTimer(){
    clearInterval(timer);
    timerBox.innerText = timeLeft;

    timer = setInterval(()=>{
        timeLeft--;
        timerBox.innerText = timeLeft;

        if(timeLeft <= 0){
            clearInterval(timer);
            questionBox.innerText = "Game Over!";
            speak("Game over");

            saveScore(score);
            loadLeaderboard();
        }
    },1000);
}

// 🔄 Next Question
function nextQuestion(){
    let random = alphabets[Math.floor(Math.random()*alphabets.length)];
    currentAnswer = random.letter;

    questionBox.innerText = "Find: " + random.word;
    speak("Find " + random.word);

    imageBox.src = random.image;
    textBox.innerText = random.letter + " for " + random.word;
}

// 🎯 Click Logic (FIXED)
function handleClick(item, div){

    if(mode === "learn"){
        textBox.innerText = item.letter + " for " + item.word;
        imageBox.src = item.image;
        speak(item.letter + " for " + item.word);
        return;
    }

    // remove old styles
    let boxes = document.querySelectorAll(".box");
    boxes.forEach(b => b.classList.remove("correct","wrong"));

    if(item.letter === currentAnswer){
        score++;
        scoreBox.innerText = score;

        div.classList.add("correct");
        confetti({particleCount:80, spread:70});

        speak("Correct");
    } else {
        div.classList.add("wrong");
        speak("Wrong");
    }

    // delay before next question
    setTimeout(()=>{
        nextQuestion();
    },800);
}

// 🏆 Save score
function saveScore(score){
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(score);

    scores.sort((a,b)=>b-a);
    scores = scores.slice(0,5);

    localStorage.setItem("scores", JSON.stringify(scores));
}

// 🏆 Load leaderboard
function loadLeaderboard(){
    leaderboard.innerHTML = "";

    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.forEach((s,i)=>{
        let div = document.createElement("div");
        div.className = "score-card";
        div.innerHTML = `🥇 ${i+1} ⭐ ${s}`;
        leaderboard.appendChild(div);
    });
}

// Init
loadAlphabet();
loadLeaderboard();
function setDefaultDisplay(){
    let random = alphabets[Math.floor(Math.random()*alphabets.length)];

    imageBox.src = random.image;
    textBox.innerText = random.letter + " for " + random.word;
}

setDefaultDisplay();