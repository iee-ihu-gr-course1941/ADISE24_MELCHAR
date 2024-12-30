<?php
include("dbconnection.php");

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");  
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json'); 

ini_set('display_errors', 0);
error_reporting(0);

if(!isset($_GET['board_id'])) {
  echo json_encode(['success' => false, 'message' => 'board_id not provided']);
  exit; 
}

$board_id = intval($_GET['board_id']);

$sql = "SELECT board_p1 FROM boards WHERE board_id=?";
$stmt = $mysqli->prepare($sql);

if($stmt === false) {
  $response = array('success' => false, 'message' => 'Failed to prepare SQL statement');
  echo json_encode($response);
  exit;
}

$stmt->bind_param("i",$board_id);

if($stmt->execute()) {
  $response = array('success' => true, 'message' => 'Board returned successfully');;
  $result = $stmt->get_result();
} else {
  $response = array('success' => false, 'message' => 'Board did not return successfully');
}

if($stmt->errno) {
  $response = array('success' => false, 'message' => 'MySQL error: ' . $stmt->error);
}

if($result->num_rows>0) {
  $row = $result->fetch_assoc();
  echo json_encode(['success' => true, 'board_p1' => json_decode($row['board_p1'])]);
} else {
  echo json_encode(['success' => false, 'message' => 'Board not found']);
}

$stmt->close();
$mysqli->close();
exit;
?>