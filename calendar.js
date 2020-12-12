// My Course Info Website
// By Amy Burnett

// =======================================================================

function setSchedule (schedule) {
    $("#schedule-container").html(getScheduleHTML(schedule));
}

// =======================================================================

function getScheduleHTML (schedule)
{
    var html = `<table id="schedule">
        <tr>
            <th>Color</th>
            <th>Dept</th>
            <th>Course Id</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Days</th>
            <th>Times</th>
            <th>Zoom Url</th>
        </tr>`;
    // add each course
    for (var i = 0 ; i < schedule["courses"].length; ++i) {
        var course = schedule["courses"][i];
        html += 
            `<tr>
                <td>
                    <div style="width:50px;height:50px;background-color: ${course["color"]}"></div>
                </td>
                <td>${course["dept"]}</td>
                <td>${course["course_id"]}</td>`;
        if (course["course_page"] != "") {
            html += `<td><a href="${course["course_page"]}">${course["course_name"]}</a></td>`;
        } else {
            html += `<td>${course["course_name"]}</td>`;
        }
        html += `<td>${course["instructor"]}</td>
            <td>${course["days"]}</td>
            <td>${course["start_time"]}-${course["end_time"]}</td>
            <td><a href="${course["zoom_url"]}">${course["zoom_url"]}</a></td>
        </tr>`;
    }   
    
    html += `</table>`;

    return html;
}

// =======================================================================

// set schedule options
function setScheduleOptions(schedules, current_semester) {
    html = ""
    for (var i = 0; i < schedules.length; ++i) {
        var schedule = schedules[i];
        if (schedule["semester"] == current_semester) {
            html += `<option value="${schedule["semester"]}" selected>${schedule["semester"]}</option>`;
        } else {
            html += `<option value="${schedule["semester"]}">${schedule["semester"]}</option>`;
        }
    }
    $("#semester-select").html(html);
}

// =======================================================================

function setScheduleName (schedule_name) {
    $("#schedule-title").html(schedule_name);
}

// =======================================================================

function setupCalendar () {

    // # determine start time for day and end time 
    // # eh maybe later 
    // # statically define start and end times
    var calendar_start = 8; //# 8:00 am
    var calendar_end = 20;  //# 8:00 pm 
    var calendar_length = calendar_end - calendar_start;

    // # place calendar 
    html = `<table id="calendar">`

    html += get_calendar_row (-1, -1, "Amy", ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday"]);
    for (var i = 0; i < calendar_length; i++) {
        html += get_calendar_row (calendar_start + i, 0, (calendar_start + i) % 12 + ":00");
        html += get_calendar_row (calendar_start + i, 1, (calendar_start + i) % 12 + ":15");
        html += get_calendar_row (calendar_start + i, 2, (calendar_start + i) % 12 + ":30");
        html += get_calendar_row (calendar_start + i, 3, (calendar_start + i) % 12 + ":45");
    }
    html += `</table>`;

    $("#calendar-container").html(html);
}

// =======================================================================

function get_calendar_row (index, min_mark, row_label, content = ["","","","","","",""]) {
    return `
        <tr>
            <th class="row_head">${row_label}</th>
            <td id="td${index}_${min_mark}_0">${content[0]}</td>
            <td id="td${index}_${min_mark}_1">${content[1]}</td>
            <td id="td${index}_${min_mark}_2">${content[2]}</td>
            <td id="td${index}_${min_mark}_3">${content[3]}</td>
            <td id="td${index}_${min_mark}_4">${content[4]}</td>
            <td id="td${index}_${min_mark}_5">${content[5]}</td>
            <td id="td${index}_${min_mark}_6">${content[6]}</td>
        </tr>
    `;

}

// =======================================================================

function getCurrentSchedule (schedules, given_semester) {
    for (var i = 0; i < schedules.length; ++i) {
        if (schedules[i]["semester"] == given_semester) {
            return schedules[i];
        }
    }
    // otherwise return the last schedule
    return schedules[schedules.length-1];
}

// =======================================================================

function fillCalendar (current_schedule) {
    // add courses to calendar 
    // foreach course 
    for (var i = 0; i < current_schedule.courses.length; i++) {
        // parse starting time 
        start_time_str = current_schedule.courses[i]["start_time"]
        start_time = -1;
        if (start_time_str != "" && start_time_str != "TBD") {
            start_time = parseInt(start_time_str.substring(0,2));
            
            // convert to 24 hour time 
            if (start_time_str.endsWith("PM") && start_time != 12) {
                start_time += 12;
            }
            
            // round to the nearest quarter hour 
            minutes = parseInt(start_time_str.substring(3,5));
            // floor to 45 min
            if (minutes > 45) {
                start_time += 0.75;
            }
            // floor to 30 min
            else if (minutes > 30) {
                start_time += 0.5;
            }
            // floor to 15 min
            else if (minutes > 15) {
                start_time += 0.25;
            }
        }

        // parse ending time 
        end_time_str = current_schedule.courses[i]["end_time"];
        end_time = -1;
        if (end_time_str != "" && end_time_str != "TBD") {
            end_time = parseInt(end_time_str.substring(0,2));
            
            // convert to 24 hour time 
            if (end_time_str.endsWith("PM") && end_time != 12) {
                end_time += 12;
            }

            // round to the nearest quarter hour 
            minutes = parseInt(end_time_str.substring(3,5));
            // round to next hour
            if (minutes > 45) {
                end_time += 1;
            }
            // round to 45 min
            else if (minutes > 30) {
                end_time += 0.75;
            }
            // round to 30 min
            else if (minutes > 15) {
                end_time += 0.5;
            }
            // round to 15 min 
            else if (minutes > 0) {
                end_time += 0.25;
            }
        }

        console.log (start_time)
        console.log (end_time)

        // find days for course/event 
        days_str = current_schedule.courses[i]["days"];
        // S,M,T,W,R,F,S
        days = [0,0,0,0,0,0,0];
        has_day = false; 

        for (var j = 0; j < 7; ++j) {
            if (days_str[j] != '-') {
                days[j] = 1;
                has_days = true;
            }
        }

        console.log(days);

        // mark course on calendar if data is present 
        if (start_time != -1 && end_time != -1 && has_days) {
            // "td<start_time>_<index_of_week>"
            // for each hour of the event 
            first = true;
            second = false;
            third = false;
            for (var t = start_time; t < end_time; t+=0.25) {
                for (var k = 0; k < 7; k++) {
                    if (days[k] == 1) {
                        // locate block 
                        var hour = parseInt(t, 10)
                        var minute = t - Math.floor(t)
                        var id = "td" + hour + "_" + (minute * 4) + "_" + k;
                        console.log(id);
                        var block = document.getElementById(id);
                        // color block 
                        block.style.backgroundColor = current_schedule.courses[i].color;
                        if (t < end_time - 0.25)
                            block.style.borderBottomColor = current_schedule.courses[i].color;
                        // put text on first block
                        if (first) {
                            if (current_schedule.courses[i].dept != "")
                                block.innerHTML += current_schedule.courses[i].dept + current_schedule.courses[i].course_id;
                        }
                        if (second) {
                            block.innerHTML += current_schedule.courses[i].course_name;
                        }
                        if (third) {
                            block.innerHTML += current_schedule.courses[i].start_time + " " + current_schedule.courses[i].end_time;
                        }
                    }
                }
                third = false;
                if (second) third = true;
                second = false;
                if (first) second = true;
                first = false;
            }
            
        }


    }
}

// =======================================================================

// setup webpage on load 
window.onload = function () {

    // load data file
    var filename = "courses.json";
    var schedules = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // parse server data and save 
            schedules = JSON.parse(this.responseText);
        }
    };
    // false to process synchronously 
    xmlhttp.open("GET", filename, false);
    xmlhttp.send();

    console.log(schedules);

    var current_schedule = null;

    // get current schedule name from GET parameter
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // if it is provided
    if (urlParams.has("semester")) {
        current_schedule = getCurrentSchedule(schedules, urlParams.get("semester"));
    }
    // no semester provided
    else {
        current_schedule = schedules[schedules.length-1];
    }

    setScheduleName(current_schedule["semester"]);
    setScheduleOptions(schedules, current_schedule["semester"]);
    setupCalendar();
    fillCalendar(current_schedule);
    setSchedule(current_schedule);

}

// =======================================================================

