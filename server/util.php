<?php

require_once 'vendor/autoload.php';

define('GOOGLE_CALENDAR_DATETIME_FORMAT', 'Y-m-d\TH:i:sP');

function encode($content)
{
    return htmlspecialchars($content, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function return_json($data)
{
    die(json_encode($data));
}

/**
 * @param array $config
 * @param DateTime $start
 * @param DateTime $end
 * @param string $event_id
 * @return array
 */
function search_events($config, $start, $end, $event_id = null)
{
    $calendar = create_googlecal_client($config);
    $events = $calendar->events->listEvents($config['google_calendar_id'], [
        'timeMin' => $start->format(GOOGLE_CALENDAR_DATETIME_FORMAT),
        'timeMax' => $end->format(GOOGLE_CALENDAR_DATETIME_FORMAT)
    ])->getItems();
    return array_filter($events, function($value) use ($event_id) {
        return $value->id != $event_id;
    });
}

/**
 * @param array $config
 * @param string $title
 * @param DateTime $start
 * @param DateTime $end
 * @param string|null $description
 * @return Google_Service_Calendar_Event
 */
function create_event($config, $title, $start, $end, $description = null)
{
    $calendar = create_googlecal_client($config);
    $event = make_event($title, $start, $end, $description);
    return $calendar->events->insert($config['google_calendar_id'], $event);
}

function update_event($config, $event_id, $title, $start, $end, $description = null)
{
    $calendar = create_googlecal_client($config);
    $event = make_event($title, $start, $end, $description);
    return $calendar->events->update($config['google_calendar_id'], $event_id, $event);
}

function delete_event($config, $event_id)
{
    $calendar = create_googlecal_client($config);
    return $calendar->events->delete($config['google_calendar_id'], $event_id);
}

function make_event($title, $start, $end, $description = null)
{
    $event = new Google_Service_Calendar_Event();
    $event->summary = $title;
    $event->description = $description;
    $event_start = new Google_Service_Calendar_EventDateTime();
    $event_start->dateTime = $start->format(GOOGLE_CALENDAR_DATETIME_FORMAT);
    $event->setStart($event_start);
    $event_end = new Google_Service_Calendar_EventDateTime();
    $event_end->dateTime = $end->format(GOOGLE_CALENDAR_DATETIME_FORMAT);
    $event->setEnd($event_end);
    return $event;
}

function create_googlecal_client($config)
{
    $client = new Google_Client();
    $client->setAuthConfig($config['google_calendar_credentials']);
    $client->setScopes([Google_Service_Calendar::CALENDAR_EVENTS, Google_Service_Calendar::CALENDAR]);
    $client->setAccessType('offline');
    return new Google_Service_Calendar($client);
}
