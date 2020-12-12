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
        <?php print_schedule ($current_schedule) ?>
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

?>

