<?php

require_once '../vendor/autoload.php';
require '../util.php';

define('BASE_DIR', realpath( __DIR__ . DIRECTORY_SEPARATOR . '..'));

$config = require('../config.php');

/** @var \Delight\Auth\Auth $auth */
$auth = require('../auth.php');

$username = isset($_POST['username']) ? $_POST['username'] : null;
$password = isset($_POST['password']) ? $_POST['password'] : null;
$remember = isset($_POST['remember']);
$login_failed = false;

if ($username && $password) {
    try {
        $auth->loginWithUsername($username, $password, $remember ? 60 * 60 * 24 * 365.25 : null);
        http_response_code(302);
        header('Location: index.php');
        die();
    }
    catch (\Delight\Auth\AttemptCancelledException |
           \Delight\Auth\AuthError |
           \Delight\Auth\EmailNotVerifiedException |
           \Delight\Auth\AmbiguousUsernameException $e) {
        // internal error - fail terribly
        http_response_code(503);
        require('../error.php');
        die();
    }
    catch (\Delight\Auth\InvalidPasswordException |
           \Delight\Auth\UnknownUsernameException |
           \Delight\Auth\TooManyRequestsException $e) {
        $login_failed = true;
    }
}

?>
<!DOCTYPE html>
<html lang="it">
<head>
<?php require('../head.php'); ?>
<link type="text/css" rel="stylesheet" href="style.css">
</head>

<body class="body-signin">

<div class="container text-center">

    <form class="form-signin" method="post">
        <img class="mb-4" src="favicon-512x512.png" alt="" style="width: 10em; height: 10em">
        <?php if ($login_failed): ?>
        <div class="alert alert-danger">
            Utente o password non validi.
        </div>
        <?php endif; ?>
        <label for="inputUsername" class="sr-only">Utente</label>
        <input type="text" name="username" id="inputUsername" value="<?= $username ? encode($username) : '' ?>" class="form-control" placeholder="Nome utente" required autofocus>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" name="password" id="inputPassword" value="<?= $password ? encode($password) : '' ?>" class="form-control" placeholder="Password" required>
        <div class="checkbox mb-3">
            <label>
                <input type="checkbox" name="remember" value="remember-me" <?= $remember ? 'checked' : ''?>> Ricordami
            </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Entra</button>
    </form>

</div>

<?php require('../service_worker.php') ?>

</body>
</html>

