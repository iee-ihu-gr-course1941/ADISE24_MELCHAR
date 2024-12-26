<?php
    session_start();

    $sessionLifetime = 15 * 60;
    $inactivityLimit = 1800;

    if (!isset($_SESSION['LAST_REGENERATED'])) {
        $_SESSION['LAST_REGENERATED'] = time();
    } elseif (time() - $_SESSION['LAST_REGENERATED'] > $sessionLifetime) {
        session_regenerate_id(true);
        $_SESSION['LAST_REGENERATED'] = time();
    }

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized access."]);
        exit;
    }

    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > $inactivityLimit) {
        session_unset();
        session_destroy();
        http_response_code(403);
        echo json_encode(["error" => "Session expired due to inactivity."]);
        exit;
    }

    $_SESSION['LAST_ACTIVITY'] = time();

    if ($_SESSION['user_ip'] !== $_SERVER['REMOTE_ADDR'] || $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
        session_unset();
        session_destroy();
        http_response_code(403);
        echo json_encode(["error" => "Session hijacking detected."]);
        exit;
    }
?>
