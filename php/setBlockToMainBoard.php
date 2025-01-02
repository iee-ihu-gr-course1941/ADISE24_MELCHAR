<?php
include("dbconnection.php");
include("session_manager.php");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
    http_response_code(204); 
    exit();
} elseif ($_SERVER["REQUEST_METHOD"] == "POST"){
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    session_start();

    echo "POST";
    
    try {
        $input = json_decode(file_get_contents("php://input"), true);

        $board_id = $input['board_id'];
        $block = $input['block'];
        $player = $input['player'];

        if (!$board_id || !$block || !$player) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required parameteres"]);
            exit();
        }

        $stmt = $mysqli->prepare("SELECT * FROM boards WHERE board_id = ?");
        $stmt->bind_param("i", $board_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $board = $result->fetch_assoc();

        if (!$board) { 
            http_response_code(404);
            echo json_encode(["error" => "Board not found."]);
            exit();
        }

        $player_field = $player === 1? 'board_p1' : 'board_p2';

        $player_blocks = json_decode($board[$player_field], true);
        $main_board = json_decode($board['board_main']);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to parse JSON data from database."]);
            exit();
        }

        if (!is_array($player_blocks) || !is_array($main_board)) {
            http_response_code(500);
            echo json_encode(["error" => "Invalid board data format."]);
            exit();
        }

        $block_key = array_search($block, $player_blocks);
        if ($block_key === false) {
            http_response_code(400);
            echo json_encode(["error" => "Block not found in player's blocks."]);
            exit();
        }

        unset($player_blocks[$block_key]);

        $main_blocks[] = $block;

        $stmt = $mysqli->prepare("UPDATE boards SET $player_field = ?, board_main = ? WHERE board_id = ?");
        $player_blocks_json = json_encode(array_values($player_blocks));
        $main_blocks_json = json_encode($main_blocks);
        $stmt->bind_param("ssi", $player_blocks_json, $main_blocks_json, $board_id);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Board updated successfully."]);
    } catch (mysqli_sql_exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Server error: " . $e->getMessage()]);
    }

    $stmt->close();
    $mysqli->close();
    exit;
}

?>