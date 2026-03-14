<?php
session_start();
require_once 'db.php';

header("Content-Type: application/json");

$postData = json_decode(file_get_contents("php://input"), true);

// prioritizing the data from the game over the session
$nick = isset($postData['nickname']) ? trim($postData['nickname']) : ($_SESSION['nickname'] ?? '');
$pic  = isset($postData['avatar']) ? trim($postData['avatar']) : ($_SESSION['avatar'] ?? '🥷');
$pts  = isset($postData['score']) ? intval($postData['score']) : 0;

if (!$nick) {
    echo json_encode(["status" => "error", "msg" => "no name provided"]);
    exit;
}

try {
    // update score if user exists, otherwise insert new row
    // needs a UNIQUE index on (nickname, avatar) to work properly!
    $upsert = "INSERT INTO leaderboard (nickname, avatar, score) 
               VALUES (?, ?, ?) 
               ON DUPLICATE KEY UPDATE 
               score = score + VALUES(score),
               avatar = VALUES(avatar)";

    $stmt = $conn->prepare($upsert);
    $stmt->bind_param("ssi", $nick, $pic, $pts);

    if ($stmt->execute()) {
        // keep session data fresh
        $_SESSION['nickname'] = $nick;
        $_SESSION['avatar'] = $pic;

        // get the new total to send back to the game screen
        $check = $conn->prepare("SELECT score FROM leaderboard WHERE nickname = ? AND avatar = ?");
        $check->bind_param("ss", $nick, $pic);
        $check->execute();
        $res = $check->get_result();
        $finalTotal = ($row = $res->fetch_assoc()) ? $row['score'] : $pts;

        echo json_encode([
            "status" => "success",
            "total_score" => $finalTotal
        ]);
    }
} catch (Exception $err) {
    // just send back the error message if something breaks
    echo json_encode(["status" => "error", "msg" => $err->getMessage()]);
}