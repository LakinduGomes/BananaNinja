<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$file = __DIR__ . "/leaderboard.json";

// Standard response envelope
$response = [
    "status" => "success",
    "message" => "Score saved successfully",
    "data" => null
];

$input = json_decode(file_get_contents("php://input"), true);

$nickname = trim($input["nickname"] ?? "");
$avatar   = trim($input["avatar"] ?? "");
$score    = intval($input["score"] ?? 0);

if ($nickname === "") {
    http_response_code(400); // Standard HTTP error for "Bad Request"
    echo json_encode(["status" => "error", "message" => "Nickname required"]);
    exit;
}

// Load current data
$leaderboard = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
if (!is_array($leaderboard)) $leaderboard = [];

// Add new entry
$leaderboard[] = [
    "nickname" => $nickname,
    "avatar" => $avatar,
    "score" => $score,
    "date" => date("c")
];

// Sort and slice
usort($leaderboard, fn($a, $b) => $b["score"] <=> $a["score"]);
$leaderboard = array_slice($leaderboard, 0, 10);

// Save back to file
file_put_contents($file, json_encode($leaderboard, JSON_PRETTY_PRINT));

echo json_encode($response);