<?php

header("Access-Control-Allow-Origin: *"); // cross origin request
header("Content-Type: application/json"); // header tellthe browser that theresponse is json

// external api link
$api_endpoint = "https://marcconrad.com/uob/banana/api.php?out=json";

$options = [
    'http' => [
        'timeout' => 5,
        'ignore_errors' => true
    ]
];

$context = stream_context_create($options);
$data = @file_get_contents($api_endpoint, false, $context);

if ($data !== false) {
    echo $data;
} else {
    // fallback if the remote server is down
    http_response_code(502);
    echo json_encode([
        "status" => "error",
        "message" => "Could not reach Banana API"
    ]);
}
?>