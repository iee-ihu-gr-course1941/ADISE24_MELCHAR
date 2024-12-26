<?php
    include("dbconnection.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        session_start();

        header('Content-Type: application/json');
        header("Access-Control-Allow-Origin: http://localhost:3000");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        $jsonBody = file_get_contents('php://input');

        $data = json_decode($jsonBody, true);

        $username = filter_var($data["username"] ?? "", FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_var($data["password"] ?? "", FILTER_SANITIZE_SPECIAL_CHARS);

        $userQuery = "SELECT * FROM users WHERE username = '$username'";
        try{
            $resultFromUser = mysqli_query($mysqli, $userQuery);
            if(!$resultFromUser){
                http_response_code(404);
                echo json_encode(["error" => "Query execution failed."]);
            }else{
                $row = mysqli_fetch_assoc($resultFromUser);
                if (!$row) {
                    http_response_code(404);
                    echo json_encode(["error" => "User not found."]);
                    exit;
                }else{
                    if(password_verify($password, $row['password_hash'])){
                        $_SESSION['user_id'] = $row['id'];
                        $_SESSION['username'] = $row['username'];
                        $_SESSION['logged_in'] = true;
                        $_SESSION['user_ip'] = $_SERVER['REMOTE_ADDR'];
                        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];

                        http_response_code(200);
                    }else{
                        http_response_code(401);
                        echo json_encode(["error" => "Wrong username or password."]);
                    }
                }
            }
        }catch(mysqli_sql_exception $e){
            http_response_code(404); 
        }

        mysqli_close($mysqli);
    }else {
        http_response_code(405); 
        echo json_encode(["error" => "Invalid request method"]);
    }
?>