<?php /** @noinspection PhpUndefinedVariableInspection */

use Delight\Auth\Auth;
use Delight\Db\PdoDsn;

return new Auth(new PdoDsn($config['database']));
