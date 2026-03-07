<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banana Ninja Slash </title>
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
</head>

<body>

  <div class="app">
  <header class="premium-header">
    <div class="header-content">
        <div class="logo-wrapper">
            <span class="emoji-icon">🍌</span>
            <div class="title-text">
                <h1>Banana Ninja <span>Slash</span></h1>
                <p><i class="fa-solid fa-clock-rotate-left"></i> Precision is everything. Speed is key.</p>
            </div>
        </div>
        <div class="header-decorator">
            <div class="dot"></div>
            <span class="status-text">LIVE SESSION</span>
        </div>
    </div>
</header>

    <section id="setupScreen" class="card">
    <div class="setup-header">
        <div class="setup-icon"><i class="fa-solid fa-user-ninja"></i></div>
        <h2>Ninja Profile</h2>
        <p>Prepare for the banana slash</p>
    </div>

    <div class="input-group">
        <label class="premium-label"><i class="fa-solid fa-signature"></i> NICKNAME</label>
        <input id="nicknameInput" class="premium-input" placeholder="Your Ninja Name..." maxlength="12" />
    </div>

    <div class="avatar-section">
        <label class="premium-label"><i class="fa-solid fa-masks-theater"></i> CHOOSE AVATAR</label>
        <div class="avatars-grid" id="avatarList">
            <button class="avatarBtn selected" data-avatar="https://api.dicebear.com/7.x/bottts/png?seed=ninja&size=64">
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
    </div>

    <div class="setup-actions">
        <button id="startBtn" class="btn-clean-primary">
            READY TO SLASH <i class="fa-solid fa-play"></i>
        </button>
        <button id="viewLeaderboardBtn" class="btn-clean-outline">
            <i class="fa-solid fa-ranking-star"></i> RANKINGS
        </button>
    </div>
</section>

    <section id="gameScreen" class="card hidden">
      <div class="horizontal-container">

        <div class="game-sidebar">
          <div class="topBar">
            <div class="playerInfo">
              <span id="playerAvatar" class="playerAvatar">🥷</span>
              <span id="playerName" class="playerName">Player</span>
            </div>

            <div class="stats-grid">
              <div class="stat">Score: <span id="score">0</span></div>
              <div class="stat">HP: <span id="hp">3</span></div>
              <div class="stat">Time: <span id="timeLeft">15</span>s</div>
            </div>
          </div>

          <div class="puzzleArea">
            <div class="puzzleBox">
              <img id="puzzleImage" alt="Banana Puzzle" />
            </div>
          </div>

          <div class="sidebar-actions">
            <button id="quitBtn" class="btn danger">Quit</button>
            <button id="nextBtn" class="btn primary hidden">Next Round</button>
          </div>
        </div>

        <div class="bubble-arena">
          <div id="bubbleArea" class="bubbleArea"></div>
          <div id="message" class="message"></div>
        </div>

      </div>
    </section>

    <section id="gameOverScreen" class="card hidden">
      <div class="go-header">
        <div class="skull-circle">
          <i class="fa-solid fa-ghost"></i>
        </div>
        <h2 class="go-title">Session Ended</h2>
        <p class="go-subtitle">Your ninja journey paused here.</p>
      </div>

      <div class="score-card-premium">
        <span class="score-label">FINAL SCORE</span>
        <div class="score-main">
          <i class="fa-solid fa-bolt-lightning"></i>
          <span id="finalScore">0</span>
        </div>
        <div id="newBestBadge" class="new-best hidden">
          <i class="fa-solid fa-star"></i> NEW RECORD!
        </div>
      </div>

      <div class="go-actions">
        <button id="playAgainBtn" class="btn-action primary-gold">
          <i class="fa-solid fa-rotate-right"></i> TRY AGAIN
        </button>

        <div class="btn-group-row">
          <button id="leaderboardBtn2" class="btn-action secondary">
            <i class="fa-solid fa-ranking-star"></i> RANKS
          </button>
          <button id="goHomeBtn" class="btn-action secondary">
            <i class="fa-solid fa-house"></i> HOME
          </button>
        </div>
      </div>
    </section>
    <section id="leaderboardScreen" class="card hidden">
      <div class="lb-premium-header">
        <div class="lb-badge">RANKINGS</div>
        <h2>World Legends</h2>
        <p>The top slayers of the season</p>
      </div>

      <div id="podiumContainer" class="premium-podium">
      </div>

      <div class="lb-scroll-area">
        <div id="leaderboardList" class="premium-list"></div>
      </div>

      <div class="lb-footer">
        <button id="backBtn" class="btn-clean">
          <i class="fa-solid fa-chevron-left"></i> Back to Dojo
        </button>
      </div>
    </section>

    <footer class="footer">
      <small>PHP (MySQL) + JavaScript • Virtual Identity </small>
    </footer>

  </div>

  <script src="assets/js/script.js"></script>
</body>

</html>