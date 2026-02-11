// ==========================
// Banana Ninja (PHP + JS) - Luxury Edition with Audio
// ==========================

const AudioEngine = {
    ctx: new (window.AudioContext || window.webkitAudioContext)(),
    
    play(type) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
  
      const now = this.ctx.currentTime;
  
      if (type === 'pop') { // Bubble Click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } 
      else if (type === 'success') { // Win Round
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } 
      else if (type === 'fail') { // Wrong Answer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    }
  };
  
  // PHP endpoints
  const API_URL = "api.php";
  const SAVE_SCORE_URL = "save_score.php";
  const LEADERBOARD_URL = "leaderboard.php";
  
  // Screens
  const setupScreen = document.getElementById("setupScreen");
  const gameScreen = document.getElementById("gameScreen");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const leaderboardScreen = document.getElementById("leaderboardScreen");
  
  // Setup UI
  const nicknameInput = document.getElementById("nicknameInput");
  const avatarList = document.getElementById("avatarList");
  const startBtn = document.getElementById("startBtn");
  const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");
  
  // Game UI
  const playerAvatarEl = document.getElementById("playerAvatar");
  const playerNameEl = document.getElementById("playerName");
  const scoreEl = document.getElementById("score");
  const hpEl = document.getElementById("hp");
  const timeLeftEl = document.getElementById("timeLeft");
  const puzzleImage = document.getElementById("puzzleImage");
  const bubbleArea = document.getElementById("bubbleArea");
  const quitBtn = document.getElementById("quitBtn");
  const nextBtn = document.getElementById("nextBtn");
  const messageEl = document.getElementById("message");
  
  // Game Over UI
  const finalScoreEl = document.getElementById("finalScore");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const goHomeBtn = document.getElementById("goHomeBtn");
  const leaderboardBtn2 = document.getElementById("leaderboardBtn2");
  
  // Leaderboard UI
  const leaderboardList = document.getElementById("leaderboardList");
  const backBtn = document.getElementById("backBtn");
  
  // Game state
  let player = { nickname: "", avatar: "🥷" };
  let score = 0;
  let hp = 3;
  let timeLeft = 10;
  let timerId = null;
  let currentSolution = null;
  let roundActive = false;
  
  // --------------------------
  // Utility
  // --------------------------
  function showScreen(screenName) {
    setupScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    leaderboardScreen.classList.add("hidden");
  
    if (screenName === "setup") setupScreen.classList.remove("hidden");
    if (screenName === "game") gameScreen.classList.remove("hidden");
    if (screenName === "gameover") gameOverScreen.classList.remove("hidden");
    if (screenName === "leaderboard") leaderboardScreen.classList.remove("hidden");
  }
  
  function setMessage(text, type = "info") {
      messageEl.textContent = text;
      messageEl.className = "message"; 
      if (type === "success") messageEl.classList.add("success-ui");
      if (type === "error") messageEl.classList.add("fail-ui");
      messageEl.classList.add("show");
      setTimeout(() => { messageEl.classList.remove("show"); }, 2500);
  }
  
  function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  
  function updateUI() {
    scoreEl.textContent = score;
    hpEl.textContent = hp;
    timeLeftEl.textContent = timeLeft;
  
    if (player.avatar.startsWith("http")) {
      playerAvatarEl.innerHTML = `<img src="${player.avatar}" class="uiAvatar">`;
    } else {
      playerAvatarEl.textContent = player.avatar;
    }
  
    playerNameEl.textContent = player.nickname || "Player";
  }
  
  
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
  
  function startTimer() {
    stopTimer();
    timeLeft = 10;
    updateUI();
    timerId = setInterval(() => {
      timeLeft--;
      timeLeftEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        stopTimer();
        handleWrongAnswer("Time ran out!");
      }
    }, 1000);
  }
  
  function clearBubbles() { bubbleArea.innerHTML = ""; }
  
  // --------------------------
  // API Interactivity
  // --------------------------
  async function fetchBananaQuestion() {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return { questionImageUrl: data.question, solution: Number(data.solution) };
  }
  
  async function saveScoreToServer() {
      await fetch(SAVE_SCORE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: player.nickname, avatar: player.avatar, score: score })
      });
  }
  
  async function renderLeaderboard() {
    const res = await fetch(LEADERBOARD_URL);
    const list = await res.json();
  
    if (!list || list.length === 0) {
      leaderboardList.innerHTML = `<div class="lbRow">No scores yet</div>`;
      return;
    }
  
    leaderboardList.innerHTML = list.map((item, index) => {
      // If avatar is emoji, show emoji. If URL, show image.
      const avatarHTML = item.avatar.startsWith("http")
        ? `<img class="lbAvatar" src="${item.avatar}" alt="avatar">`
        : `<span class="lbEmoji">${item.avatar}</span>`;
  
      return `
        <div class="lbRow">
          <div class="lbLeft">
            <span class="lbRank">#${index + 1}</span>
            ${avatarHTML}
            <strong class="lbName">${item.nickname}</strong>
          </div>
          <div class="lbScore">${item.score} pts</div>
        </div>
      `;
    }).join("");
  }
  
  
  // --------------------------
  // Gameplay logic
  // --------------------------
  function resetGame() { score = 0; hp = 3; updateUI(); }
  
  function spawnBubbles(choices) {
    clearBubbles();
    const areaRect = bubbleArea.getBoundingClientRect();
    const maxX = areaRect.width - 70;
    const maxY = areaRect.height - 70;
  
    choices.forEach((value, index) => {
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = value;
      bubble.style.transition = "all 0.8s ease-in-out";
  
      let x = randomInt(10, Math.floor(maxX));
      let y = randomInt(10, Math.floor(maxY));
      bubble.style.left = x + "px";
      bubble.style.top = y + "px";
      bubble.style.animationDuration = (4 + index) + "s";
  
      bubble.addEventListener("click", () => {
        if (!roundActive) return;
        AudioEngine.play('pop'); // <--- Sound on click
        if (Number(value) === currentSolution) handleCorrectAnswer();
        else handleWrongAnswer("Oops! Wrong bubble.");
      });
  
      bubbleArea.appendChild(bubble);
  
      const moveId = setInterval(() => {
        if (!roundActive) { clearInterval(moveId); return; }
        x += randomInt(-50, 50); y += randomInt(-50, 50);
        x = Math.max(5, Math.min(x, maxX)); y = Math.max(5, Math.min(y, maxY));
        bubble.style.left = x + "px"; bubble.style.top = y + "px";
      }, 800);
    });
  }
  
  async function startRound() {
    roundActive = false;
    nextBtn.classList.add("hidden");
    setMessage("Preparing Puzzle...");
    clearBubbles();
    try {
      const q = await fetchBananaQuestion();
      currentSolution = q.solution;
      puzzleImage.src = q.questionImageUrl;
      puzzleImage.onload = () => {
        spawnBubbles(Array.from(new Set([currentSolution, ...Array.from({length: 3}, () => randomInt(0, 20))])).sort(() => Math.random() - 0.5));
        setMessage("Find the answer!", "info");
        roundActive = true;
        startTimer();
      };
    } catch (err) { setMessage("API Error", "error"); nextBtn.classList.remove("hidden"); }
  }
  
  function handleCorrectAnswer() {
    roundActive = false; stopTimer(); score += 10; updateUI();
    AudioEngine.play('success'); // <--- Success Sound
    setMessage("✨ Brilliant! +10", "success");
    nextBtn.classList.remove("hidden");
  }
  
  function handleWrongAnswer(reason) {
    roundActive = false; stopTimer(); hp -= 1; updateUI();
    AudioEngine.play('fail'); // <--- Failure Sound
    setMessage(`💔 ${reason}`, "error");
    if (hp <= 0) setTimeout(endGame, 1000);
    else nextBtn.classList.remove("hidden");
  }
  
  async function endGame() {
      stopTimer(); roundActive = false;
      finalScoreEl.textContent = score;
      await saveScoreToServer();
      showScreen("gameover");
  }
  
  // --------------------------
  // Setup events
  // --------------------------
  avatarList.addEventListener("click", (e) => {
    const btn = e.target.closest(".avatarBtn");
    if (!btn) return;
    document.querySelector(".avatarBtn.selected")?.classList.remove("selected");
    btn.classList.add("selected");
    player.avatar = btn.dataset.avatar;
    AudioEngine.ctx.resume(); // Resume audio on first user click
  });
  
  startBtn.addEventListener("click", () => {
    if (!nicknameInput.value.trim()) { setMessage("Enter a name", "error"); return; }
    player.nickname = nicknameInput.value.trim();
    AudioEngine.ctx.resume(); 
    resetGame(); showScreen("game"); startRound();
  });
  
  quitBtn.addEventListener("click", () => { if (confirm("Quit?")) { stopTimer(); showScreen("setup"); } });
  nextBtn.addEventListener("click", startRound);
  playAgainBtn.addEventListener("click", () => { resetGame(); showScreen("game"); startRound(); });
  goHomeBtn.addEventListener("click", () => showScreen("setup"));
  document.getElementById("viewLeaderboardBtn").addEventListener("click", async () => { await renderLeaderboard(); showScreen("leaderboard"); });
  document.getElementById("leaderboardBtn2").addEventListener("click", async () => { await renderLeaderboard(); showScreen("leaderboard"); });
  backBtn.addEventListener("click", () => showScreen("setup"));
  
  // Init Default
  document.querySelector('.avatarBtn[data-avatar="🥷"]').classList.add("selected");