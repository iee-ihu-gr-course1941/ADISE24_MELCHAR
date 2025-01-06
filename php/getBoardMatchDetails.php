<?php
    include("dbconnection.php");
    include("session_manager.php");

    if($_SERVER["REQUEST_METHOD"] === "GET"){
        $board_id = filter_var($_GET["board_id"] ?? "", FILTER_VALIDATE_INT);

        try {
            $query = "SELECT player_turn, player1_points, player2_points FROM boards WHERE board_id = '$board_id'";
            $response = mysqli_query($mysqli, $query);
            $result = mysqli_fetch_assoc($response);
            http_response_code(200);
            echo json_encode(["player_turn" => $result['player_turn'], "player1_points" => $result['player1_points'], "player2_points" => $result['player2_points']]);
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