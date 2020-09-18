<?php

require_once '../vendor/autoload.php';

define('BASE_DIR', realpath( __DIR__ . DIRECTORY_SEPARATOR . '..'));

$config = require('../config.php');

/** @var \Delight\Auth\Auth $auth */
$auth = require('../auth.php');

/* TODO
$auth->login('user', 'pass', 60*60*24*365.25);

http_response_code(302);
header('Location: index.php');
*/
?>
<!DOCTYPE html>
<html lang="it">
<head>
<?php require('../head.php'); ?>
<link type="text/css" rel="stylesheet" href="style.css">
</head>

<body>

<div class="container">
    TODO login
</div>

<?php require('../service_worker.php') ?>

</body>
</html>

