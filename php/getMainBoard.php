<?php
    include("dbconnection.php");
    include("session_manager.php");

    if($_SERVER["REQUEST_METHOD"] === "GET"){
        $board_id = filter_var($_GET["board_id"] ?? "", FILTER_VALIDATE_INT);

        try {
            $query = "SELECT board_main FROM boards WHERE board_id = '$board_id'";
            $response = mysqli_query($mysqli, $query);
            $result = mysqli_fetch_assoc($response);
            $board_main_decoded = json_decode($result['board_main'], true);
            http_response_code(200);
            echo json_encode(["board" => $board_main_decoded]);
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