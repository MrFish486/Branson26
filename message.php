<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] != 'GET' || !isset($_GET['name']) || !isset($_GET['message'])) {
	echo '{"success":false,"reason":"Bad request"}';
	exit;
}

include('include/user_index.php');

$username = $_GET['name'] ?: $_SESSION['username'] ?: '';

$message = $_GET['message'];

if (strlen($message) > 1024 || strlen($message) < 1) {
	echo '{"success":false,"reason":"Bad request"}';
	exit;
}

include('include/user_index.php');

$content = explode("\n", file_get_contents($messages_index));

if (count($content) > 9) {
	array_shift($content);
}

array_push($content, sprintf("[%s] : %s", $username, $message));

file_put_contents($messages_index, implode("\n", $content));

echo '{"success":true,"reason":"","messages":[';

foreach ($content as $line) {
	if ($line != $content[0]) echo ",";
	echo sprintf('"%s"', $line);
}

echo ']}';

?>
