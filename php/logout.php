<?php

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    
    session_start();
    session_unset();
    session_destroy();

    http_response_code(200);
    echo json_encode(["message" => "Logged out successfully"]);
?>
