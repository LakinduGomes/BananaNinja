
// Banana Ninja Slash 


const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  //plays different sounds depend n=on event
  play(type)  {
    this.init(); //creates an audio system that doesnt exist
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(); osc.stop(now + 0.1);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(); osc.stop(now + 0.4);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(); osc.stop(now + 0.3);
    } else if (type === 'gameOver') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.2);
      osc.start(); osc.stop(now + 1.2);
    }
  }
};

//api config
const API_URL = "api/api.php";
const SAVE_SCORE_URL = "api/save_score.php";
const LEADERBOARD_URL = "leaderboard.php"; 
const CHECK_ID_URL = "api/check_identity.php"; // new Identity Check 

//game settings
const BUBBLE_SIZE = 90;
const SPEED_FACTOR = 0.7;
const COLORS = ['#ff85a1', '#4cc9f0', '#f9c74f', '#7209b7'];
const TOP_OFFSET = 120; 

// html events
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");
const bubbleArea = document.getElementById("bubbleArea");
const puzzleImage = document.getElementById("puzzleImage");
const messageEl = document.getElementById("message");
const leaderboardList = document.getElementById("leaderboardList");

// game state
let player = { nickname: "", avatar: "🥷" };
let score = 0, hp = 3, timeLeft = 15;
let timerId = null, currentSolution = null, roundActive = false;
let bubbles = [], animId = null, lastTime = 0;

// Screen Navigations
function showScreen(screenName) {
    const screens = [setupScreen, gameScreen, gameOverScreen, leaderboardScreen];
    screens.forEach(s => s.classList.add("hidden"));
    
    if (screenName === "setup") setupScreen.classList.remove("hidden");
    if (screenName === "game") gameScreen.classList.remove("hidden");
    if (screenName === "gameover") gameOverScreen.classList.remove("hidden");
    if (screenName === "leaderboard") leaderboardScreen.classList.remove("hidden");
}

//message system
function setMessage(text, type = "info") {
    messageEl.textContent = text;
    messageEl.className = "message " + (type === "success" ? "success-ui" : type === "error" ? "fail-ui" : "");
    messageEl.classList.add("show");
    setTimeout(() => messageEl.classList.remove("show"), 2000);
}

function updateUI() {
    document.getElementById("score").textContent = score;
    document.getElementById("hp").textContent = hp;
    document.getElementById("timeLeft").textContent = timeLeft;
    document.getElementById("playerName").textContent = player.nickname || "Ninja";
    const pAvatar = document.getElementById("playerAvatar");
    pAvatar.innerHTML = player.avatar.startsWith("http") ? `<img src="${player.avatar}" style="width:40px;height:40px;border-radius:50%">` : player.avatar;
}

//leaderboard logic
//calls the api get rankings and display on screen
async function loadLeaderboard() {
    const podiumContainer = document.getElementById("podiumContainer");
    const leaderboardList = document.getElementById("leaderboardList");
    
    leaderboardList.innerHTML = "<div class='lbRow'>Fetching Ranks...</div>";
    podiumContainer.innerHTML = "";

    try {
        const res = await fetch(LEADERBOARD_URL);
        const data = await res.json();
        
        if (!data || data.length === 0) {
            leaderboardList.innerHTML = "<div class='lbRow'>No scores yet.</div>";
            return;
        }

        const top3 = data.slice(0, 3);
        
        const podiumOrder = [top3[1], top3[0], top3[2]];

        podiumContainer.innerHTML = podiumOrder.map((item, index) => {
            if (!item) return `<div class="podium-card empty"></div>`;
            
            const actualRank = data.indexOf(item) + 1;
            const rankClass = `rank-${actualRank}`;
            
            return `
                <div class="podium-card ${rankClass}">
                    ${actualRank === 1 ? '<div class="crown">👑</div>' : ''}
                    <div class="podium-avatar">
                        <img src="${item.avatar.includes('http') ? item.avatar : ''}" alt="">
                        ${!item.avatar.includes('http') ? `<span>${item.avatar}</span>` : ''}
                    </div>
                    <div class="podium-name">${item.nickname}</div>
                    <div class="podium-score">${item.score}</div>
                    <div class="podium-base">${actualRank}</div>
                </div>
            `;
        }).join('');

        const restOfPlayers = data.slice(3);
        leaderboardList.innerHTML = restOfPlayers.map((item, index) => `
            <div class="lbRow">
                <span>#${index + 4}</span>
                <span>${item.avatar.includes('http') ? `<img src="${item.avatar}" width="24" style="border-radius:50%">` : item.avatar}</span>
                <strong>${item.nickname}</strong>
                <span>${item.score} pts</span>
            </div>
        `).join('');

    } catch (e) {
        leaderboardList.innerHTML = "<div class='lbRow'>Leaderboard Offline</div>";
    }
}
// game logic
function clearBubbles() {
    if (animId) cancelAnimationFrame(animId);
    bubbleArea.innerHTML = "";
    bubbles = [];
}

//1 bubble contains correct and other are wrong


function spawnBubbles(correctValue) {
    clearBubbles();
    const rect = bubbleArea.getBoundingClientRect();
    const targetDigit = correctValue % 10;

    let choices = new Set([targetDigit]);
    while(choices.size < 4) choices.add(Math.floor(Math.random() * 10));
    const finalChoices = Array.from(choices).sort(() => Math.random() - 0.5);

    finalChoices.forEach((val, i) => {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = val;
        bubble.style.borderColor = COLORS[i % COLORS.length];
        bubble.style.color = COLORS[i % COLORS.length];
        
        const x = Math.random() * (rect.width - BUBBLE_SIZE);
        const y = Math.random() * (rect.height - BUBBLE_SIZE - TOP_OFFSET) + TOP_OFFSET;
        
        let dx = (Math.random() * 1.5 + 1) * (Math.random() < 0.5 ? -1 : 1) * SPEED_FACTOR;
        let dy = (Math.random() * 1.5 + 1) * (Math.random() < 0.5 ? -1 : 1) * SPEED_FACTOR;

        bubbles.push({ el: bubble, x, y, dx, dy, val });

        bubble.onmousedown = (e) => {
            if (!roundActive) return;
            e.preventDefault();
            if (Number(val) === targetDigit) {
                AudioEngine.play('pop');
                handleCorrectAnswer();
            } else {
                AudioEngine.play('fail');
                handleWrongAnswer("Oops!");
            }
        };

        bubbleArea.appendChild(bubble);
    });

    lastTime = performance.now();
    animId = requestAnimationFrame(updatePhysics);
}

//bubble physics movement
//move bubbles continuouslysuing request aniamtion frame
//each moves random directions, bounce when it edges, updates its postion
function updatePhysics(currentTime) {
    if (!roundActive) return;
    const dt = (currentTime - lastTime) / 16.67; 
    lastTime = currentTime;
    const rect = bubbleArea.getBoundingClientRect();

    bubbles.forEach(b => {
        b.x += b.dx * dt;
        b.y += b.dy * dt;
        if (b.x <= 0 || b.x >= rect.width - BUBBLE_SIZE) b.dx *= -1;
        if (b.y <= TOP_OFFSET || b.y >= rect.height - BUBBLE_SIZE) b.dy *= -1;
        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    });
    animId = requestAnimationFrame(updatePhysics);
}

//shows banana puzzle, displays image and get the solution
async function startRound() {
  roundActive = false;
  clearBubbles();
  try {
      const res = await fetch(API_URL);
      const data = await res.json();
      currentSolution = Number(data.solution);
      const separator = data.question.includes('?') ? '&' : '?';
      const freshUrl = data.question + separator + "v=" + Date.now();

      const imgLoader = new Image();
      imgLoader.crossOrigin = "anonymous"; 
      imgLoader.src = freshUrl;
      imgLoader.onload = () => {
          puzzleImage.src = freshUrl;
          roundActive = true;
          let choices = new Set([currentSolution % 10]);
          while(choices.size < 4) choices.add(Math.floor(Math.random() * 10));
          spawnBubbles(Array.from(choices).sort(() => Math.random() - 0.5));
          startTimer();
          setMessage("Solve and Slash!", "info");
      };
      imgLoader.onerror = () => {
          puzzleImage.src = data.question; 
          roundActive = true;
          spawnBubbles(currentSolution);
          startTimer();
      };
  } catch (e) {
      setMessage("Connection Reset", "error");
  }
}

//timer for each round
function startTimer() {
    if (timerId) clearInterval(timerId);
    timeLeft = 15;
    updateUI();
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            AudioEngine.play('fail');
            handleWrongAnswer("Time's Up!");
        }
    }, 1000);
}


function handleCorrectAnswer() {
    roundActive = false;
    clearInterval(timerId);
    score += 10;
    updateUI();
    AudioEngine.play('success');
    setMessage("Brilliant! +10", "success");
    setTimeout(startRound, 1000);
}

function handleWrongAnswer(msg) {
    roundActive = false;
    clearInterval(timerId);
    hp--;
    updateUI();
    setMessage(msg, "error");
    if (hp <= 0) setTimeout(endGame, 1000);
    else setTimeout(startRound, 1000);
}

async function endGame() {
    roundActive = false;
    clearInterval(timerId);
    clearBubbles();
    AudioEngine.play('gameOver');
    document.getElementById("finalScore").textContent = score;
    showScreen("gameover");

    try {
        await fetch(SAVE_SCORE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nickname: player.nickname, 
                avatar: player.avatar, 
                score: score 
            })
        });
    } catch (e) { console.error("Score failed to save"); }
}

// event lsitners
document.getElementById("startBtn").onclick = async () => {
    const nick = document.getElementById("nicknameInput").value.trim();
    if (!nick) { setMessage("Name needed!", "error"); return; }
    
    // identity
    //saves on local storage
    try {
        const checkRes = await fetch(`${CHECK_ID_URL}?nickname=${encodeURIComponent(nick)}&avatar=${encodeURIComponent(player.avatar)}`);
        const idData = await checkRes.json();

        if (idData.exists) {
            const confirmLogin = confirm(`Welcome back, ${nick}! Found your ninja profile with ${idData.score} points. Continue?`);
            if (!confirmLogin) {
                setMessage("Login cancelled", "info");
                return; // User stopped the login
            }
        }
    } catch (e) { console.warn("Identity check bypassed due to connection."); }

    // save and process
    localStorage.setItem("ninja_nickname", nick);
    localStorage.setItem("ninja_avatar", player.avatar);
    
    AudioEngine.init();
    player.nickname = nick;
    score = 0; hp = 3;
    showScreen("game");
    startRound();
};

//leaderboard buttons

document.getElementById("viewLeaderboardBtn").onclick = () => {
    showScreen("leaderboard");
    loadLeaderboard();
};

document.getElementById("leaderboardBtn2").onclick = () => {
    showScreen("leaderboard");
    loadLeaderboard();
};

document.getElementById("backBtn").onclick = () => showScreen("setup");

document.getElementById("playAgainBtn").onclick = () => { 
    score = 0; hp = 3; showScreen("game"); startRound(); 
};

document.getElementById("goHomeBtn").onclick = () => showScreen("setup");

document.getElementById("avatarList").onclick = e => {
    const btn = e.target.closest(".avatarBtn");
    if (!btn) return;
    document.querySelectorAll(".avatarBtn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    player.avatar = btn.dataset.avatar;
};

document.getElementById("quitBtn").onclick = () => { 
    if(confirm("Quit game? Current progress will be lost.")) { 
        roundActive = false; 
        clearInterval(timerId); 
        showScreen("setup"); 
    } 
};

// restore identity
(function initProfile() {
    const savedNick = localStorage.getItem("ninja_nickname");
    const savedAvatar = localStorage.getItem("ninja_avatar");

    if (savedNick) {
        document.getElementById("nicknameInput").value = savedNick;
        player.nickname = savedNick;
    }
    
    if (savedAvatar) {
        player.avatar = savedAvatar;
        document.querySelectorAll(".avatarBtn").forEach(btn => {
            btn.classList.toggle("selected", btn.dataset.avatar === savedAvatar);
        });
    }
})();