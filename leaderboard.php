<?php
require_once 'api/db.php'; // Use the DB connection
header("Content-Type: application/json");

// Dsiplay Top 10 scores
$query = "SELECT nickname, avatar, score FROM leaderboard ORDER BY score DESC LIMIT 10";
$result = $conn->query($query);

$leaderboard = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
}

echo json_encode($leaderboard);
?>