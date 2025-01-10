<?php
    include("dbconnection.php");
    include("session_manager.php");

    if($_SERVER["REQUEST_METHOD"] === "POST"){

        $jsonBody = file_get_contents('php://input');
        $data = json_decode($jsonBody, true);
 
        try{
            $room_id = filter_var($data["room_id"] ?? "", FILTER_VALIDATE_INT);
            $query = "DELETE FROM boards WHERE board_id = '$room_id'";

            mysqli_query($mysqli, $query);
            http_response_code(200);

        }catch(mysqli_sql_exception $e){
            http_response_code(500);
            echo json_encode(["error" => "Something went wrong"]);
        }

        mysqli_close($mysqli);

    }else {
        http_response_code(405);
        echo json_encode(['error' => 'Invalid request method']);
    }
?>