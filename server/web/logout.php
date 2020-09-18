<?php

require_once '../vendor/autoload.php';

define('BASE_DIR', realpath( __DIR__ . DIRECTORY_SEPARATOR . '..'));

$config = require('../config.php');

/** @var \Delight\Auth\Auth $auth */
$auth = require('../auth.php');

$auth->logOut();

http_response_code(302);
header('Location: index.php');
