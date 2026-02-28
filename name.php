<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['name'])) {
	echo '{"success":false,"name":""}';
} else {
	$n = $_SESSION['name'];
	echo "{\"success\":true,\"name\":\"$n\"}";
}
?>
