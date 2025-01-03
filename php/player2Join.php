<?php
    include("session_manager.php");
    include("dbconnection.php");

    if($_SERVER["REQUEST_METHOD"] === "POST"){

        $jsonBody = file_get_contents('php://input');
        $data = json_decode($jsonBody, true);

        $room_id = filter_var($data["room_id"] ?? "", FILTER_VALIDATE_INT); 
        $player2_id = filter_var($data["player2_id"] ?? "", FILTER_VALIDATE_INT);

        if (empty($room_id) || empty($player2_id)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing or invalid parameters."]);
            exit;
        }else{
            try{
                $query = "UPDATE rooms SET player2_id = '$player2_id', status = 'in_progress' WHERE room_id = '$room_id'";
                mysqli_query($mysqli, $query);

                http_response_code(200);
            }catch(mysqli_sql_exception $e){
                http_response_code(500);
                echo json_encode(["error" => "Join room failed."]);
            }

            mysqli_close($mysqli);
        }
    }else {
        http_response_code(405);
        echo json_encode(['error' => 'Invalid request method']);
    }
?>