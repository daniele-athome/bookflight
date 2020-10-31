<?php

require_once '../vendor/autoload.php';

define('BASE_DIR', realpath( __DIR__ . DIRECTORY_SEPARATOR . '..'));

$config = require('../config.php');

/** @var \Delight\Auth\Auth $auth */
$auth = require('../auth.php');
if (!$auth->isLoggedIn()) {
    http_response_code(302);
    header('Location: login.php');
    die();
}

?>
<!DOCTYPE html>
<html lang="it">
<head>
<?php require('../head.php'); ?>
<link type="text/css" rel="stylesheet" href="fullcalendar/core/main.min.css">
<link type="text/css" rel="stylesheet" href="fullcalendar/bootstrap/main.min.css">
<link type="text/css" rel="stylesheet" href="fullcalendar/daygrid/main.min.css">
<link type="text/css" rel="stylesheet" href="fullcalendar/list/main.min.css">
<link type="text/css" rel="stylesheet" href="fullcalendar/timegrid/main.min.css">
<link type="text/css" rel="stylesheet" href="style.css?v=8">

</head>

<body>

<div id="calendar"></div>

<div class="modal fade" id="bookFlight" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Prenota</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="bookFlightForm">
                    <div class="form-group">
                        <label for="book-pilot-name" class="col-form-label">Socio:</label>
                        <select class="custom-select" name="pilot-name" id="book-pilot-name" required>
                            <option value=""></option>
                            <option>Claudia</option>
                            <option>Daniele</option>
                            <option>Davide</option>
                            <option>Manuel</option>
                            <option>Paolo</option>
                            <option>Simone</option>
                            <option>Victoriano</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="book-flight-date-start" class="col-form-label">Inizio (data - ora):</label>
                        <div class="form-row">
                            <div class="col">
                                <input type="date" class="form-control" name="flight-date-start" id="book-flight-date-start" required/>
                            </div>
                            <div class="col">
                                <input type="time" class="form-control" name="flight-time-start" id="book-flight-time-start" required/>
                            </div>
                        </div>
                        <div class="form-text form-suntimes">
                            <span class="text-sunrise">
                                <i class="fas fa-fw fa-sun"></i> <span id="book-flight-start-sunrise">--:--:--</span>
                            </span>
                            <span class="text-sunset">
                                <i class="fas fa-fw fa-moon"></i> <span id="book-flight-start-sunset">--:--:--</span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="book-flight-date-end" class="col-form-label">Fine (data - ora):</label>
                        <div class="form-row">
                            <div class="col">
                                <input type="date" class="form-control" name="flight-date-end" id="book-flight-date-end" required/>
                            </div>
                            <div class="col">
                                <input type="time" class="form-control" name="flight-time-end" id="book-flight-time-end" required/>
                            </div>
                        </div>
                        <div class="form-text form-suntimes">
                            <span class="text-sunrise">
                                <i class="fas fa-fw fa-sun"></i> <span id="book-flight-end-sunrise">--:--:--</span>
                            </span>
                            <span class="text-sunset">
                                <i class="fas fa-fw fa-moon"></i> <span id="book-flight-end-sunset">--:--:--</span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="book-notes" class="col-form-label">Note:</label>
                        <textarea class="form-control" name="notes" id="book-notes"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                <button type="button" class="btn btn-primary" id="book-button-save">
                    <span class="spinner-border spinner-border-sm d-none" id="book-loading" role="status" aria-hidden="true"></span>
                    Prenota
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editFlight" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modifica</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="editFlightForm">
                    <input type="hidden" name="event-id" id="edit-event-id"/>
                    <div class="form-group">
                        <label for="edit-pilot-name" class="col-form-label">Socio:</label>
                        <select class="custom-select" name="pilot-name" id="edit-pilot-name" required>
                            <option>Claudia</option>
                            <option>Daniele</option>
                            <option>Davide</option>
                            <option>Manuel</option>
                            <option>Paolo</option>
                            <option>Simone</option>
                            <option>Victoriano</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-flight-date-start" class="col-form-label">Inizio (data - ora):</label>
                        <div class="form-row">
                            <div class="col">
                                <input type="date" class="form-control" name="flight-date-start" id="edit-flight-date-start" required/>
                            </div>
                            <div class="col">
                                <input type="time" class="form-control" name="flight-time-start" id="edit-flight-time-start" required/>
                            </div>
                        </div>
                        <div class="form-text form-suntimes">
                            <span class="text-sunrise">
                                <i class="fas fa-fw fa-sun"></i> <span id="edit-flight-start-sunrise">--:--:--</span>
                            </span>
                            <span class="text-sunset">
                                <i class="fas fa-fw fa-moon"></i> <span id="edit-flight-start-sunset">--:--:--</span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-flight-date-end" class="col-form-label">Fine (data - ora):</label>
                        <div class="form-row">
                            <div class="col">
                                <input type="date" class="form-control" name="flight-date-end" id="edit-flight-date-end" required/>
                            </div>
                            <div class="col">
                                <input type="time" class="form-control" name="flight-time-end" id="edit-flight-time-end" required/>
                            </div>
                        </div>
                        <div class="form-text form-suntimes">
                            <span class="text-sunrise">
                                <i class="fas fa-fw fa-sun"></i> <span id="edit-flight-end-sunrise">--:--:--</span>
                            </span>
                            <span class="text-sunset">
                                <i class="fas fa-fw fa-moon"></i> <span id="edit-flight-end-sunset">--:--:--</span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-notes" class="col-form-label">Note:</label>
                        <textarea class="form-control" name="notes" id="edit-notes"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                <button type="button" class="btn btn-danger" id="edit-button-delete">
                    <span class="spinner-border spinner-border-sm d-none" id="delete-loading" role="status" aria-hidden="true"></span>
                    Elimina
                </button>
                <button type="button" class="btn btn-primary" id="edit-button-save">
                    <span class="spinner-border spinner-border-sm d-none" id="edit-loading" role="status" aria-hidden="true"></span>
                    Modifica
                </button>
            </div>
        </div>
    </div>
</div>

<script src="jquery/jquery.min.js"></script>
<script src="bootstrap/bootstrap.min.js"></script>
<script src="fullcalendar/core/main.min.js"></script>
<script src="fullcalendar/bootstrap/main.min.js"></script>
<script src="fullcalendar/core/locales/it.js"></script>
<script src="fullcalendar/daygrid/main.min.js"></script>
<script src="fullcalendar/list/main.min.js"></script>
<script src="fullcalendar/google-calendar/main.min.js"></script>
<script src="fullcalendar/timegrid/main.min.js"></script>
<script src="suncalc/suncalc.min.js"></script>

<?php require('../service_worker.php') ?>

<script type="text/javascript">
var calendar = null;

function getSuntimes(date) {
    // Fly Roma coordinates and height (190 ft)
    return SunCalc.getTimes(date, 41.88, 12.71, 58);
}

document.addEventListener('DOMContentLoaded', function() {
    // back button with dialogs -- thanks to https://stackoverflow.com/a/61431389/1045199
    $('div.modal').on('show.bs.modal', function() {
        var modal = this;
        var hash = modal.id;
        window.location.hash = hash;
        window.onhashchange = function() {
            if (!location.hash){
                $(modal).modal('hide');
            }
        }
    });
    $('div.modal').on('hidden.bs.modal', function() {
        history.replaceState('', document.title, window.location.pathname);
    });
    // when close button clicked simulate back
    $('div.modal button.close').on('click', function(){
        window.history.back();
    })
    // when esc pressed when modal open simulate back
    $('div.modal').keyup(function(e) {
        if (e.keyCode == 27){
            window.history.back();
        }
    });

    // book flight
    $('#book-flight-date-start').change(function() {
        var startAsDate = document.getElementById('book-flight-date-start').valueAsDate;
        if (startAsDate) {
            var suntimes = getSuntimes(startAsDate);
            $('#book-flight-start-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
            $('#book-flight-start-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
            document.getElementById('book-flight-date-end').valueAsDate = new Date(startAsDate.getTime());
            $('#book-flight-end-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
            $('#book-flight-end-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
        }
        else {
            $('#book-flight-start-sunrise').text("--:--:--");
            $('#book-flight-start-sunset').text("--:--:--");
        }
    });
    $('#book-flight-date-end').change(function() {
        var endAsDate = document.getElementById('book-flight-date-end').valueAsDate;
        if (endAsDate) {
            var suntimes = getSuntimes(endAsDate);
            $('#book-flight-end-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
            $('#book-flight-end-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
        }
        else {
            $('#book-flight-end-sunrise').text("--:--:--");
            $('#book-flight-end-sunset').text("--:--:--");
        }
    });
    $('#book-button-save').click(function () {
        var submit = document.getElementById('book-button-save');
        if (submit.disabled) {
            return;
        }

        submit.disabled = true;
        $('#book-loading').removeClass('d-none');

        $.ajax({
            type: 'POST',
            url: 'book.php',
            data: $('#bookFlightForm').serialize(),
            complete: function() {
                $('#book-loading').addClass('d-none');
                document.getElementById('book-button-save').disabled = false;
            },
            success: function(data) {
                console.log(data);
                $('#bookFlight').modal('hide');
                alert('Prenotazione effettuata.');
                calendar.refetchEvents();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(errorThrown);

                if (jqXHR.status === 400) {
                    alert("Dati non validi.");
                }
                else if (jqXHR.status === 409) {
                    alert("Un'altra prenotazione è già presente per l'orario indicato!");
                }
                else if (jqXHR.status === 401) {
                    // ma si...
                    location.reload();
                }
                else {
                    alert("Errore sconosciuto.");
                }
            }
        });
    });

    // edit flight
    $('#edit-flight-date-start').change(function() {
        var startAsDate = document.getElementById('edit-flight-date-start').valueAsDate;
        if (startAsDate) {
            var suntimes = getSuntimes(startAsDate);
            $('#edit-flight-start-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
            $('#edit-flight-start-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
            document.getElementById('edit-flight-date-end').valueAsDate = new Date(startAsDate.getTime());
            $('#edit-flight-end-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
            $('#edit-flight-end-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
        }
        else {
            $('#edit-flight-start-sunrise').text("--:--:--");
            $('#edit-flight-start-sunset').text("--:--:--");
        }
    });
    $('#edit-flight-date-end').change(function() {
        var endAsDate = document.getElementById('edit-flight-date-end').valueAsDate;
        if (endAsDate) {
            var suntimes = getSuntimes(endAsDate);
            $('#edit-flight-end-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
            $('#edit-flight-end-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
        }
        else {
            $('#edit-flight-end-sunrise').text("--:--:--");
            $('#edit-flight-end-sunset').text("--:--:--");
        }
    });
    $('#edit-button-save').click(function () {
        var submit = document.getElementById('edit-button-save');
        if (submit.disabled) {
            return;
        }

        submit.disabled = true;
        document.getElementById('edit-button-delete').disabled = true;
        $('#edit-loading').removeClass('d-none');

        $.ajax({
            type: 'POST',
            url: 'update.php',
            data: $('#editFlightForm').serialize(),
            complete: function() {
                $('#edit-loading').addClass('d-none');
                document.getElementById('edit-button-save').disabled = false;
                document.getElementById('edit-button-delete').disabled = false;
            },
            success: function(data) {
                console.log(data);
                $('#editFlight').modal('hide');
                alert('Prenotazione modificata.');
                calendar.refetchEvents();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(errorThrown);

                if (jqXHR.status === 400) {
                    alert("Dati non validi.");
                }
                else if (jqXHR.status === 409) {
                    alert("Un'altra prenotazione è già presente per l'orario indicato!");
                }
                else if (jqXHR.status === 401) {
                    // ma si...
                    location.reload();
                }
                else {
                    alert("Errore sconosciuto.");
                }
            }
        });
    });
    $('#edit-button-delete').click(function () {
        var submit = document.getElementById('edit-button-delete');
        if (submit.disabled) {
            return;
        }

        if (!confirm('Cancellare la prenotazione?')) {
            return;
        }

        submit.disabled = true;
        document.getElementById('edit-button-save').disabled = true;
        $('#delete-loading').removeClass('d-none');

        $.ajax({
            type: 'POST',
            url: 'delete.php',
            data: $('#editFlightForm').serialize(),
            complete: function() {
                $('#delete-loading').addClass('d-none');
                document.getElementById('edit-button-delete').disabled = false;
                document.getElementById('edit-button-save').disabled = false;
            },
            success: function(data) {
                console.log(data);
                $('#editFlight').modal('hide');
                alert('Prenotazione cancellata.');
                calendar.refetchEvents();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(errorThrown);

                if (jqXHR.status === 400) {
                    alert("Dati non validi.");
                }
                else {
                    alert("Errore sconosciuto.");
                }
            }
        });
    });

    calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        plugins: ['bootstrap', 'dayGrid', 'timeGrid', 'list', 'googleCalendar'],
        themeSystem: 'bootstrap',
        customButtons: {
            bookflight: {
                text: 'Prenota',
                click: function () {
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    document.getElementById('book-flight-date-start').valueAsDate = tomorrow;
                    document.getElementById('book-flight-date-end').valueAsDate = tomorrow;
                    var suntimes = getSuntimes(tomorrow);
                    console.log(suntimes);
                    $('#book-flight-start-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
                    $('#book-flight-start-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
                    $('#book-flight-end-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
                    $('#book-flight-end-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
                    $('#bookFlight').modal('show');
                }
            }
        },
        header: {
            left: 'prev,next today bookflight',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
            listWeek: 'Agenda'
        },

        defaultView: 'listWeek',
        locale: 'it',
        height: 'auto',
        displayEventTime: true, // don't show the time column in list view
        allDaySlot: false,
        minTime: '05:00:00',
        maxTime: '22:00:00',

        googleCalendarApiKey: 'AIzaSyDijFzSBlkyl_zVH2gQuaokJpm7y-mIKkg',

        events: '9kf3jm0tpcfvpc6i8qe7fhm1p0@group.calendar.google.com',

        eventClick: function (arg) {
            var timeOptions = {
                hour: "2-digit", minute: "2-digit", hour12: false, timeZone: arg.event.start.timeZone
            };

            // opens events in a popup window
            console.log(arg.event);
            //window.open(arg.event.url, '_blank', 'width=700,height=600');

            $('#edit-event-id').val(arg.event.id);
            $('#edit-pilot-name').val(arg.event.title);

            document.getElementById('edit-flight-date-start').valueAsDate = arg.event.start;
            document.getElementById('edit-flight-time-start').value = arg.event.start.toLocaleTimeString('it-it', timeOptions);
            var suntimesStart = getSuntimes(arg.event.start);
            $('#edit-flight-start-sunrise').text(suntimesStart.sunrise.toLocaleTimeString("it-IT"));
            $('#edit-flight-start-sunset').text(suntimesStart.sunset.toLocaleTimeString("it-IT"));

            document.getElementById('edit-flight-date-end').valueAsDate = arg.event.end;
            document.getElementById('edit-flight-time-end').value = arg.event.end.toLocaleTimeString('it-it', timeOptions);
            var suntimesEnd = getSuntimes(arg.event.end);
            $('#edit-flight-end-sunrise').text(suntimesEnd.sunrise.toLocaleTimeString("it-IT"));
            $('#edit-flight-end-sunset').text(suntimesEnd.sunset.toLocaleTimeString("it-IT"));

            $('#edit-notes').val(arg.event.extendedProps.description);
            $('#editFlight').modal('show');

            arg.jsEvent.preventDefault();
        }
    });

    calendar.render();
});
</script>

</body>
</html>
