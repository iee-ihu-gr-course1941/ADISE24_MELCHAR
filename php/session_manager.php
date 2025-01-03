<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => 'users.iee.ihu.gr',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None'
    ]);

    session_start();

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $sessionLifetime = 15 * 60;
    $inactivityLimit = 1800;

    if (!isset($_SESSION['LAST_REGENERATED'])) {
        $_SESSION['LAST_REGENERATED'] = time();
    } elseif (time() - $_SESSION['LAST_REGENERATED'] > $sessionLifetime) {
        session_regenerate_id(true);
        $_SESSION['LAST_REGENERATED'] = time();
    }

    if (basename($_SERVER['PHP_SELF']) !== 'login.php') {
        if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized access."]);
            exit();
        }
    }

    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > $inactivityLimit) {
        session_unset();
        session_destroy();
        http_response_code(403);
        echo json_encode(["error" => "Session expired due to inactivity."]);
        exit();
    }

    $_SESSION['LAST_ACTIVITY'] = time();

?>
