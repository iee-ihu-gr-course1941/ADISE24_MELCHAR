<?php
include("dbconnection.php");
include("session_manager.php");


if ($_SERVER["REQUEST_METHOD"] == "POST"){    
    try {
        $input = json_decode(file_get_contents("php://input"), true);

        $board_id = $input['board_id'];
        $block = $input['block'];
        $block_id = filter_var($input['block_id'], FILTER_VALIDATE_INT);
        $player = $input['player'];
        $player_id = filter_var($input['player_id'], FILTER_VALIDATE_INT);
        $piece_length = filter_var($input['piece_length'], FILTER_VALIDATE_INT);

        if (!$board_id || !$block || !$player || !$block_id || !$player_id) {
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

        $block_keys = array_column($player_blocks, 'id');  
        $block_key = array_search($block_id, $block_keys);
        if ($block_key === false) {
            http_response_code(400);
            echo json_encode(["error" => "Block not found in player's blocks.", "player_blocks" => $player_blocks, "block_id" => $block_id]);
            exit();
        }

        unset($player_blocks[$block_key]);

        $turn = 0.0;

        if($player === 1.1){
            $turn = 2.1;
        }elseif($player == 1.2){
             $turn = 2.2;
        }elseif($player == 2.1){
            $turn = 1.2;
       }elseif($player == 2.2){
            $turn = 1.1;
        }

        $points_to_player = "";

        if($player === 1.1 || $player === 1.2){
            $points_to_player = "player1_points";
        }elseif($player === 2.1 || $player === 2.2){
            $points_to_player = "player2_points";
        }

        $updated_points = 0;
        if (sizeof($player_blocks) > 1) {
            $updated_points = $board[$points_to_player] - $piece_length;
        } else {
            $updated_points = $board[$points_to_player] - $piece_length - 15;
        }

        $stmt = $mysqli->prepare("UPDATE boards SET `$player_field` = ?, board_main = ?, player_turn = ?, `$points_to_player` = ?  WHERE board_id = ?");
        $player_blocks_json = json_encode(array_values($player_blocks));

        $combined_data = [
            'player_field' => $player_field,
            'main_board' => $block
        ];
        $main_board[] = $combined_data;
        $final_board_to_send = json_encode($main_board);
        $stmt->bind_param("ssdii", $player_blocks_json, $final_board_to_send, $turn, $updated_points, $board_id);
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