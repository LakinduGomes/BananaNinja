<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <div class="app">

    <header class="header">
      <h1>🍌 Banana Ninja Slash</h1>
      <p>Click the correct bubble before time runs out!</p>
    </header>

    <!-- SETUP -->
    <section id="setupScreen" class="card">
      <h2>Player Setup</h2>

      <label class="label">Nickname</label>
      <input id="nicknameInput" class="input" placeholder="Enter your nickname" maxlength="12"/>

      <label class="label">Choose an avatar</label>
      <div class="avatars" id="avatarList">
  <button class="avatarBtn" data-avatar="https://api.dicebear.com/7.x/bottts/png?seed=ninja&size=64">
    <img src="https://api.dicebear.com/7.x/bottts/png?seed=ninja&size=64" alt="ninja">
  </button>

  <button class="avatarBtn" data-avatar="https://api.dicebear.com/7.x/bottts/png?seed=monkey&size=64">
    <img src="https://api.dicebear.com/7.x/bottts/png?seed=monkey&size=64" alt="monkey">
  </button>

  <button class="avatarBtn" data-avatar="https://api.dicebear.com/7.x/bottts/png?seed=fox&size=64">
    <img src="https://api.dicebear.com/7.x/bottts/png?seed=fox&size=64" alt="fox">
  </button>

  <button class="avatarBtn" data-avatar="https://api.dicebear.com/7.x/bottts/png?seed=tiger&size=64">
    <img src="https://api.dicebear.com/7.x/bottts/png?seed=tiger&size=64" alt="tiger">
  </button>

  <button class="avatarBtn" data-avatar="https://api.dicebear.com/7.x/bottts/png?seed=robot&size=64">
    <img src="https://api.dicebear.com/7.x/bottts/png?seed=robot&size=64" alt="robot">
  </button>
</div>


      <button id="startBtn" class="btn primary">Start Game</button>
      <button id="viewLeaderboardBtn" class="btn">View Leaderboard</button>
    </section>

    <!-- GAME -->
    <section id="gameScreen" class="card hidden">

      <div class="topBar">
        <div class="playerInfo">
          <span id="playerAvatar" class="playerAvatar">🥷</span>
          <span id="playerName" class="playerName">Player</span>
        </div>

        <div class="stats">
          <div class="stat">Score: <span id="score">0</span></div>
          <div class="stat">HP: <span id="hp">3</span></div>
          <div class="stat">Time: <span id="timeLeft">10</span>s</div>
        </div>
      </div>

      <div class="puzzleArea">
        <div class="puzzleBox">
          <img id="puzzleImage" alt="Banana Puzzle"/>
        </div>
      </div>

      <div class="bubbleArea" id="bubbleArea"></div>

      <div class="bottomBar">
        <button id="quitBtn" class="btn danger">Quit</button>
        <button id="nextBtn" class="btn hidden">Next Round</button>
      </div>

      <div id="message" class="message"></div>
    </section>

    <!-- GAME OVER -->
    <section id="gameOverScreen" class="card hidden">
      <h2>Game Over 💀</h2>
      <p>Your final score: <strong id="finalScore">0</strong></p>

      <button id="playAgainBtn" class="btn primary">Play Again</button>
      <button id="goHomeBtn" class="btn">Back to Home</button>
      <button id="leaderboardBtn2" class="btn">Leaderboard</button>
    </section>

    <!-- LEADERBOARD -->
    <section id="leaderboardScreen" class="card hidden">
      <h2>🏆 Leaderboard</h2>
      <div id="leaderboardList" class="leaderboardList"></div>

      <button id="backBtn" class="btn">Back</button>
    </section>

    <footer class="footer">
      <small>PHP backend + JavaScript frontend • Uses Banana API</small>
    </footer>

  </div>

  <script src="script.js"></script>
</body>
</html>
