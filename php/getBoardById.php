<?php
    include("dbconnection.php");
    include("session_manager.php");

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $board_id = isset($_GET["board_id"]) ? $_GET["board_id"] : "";

        if (!filter_var($board_id, FILTER_VALIDATE_INT)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid board_id"]);
            exit;
        }

        $board_id = mysqli_real_escape_string($mysqli, $board_id);

        try {
            $query = "SELECT * FROM boards WHERE board_id = '$board_id'";
            $response = mysqli_query($mysqli, $query);

            if (!$response) {
                throw new Exception("Database query failed: " . mysqli_error($mysqli));
            }

            $result = mysqli_fetch_assoc($response);

            if (!$result) {
                http_response_code(404);
                echo json_encode(["error" => "Board not found"]);
                exit;
            }

            $field_types = [
                'board_id'    => 'int',
                'board_p1_1'  => 'json',
                'board_p1_2'  => 'json',
                'board_p2_1'  => 'json',
                'board_p2_2'  => 'json',
                'updated_at'  => 'string',
                'player_turn' => 'float',
                'player1_points' => 'int',
                'player2_points' => 'int',
                'board_main'  => 'json',
            ];

            foreach ($field_types as $field => $type) {
                if (isset($result[$field])) {
                    switch ($type) {
                        case 'int':
                            $result[$field] = (int)$result[$field];
                            break;
                        case 'float':
                            $result[$field] = (float)$result[$field];
                            break;
                        case 'json':
                            $decoded_json = json_decode($result[$field], true);
                            $result[$field] = (json_last_error() === JSON_ERROR_NONE) ? $decoded_json : null;
                            break;
                        case 'string':
                        default:
                            break;
                    }
                }
            }

            echo json_encode(["board" => $result]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }

        mysqli_close($mysqli);
    } else {

        http_response_code(405); 
        echo json_encode(['error' => 'Invalid request method']);
    }
?>
