<?php
if ($_SERVER['REQUEST_METHOD'] != 'POST' || !isset($_POST['username'])) {
	header('Location: /invalid.php');
	exit;
}

$username = preg_replace("[^a-Z0-9]", "_", $_POST['username']);

if (strlen($username) > 32) {
	header('Location: /invalid.php');
	exit;
}

$color = $_POST['color'];

include('include/user_index.php');
$c = file_get_contents($users_index);
$c .= sprintf("%s,0,10,0,%s\n", $username, $color);
file_put_contents($users_index, $c);

session_start();

$_SESSION['name'] = $username;
$_SESSION['color'] = $color;

header('Location: /rendering.html');

?>
