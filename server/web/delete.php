<?php

require_once '../vendor/autoload.php';
require '../util.php';

define('BASE_DIR', realpath( __DIR__ . DIRECTORY_SEPARATOR . '..'));

$config = require('../config.php');

/** @var \Delight\Auth\Auth $auth */
$auth = require('../auth_guard.php');

header('Content-Type: application/json');

$event_id = $_POST['event-id'];

if (!$event_id) {
    http_response_code(400);
    return_json(['message' => 'Parametri non validi']);
}

delete_event($config, $event_id);
http_response_code(200);
return_json([]);
