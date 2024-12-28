<?php
    include("dbconnection.php");
    include("session_manager.php");

    if ($_SERVER["REQUEST_METHOD"] == "GET") {

        $query = "SELECT * FROM rooms";

       try{ 
            $rooms = mysqli_query($mysqli, $query);
            $roomsArray = array();
            
            while ($row = mysqli_fetch_assoc($rooms)) {
                $roomsArray[] = $row;
            }

            http_response_code(200);
            echo json_encode(["rooms" => $roomsArray]);
       }catch(mysqli_sql_exception $e){
            http_response_code(404); 
            echo json_encode(["error" => "The creation of room has failed"]);
       }

        mysqli_close($mysqli);
    }else {
        http_response_code(405); 
        echo json_encode(["error" => "Invalid request method"]);
    }
?>