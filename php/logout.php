<?php
    include("session_manager.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        session_unset();
        session_destroy();

        http_response_code(200);
        echo json_encode(["message" => "Logged out successfully"]);
    }else {
        http_response_code(405); 
        echo json_encode(["error" => "Invalid request method"]);
    }
?>
