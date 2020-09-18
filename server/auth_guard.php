<?php

/** @var \Delight\Auth\Auth $auth */
$auth = require('auth.php');

if (!$auth->isLoggedIn()) {
    http_response_code(401);
    die();
}

return $auth;
