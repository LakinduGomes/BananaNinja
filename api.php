<?php
header("Content-Type: application/json");

$bananaUrl = "https://marcconrad.com/uob/banana/api.php";

// Fetch data from Banana API
$response = @file_get_contents($bananaUrl);

if ($response === FALSE) {
    echo json_encode([
        "error" => true,
        "message" => "Failed to fetch Banana API"
    ]);
    exit;
}

// Return raw JSON from Banana API
echo $response;
