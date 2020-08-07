<?php

header('Content-Type: text/plain');

require_once 'vendor/autoload.php';

$client = new Google_Client();
$client->setAuthConfig('service_account.json');
$client->setScopes([Google_Service_Calendar::CALENDAR_EVENTS, Google_Service_Calendar::CALENDAR]);
$client->setAccessType('offline');

$calendar = new Google_Service_Calendar($client);
$list_result = $calendar->calendars->get('9kf3jm0tpcfvpc6i8qe7fhm1p0@group.calendar.google.com');
print_r($list_result);

$event = new Google_Service_Calendar_Event();
$event->summary = 'Manuel';
$start = new Google_Service_Calendar_EventDateTime();
$start->dateTime = '2020-08-07T09:30:00+02:00';
$event->setStart($start);
$end = new Google_Service_Calendar_EventDateTime();
$end->dateTime = '2020-08-07T10:30:00+02:00';
$event->setEnd($end);
$event_result = $calendar->events->insert('9kf3jm0tpcfvpc6i8qe7fhm1p0@group.calendar.google.com', $event);
print_r($event_result);
