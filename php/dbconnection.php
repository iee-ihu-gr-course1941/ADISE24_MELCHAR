<?php
    $user = 'iee2020188';
    $pass = '55lorpolrA@';
    $host = 'localhost';
    $db = 'blockus_db';
    $mysqli = new mysqli($host, $user, $pass, $db, null,'/home/student/iee/2020/iee2020188/mysql/run/mysql.sock');
    
    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . 
        $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }  else {
        echo "Connection successful!";
    }  
    
?>