<!--
    My Course Info Website
    By Amy Burnett
-->

<?php 

// DATA SETUP
// =========================================================
  
// load data file
$filename = "courses.json";
$schedules = json_decode(file_get_contents($filename));
$current_schedule = NULL;

// get current schedule from GET request
// if it is provided
if (isset($_GET["semester"])) {
    $current_schedule = get_schedule($schedules, $_GET["semester"]);
}
// no semester provided
else {
    $current_schedule = $schedules[sizeof($schedules)-1];
}

// MAIN DOCUMENT
// =========================================================
?> 

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Amy's Course Info</title>
        <link rel="stylesheet" href="style.css" />
        <script>
            <?php // send schedule to javascript to more easily work with DOM styles ?>
            var data = <?php echo json_encode($current_schedule);?>;
        </script>
        <script src="calendar.js"></script>
    </head>
    <body>
        <form>
            <label>Schedule</label>
            <select name="semester">
                <?php grab_schedule_options($schedules, $current_schedule->semester); ?>
            </select>
            <input type="submit" value="Grab Schedule">
        </form>
        <div id="desc">
            <h1>Amy Burnett</h1>
            <h2><?=$current_schedule->semester?></h2>
        </div>
        <?php print_calendar ($current_schedule); ?>
        <?php print_schedule ($current_schedule); ?>
    </body>
</html>


<?php

// FUNCTIONS
// =========================================================

function print_schedule ($schedule)
{
?>
<table id="schedule">
    <tr>
        <th>Color</th>
        <th>Dept</th>
        <th>Course Id</th>
        <th>Course Name</th>
        <th>Instructor</th>
        <th>Days</th>
        <th>Times</th>
        <th>Zoom Url</th>
    </tr>
<?php
    foreach ($schedule->courses as $course)
    {
?>
    <tr>
        <td>
            <div style="width:50px;height:50px;background-color: <?=$course->color?>"></div>
        </td>
        <td><?=$course->dept?></td>
        <td><?=$course->course_id?></td>
<?php
if ($course->course_page != ""){
?>
        <td><a href="<?=$course->course_page?>"><?=$course->course_name?></a></td>
<?php
} else {
?>
        <td><?=$course->course_name?></td>
<?php } ?>
        <td><?=$course->instructor?></td>
        <td><?=$course->days?></td>
        <td><?=$course->start_time?>-<?=$course->end_time?></td>
        <td><a href="<?=$course->zoom_url?>"><?=$course->zoom_url?></a></td>
    </tr>
<?php
    }
?>

</table>

<?php
}


// =========================================================

function grab_schedule_options($schedules, $current_semester) {
    foreach ($schedules as $schedule) {
        if ($schedule->semester == $current_semester) {
            ?>
            <option value="<?=$schedule->semester?>" selected><?=$schedule->semester?></option>
            <?php
        }
        else {
            ?>
            <option value="<?=$schedule->semester?>"><?=$schedule->semester?></option>
            <?php
        }
    }

}

// =========================================================

function get_schedule ($schedules, $given_semester) {
    foreach ($schedules as $schedule) {
        if ($schedule->semester == $given_semester) {
            // return schedule with matching semester
            return $schedule; 
        }
    }
    // return last schedule 
    return $schedules[sizeof($schedules)-1]; 
}

// =========================================================

function print_calendar ($schedule) {

    # determine start time for day and end time 
    # eh maybe later 
    # statically define start and end times
    $calendar_start = 8; # 8:00 am
    $calendar_end = 20; # 8:00 pm 
    $calendar_length = $calendar_end - $calendar_start;

    # place calendar 

    ?>
        <table id="calendar">
    <?php

    print_calendar_row (-1, -1, "Amy", ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday"]);
    for ($i = 0; $i < $calendar_length; $i++) {
        print_calendar_row ($calendar_start + $i, 0, ($calendar_start + $i) % 12 . ":00");
        print_calendar_row ($calendar_start + $i, 1, ($calendar_start + $i) % 12 . ":15");
        print_calendar_row ($calendar_start + $i, 2, ($calendar_start + $i) % 12 . ":30");
        print_calendar_row ($calendar_start + $i, 3, ($calendar_start + $i) % 12 . ":45");
    }

    ?>
        </table>
    <?php

}


function print_calendar_row ($index, $min_mark, $row_label, $content = ["","","","","","",""]) {
    
    ?>
        <tr>
            <th class="row_head"><?=$row_label?></th>
            <td id="td<?=$index?>_<?=$min_mark?>_0"><?=$content[0]?></td>
            <td id="td<?=$index?>_<?=$min_mark?>_1"><?=$content[1]?></td>
            <td id="td<?=$index?>_<?=$min_mark?>_2"><?=$content[2]?></td>
            <td id="td<?=$index?>_<?=$min_mark?>_3"><?=$content[3]?></td>
            <td id="td<?=$index?>_<?=$min_mark?>_4"><?=$content[4]?></td>
            <td id="td<?=$index?>_<?=$min_mark?>_5"><?=$content[5]?></td>
            <td id="td<?=$index?>_<?=$min_mark?>_6"><?=$content[6]?></td>
        </tr>
    <?php

}


?>

