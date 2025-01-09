<?php
include("dbconnection.php");
include("session_manager.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['blocks']) || !isset($input['board_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Blocks data not provided']);
        exit;
    }

    $board_id = $input['board_id'];
    $blocks = json_encode($input['blocks']);
    $board_main_json = json_encode([]);
    $initial_turn = 1.1;
    $initial_player_points = 178;

    try{
      $sql = "INSERT INTO boards (board_id, board_p1_1, board_p1_2, board_p2_1, board_p2_2, board_main, player_turn, player1_points, player2_points)
      VALUES ('{$board_id}', '{$blocks}', '{$blocks}', '{$blocks}', '{$blocks}', '$board_main_json', '$initial_turn', '$initial_player_points', '$initial_player_points')";

      $result = mysqli_query($mysqli, $sql);

      if ($result) {
        http_response_code(200);
      } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create room: ' . mysqli_error($mysqli)]);
      }
    }catch(mysmysqli_sql_exception $e){
      http_response_code(409); 
      echo json_encode(["error" => "You cannot join. The room is full."]);
    }

    mysqli_close($mysqli);

} else {
    http_response_code(405);
    echo json_encode([
        'error' => 'Invalid request method'
    ]);
}
?>
