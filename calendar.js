// My Course Info Website
// By Amy Burnett

window.onload = function () {

    // add courses to calendar 
    // foreach course 
    for (var i = 0; i < data.courses.length; i++) {


        // parse starting time 
        start_time_str = data.courses[i].start_time
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
        end_time_str = data.courses[i].end_time;
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
        days_str = data.courses[i].days;
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
                        block.style.backgroundColor = data.courses[i].color;
                        if (t < end_time - 0.25)
                            block.style.borderBottomColor = data.courses[i].color;
                        // put text on first block
                        if (first) {
                            if (data.courses[i].dept != "")
                                block.innerHTML += data.courses[i].dept + data.courses[i].course_id;
                        }
                        if (second) {
                            block.innerHTML += data.courses[i].course_name;
                        }
                        if (third) {
                            block.innerHTML += data.courses[i].start_time + " " + data.courses[i].end_time;
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