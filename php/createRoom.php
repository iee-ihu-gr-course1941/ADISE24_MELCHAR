<?php
    include("dbconnection.php");
    include("session_manager.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $jsonBody = file_get_contents('php://input');
        $data = json_decode($jsonBody, true);
        $player1_id = filter_var($data["player1_id"] ?? "", FILTER_SANITIZE_SPECIAL_CHARS);


        $playerIdWithCreatedRoom = "SELECT player1_id FROM rooms WHERE player1_id = '$player1_id'";
        $result = mysqli_query($mysqli, $playerIdWithCreatedRoom);
        $playerIdWithCreatedRoom = mysqli_fetch_assoc($result)['player1_id'] ?? '';

        if(empty($playerIdWithCreatedRoom)){
            $query = "INSERT INTO rooms (player1_id, player2_id, status) VALUES ('$player1_id', NULL, 'waiting')";

            try{ 
                 mysqli_query($mysqli, $query);
                 http_response_code(200);
            }catch(mysqli_sql_exception $e){
                 http_response_code(404); 
                 echo json_encode(["error" => "The creation of room has failed."]);
            }
        }else{
            http_response_code(409);
            echo json_encode(["error" => "This player has already an active room."]);
        }
        
        mysqli_close($mysqli);
    }else {
        http_response_code(405); 
        echo json_encode(["error" => "Invalid request method."]);
    }
?>