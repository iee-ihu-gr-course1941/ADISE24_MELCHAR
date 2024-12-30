<?php
include("dbconnection.php");

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");  
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Access-Control-Allow-Credentials: true');

ini_set('display_errors', 1);
error_reporting(E_ALL);

$input = json_decode(file_get_contents('php://input'), true);

if(isset($input['blocks']) && isset($input['board_id'])) {
  $board_id = $input['board_id'];
  $blocks = json_encode($input['blocks']);
} else {
  $response = array('success' => false, 'message' => 'Blocks data not provided');
  echo json_encode($response);
  exit;
}

$sql = "INSERT INTO boards (board_id, board_p1, board_p2) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($sql);

if ($stmt === false) {
  $response = array('success' => false, 'message' => 'Failed to prepare SQL statement');
  echo json_encode($response);
  exit;
}

$stmt->bind_param("iss",$board_id, $blocks, $blocks);

if($stmt->execute()) {
  $response = array('success' => true, 'message' => 'Room created successfully');
} else {
  $response = array('success' => false, 'message' => 'Failed to create room');
}

if ($stmt->errno) {
  $response = array('success' => false, 'message' => 'MySQL error: ' . $stmt->error);
}

$stmt->close();

echo json_encode($response);
?>