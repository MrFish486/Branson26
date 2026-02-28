<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
	echo '{"success":false,"reason":"Bad request"}';
	exit;
}

include('include/user_index.php');

include('include/user_index.php');

$content = file_get_contents($messages_index);

echo '{"success":true,"reason":"","messages":[';

for ($i = 0; $i < count(explode("\n", $content)); $i ++) {
	$line = explode("\n", $content)[$i];
	if ($i != 0) echo ",";
	echo sprintf('"%s"', $line);
}

echo ']}';

?>