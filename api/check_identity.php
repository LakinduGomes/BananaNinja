<?php
session_start();
require_once 'db.php';

header("Content-Type: application/json");

// pull from get or session if refresh happens
$user_name = isset($_GET['nickname']) ? trim($_GET['nickname']) : ($_SESSION['nickname'] ?? '');
$user_pic  = isset($_GET['avatar']) ? trim($_GET['avatar']) : ($_SESSION['avatar'] ?? '');

if (!$user_name) {
    echo json_encode(["exists" => false, "msg" => "missing nickname"]);
    exit;
}

try {
    // check if this user already exists in the db
    $query = "SELECT score FROM leaderboard WHERE nickname = ? AND avatar = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $user_name, $user_pic);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows > 0) {
        $row = $res->fetch_assoc();
        
        // keep session in sync
        $_SESSION['nickname'] = $user_name;
        $_SESSION['avatar'] = $user_pic;

        echo json_encode([
            "status" => "success",
            "exists" => true,
            "score"  => (int)$row['score'],
            "name"   => $user_name
        ]);
    } else {
        // user not found, must be new
        echo json_encode([
            "status" => "success",
            "exists" => false,
            "msg"    => "new player"
        ]);
    }
} catch (Exception $err) {
    http_response_code(500);
    echo json_encode(["status" => "error", "error_log" => $err->getMessage()]);
}