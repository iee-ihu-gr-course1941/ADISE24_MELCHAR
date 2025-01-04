<?php
include("dbconnection.php");
include("session_manager.php");


if ($_SERVER["REQUEST_METHOD"] == "POST"){    
    try {
        $input = json_decode(file_get_contents("php://input"), true);

        $board_id = $input['board_id'];
        $block = $input['block'];
        $initialBlocks = $input['initialBlocks'];
        $player = $input['player'];

        if (!$board_id || !$block || !$player || !$initialBlocks) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required parameteres", "initialBlocks" => $initialBlocks]);
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

        $player_field = 0;

        if($player === 1.1){
            $player_field = "board_p1_1";
        }elseif($player == 1.2){
             $player_field = "board_p1_2";
        }elseif($player == 2.1){
            $player_field = "board_p2_1";
       }elseif($player == 2.2){
        $player_field = "board_p2_2";
        }

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

        $block_key = array_search($initialBlocks, $player_blocks);
        if ($block_key === false) {
            http_response_code(400);
            echo json_encode(["error" => "Block not found in player's blocks.", "player_blocks" => $player_blocks, "block" => $block]);
            exit();
        }

        unset($player_blocks[$block_key]);


        $stmt = $mysqli->prepare("UPDATE boards SET `$player_field` = ?, board_main = ? WHERE board_id = ?");
        $player_blocks_json = json_encode(array_values($player_blocks));

        $combined_data = [
            'player_field' => $player_field,
            'main_board' => $block
        ];
        $main_board[] = $combined_data;
        $final_board_to_send = json_encode($main_board);
        $stmt->bind_param("ssi", $player_blocks_json, $final_board_to_send, $board_id);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Board updated successfully.", "board" => $final_board_to_send]);
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