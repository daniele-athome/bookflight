<?php

require_once '../vendor/autoload.php';
require '../util.php';

define('BASE_DIR', realpath( __DIR__ . DIRECTORY_SEPARATOR . '..'));

$config = require('../config.php');

/** @var \Delight\Auth\Auth $auth */
$auth = require('../auth_guard.php');

header('Content-Type: application/json');

$pilot_name = $_POST['pilot-name'];
$notes = $_POST['notes'];
$start_date = DateTime::createFromFormat('Y-m-d H:i', $_POST['flight-date-start'] . ' ' . $_POST['flight-time-start']);
$end_date = DateTime::createFromFormat('Y-m-d H:i', $_POST['flight-date-end'] . ' ' . $_POST['flight-time-end']);

if (!$pilot_name or !$start_date or !$end_date) {
    http_response_code(400);
    return_json(['message' => 'Parametri non validi']);
}

if ($end_date->getTimestamp() - $start_date->getTimestamp() <= 0) {
    http_response_code(400);
    return_json(['message' => 'Date non valide']);
}

if (count(search_events($config, $start_date, $end_date)) > 0) {
    http_response_code(409);
    return_json(['message' => 'Evento in conflitto']);
}

$event = create_event($config, $pilot_name, $start_date, $end_date, $notes);
http_response_code(201);
header('Location: ' . $event['htmlLink']);
return_json(['event' => $event]);
