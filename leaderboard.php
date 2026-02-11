<?php

header("Content-Type: application/json");


$file = __DIR__ . "/leaderboard.json";


// If file doesn’t exist, return empty

if (!file_exists($file)) echo json_encode([]);

else echo file_get_contents($file); 