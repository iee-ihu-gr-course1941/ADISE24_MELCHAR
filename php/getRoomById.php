<?php
    include("dbconnection.php");
    include("session_manager.php");

    if($_SERVER["REQUEST_METHOD"] === "GET"){
 
        try{
            $room_id = filter_var($_GET["room_id"] ?? "", FILTER_VALIDATE_INT);
            $query = "SELECT * FROM rooms WHERE room_id = '$room_id'";

            $roomResult = mysqli_query($mysqli, $query);
            $room = mysqli_fetch_assoc($roomResult);

            http_response_code(200);
            echo json_encode(["room" => $room]);

        }catch(mysqli_sql_exception $e){
            http_response_code(500);
            echo json_encode(["error" => "Something went wrong."]);
        }

        mysqli_close($mysqli);

    }else {
        http_response_code(405);
        echo json_encode(['error' => 'Invalid request method']);
    }
?>