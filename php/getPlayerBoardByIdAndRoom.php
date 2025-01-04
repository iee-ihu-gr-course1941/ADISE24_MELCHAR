<?php
    include("dbconnection.php");
    include("session_manager.php");

    if($_SERVER["REQUEST_METHOD"] === "GET"){
        $room_id = filter_var($_GET["room_id"] ?? "", FILTER_VALIDATE_INT);
        $boardNum = filter_var($_GET["boardNum"] ?? "", FILTER_SANITIZE_SPECIAL_CHARS);

        try {
            $query = "SELECT `$boardNum` FROM boards WHERE board_id = '$room_id'";
            $response = mysqli_query($mysqli, $query);
            $result = mysqli_fetch_assoc($response);

            http_response_code(200);
            echo json_encode(["board" => $result]);
        } catch (mysqli_sql_exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }

        mysqli_close($mysqli);
    }else {
        http_response_code(405);
        echo json_encode(['error' => 'Invalid request method']);
    }
?>