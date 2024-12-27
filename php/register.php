<?php
    include("dbconnection.php");

    if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
        
        header("Access-Control-Allow-Origin: http://localhost:3000");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        http_response_code(200);
        exit();
    } elseif ($_SERVER["REQUEST_METHOD"] == "POST") {

        header('Content-Type: application/json');
        header("Access-Control-Allow-Origin: http://localhost:3000");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        $jsonBody = file_get_contents('php://input');
        
        $data = json_decode($jsonBody, true);

        $username = filter_var($data["username"] ?? "", FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_var($data["password"] ?? "", FILTER_SANITIZE_SPECIAL_CHARS);
        $email    = filter_var($data["email"]    ?? "", FILTER_SANITIZE_SPECIAL_CHARS);

        if (empty($username)) {
            http_response_code(400); 
            echo json_encode(["error" => "Please enter a username"]);
        } elseif (empty($password)) {
            http_response_code(400); 
            echo json_encode(["error" => "Please enter a password"]);
        } elseif (empty($email)) {
            http_response_code(400); 
            echo json_encode(["error" => "Please enter an email"]);
        } else {
            $hashed_pwd = password_hash($password, PASSWORD_DEFAULT);
            $query = "INSERT INTO users (email, username, password_hash) 
                      VALUES ('$email', '$username', '$hashed_pwd')";
            try {
                mysqli_query($mysqli, $query);
                http_response_code(201); 
                echo json_encode(["message" => "Account created successfully"]);
            } catch (mysqli_sql_exception $e) {
                http_response_code(409); 
                echo json_encode(["error" => "An account with these credentials already exists"]);
            }
        }

        mysqli_close($mysqli);
    } else {
        http_response_code(405); 
        echo json_encode(["error" => "Invalid request method"]);
    }
?>
