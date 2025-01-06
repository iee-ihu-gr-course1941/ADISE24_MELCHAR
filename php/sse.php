<?php
    require_once 'dbconnection.php';
    require_once 'session_manager.php';

    session_write_close();

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');

    set_time_limit(0);

    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    ob_implicit_flush(true);

    $board_id = isset($_GET['board_id']) ? intval($_GET['board_id']) : 0;

    if ($board_id <= 0) {
        echo "event: error\n";
        echo "data: " . json_encode(['message' => 'Invalid board ID']) . "\n\n";
        flush();
        exit();
    }

    function getBoardState($mysqli, $board_id) {
        $sql = "SELECT board_main, board_p1_1, board_p1_2, board_p2_1, board_p2_2, updated_at FROM boards WHERE board_id = ?";
        $stmt = $mysqli->prepare($sql);
        if (!$stmt) {
            return null;
        }
        $stmt->bind_param("i", $board_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return $result;
    }

    $boardState = getBoardState($mysqli, $board_id);

    if (!$boardState) {
        echo "event: error\n";
        echo "data: " . json_encode(['message' => 'Board not found']) . "\n\n";
        flush();
        exit();
    }

    $lastUpdate = $boardState['updated_at'];

    echo "event: connected\n";
    echo "data: " . json_encode(['message' => 'Connected to SSE']) . "\n\n";
    flush();

    $interval = 2;

    while (true) {
        if (connection_aborted()) {
            exit();
        }

        $currentState = getBoardState($mysqli, $board_id);

        if (!$currentState) {
            echo "event: error\n";
            echo "data: " . json_encode(['message' => 'Board not found']) . "\n\n";
            flush();
            break;
        }

        if ($currentState['updated_at'] !== $lastUpdate) {
            $lastUpdate = $currentState['updated_at'];

            $data = [
                'message' => 'Data changed'
            ];

            echo "event: update\n";
            echo "data: " . json_encode($data) . "\n\n";
            flush();
        }


        sleep($interval);
    }
?>
