<?php
    include("dbconnection.php");
    include("session_manager.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $board_id = isset($_GET["board_id"]) ? $_GET["board_id"] : "";

        if (!filter_var($board_id, FILTER_VALIDATE_INT)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid board_id"]);
            exit;
        }

        $board_id = mysqli_real_escape_string($mysqli, $board_id);

        try{
            $query = "DELETE FROM boards WHERE board_id = $board_id";
            mysqli_query($mysqli, $query);

            $query = "DELETE FROM rooms WHERE room_id = $board_id";
            mysqli_query($mysqli, $query);

            http_response_code(200);

        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }

        mysqli_close($mysqli);
    }else{
        http_response_code(405); 
        echo json_encode(['error' => 'Invalid request method']);
    }
?>