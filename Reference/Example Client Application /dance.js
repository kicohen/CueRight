
//The audio player
var aid = document.getElementById("audio_player"); 

//Whether or not to record cue on SPACE Bar
var recordCue = true;

//Whether or not the audio is currently playing
var isPlaying = false;

//Key Bindings
var SPACE_BAR = 32; 
var KEY_P = 80;

//Times for all the cues in the file
//Should be created on start and then updated on addCue and Delete Cue
var cue_times = [];

//If the song is paused, it plays the song
//If the song is playing, it pauses the song
//Also changes the button from a play button to a pause button and vice versa
function playSong() {
	console.log("Play Song");
	var playButton = document.getElementById("playButton");
	if(isPlaying){
		playButton.innerHTML = "Play";
		aid.pause();
		isPlaying = false;
	} else {
		playButton.innerHTML = "Pause";
		aid.play();
		isPlaying = true;
	}
}

//Restarts the song by setting the current song time to 0 seconds
function restartSong() {
	aid.currentTime = 0;
}

//Displays the modal for editing dance info
//Also sets the input fields to the current values
function editInfo() {
	//display modal
	var modal = document.getElementById("modal_back");
	modal.setAttribute("style", "z-index: 1;")
	//set input values to current values
	var dance_input = document.getElementById("dance_name_input");
	var dance_name = document.getElementById("dance_name");
	console.log(dance_name.innerHTML);
	dance_input.setAttribute("value",dance_name.innerHTML);
	var choreo_input = document.getElementById("choreographer_input");
	var choreo = document.getElementById("choreographer");
	choreo_input.setAttribute("value",choreo.innerHTML);
	console.log(choreo.innerHTML);
}

//Key Pressed Function
document.body.onkeydown = function(event){
	var playButton = document.getElementById("playButton");

    if(event.keyCode == SPACE_BAR){
    	if(recordCue){
   		    addCue();
   		}
	} 
	else if (event.keyCode == KEY_P) {
		playSong();
	}
}

//Global Variables for Column Numbers and Names
var CUE_NUMBER      = 0;
var CUE_NAME        = 1;
var CUE_TIME        = 2;
var FADE_TIME       = 3;
var TRX_INT         = 4;
var TRX_COLOR       = 5;
var TRX_EFFECT      = 6;
var SIDE_LED_INT    = 7;
var SIDE_LED_COLOR  = 8;
var SIDE_LED_EFFECT = 9;
var TOP_LED_INT     = 10;
var TOP_LED_COLOR   = 11;
var TOP_LED_EFFECT  = 12;
var SHINS           = 13;
var HEAD_HIGHS      = 14;
var S4_PARS         = 15;
var DELETE          = 16;

var columns = [
				"cueNumber",
				"cueName",
				"cueTime",
				"fadeTime",
				"trx_int",
				"trx_color",
				"trx_effect",
				"side_LED_int",
				"side_LED_color",
				"side_LED_effect",
				"top_LED_int",
				"top_LED_color",
				"top_LED_effect",
				"shins",
				"head_highs",
				"s4_pars",
				"delete",
					];


//Gets the absolute cue time for the specified row
function getRowTime(rows, row_number){
	return rows[row_number].getAttribute('data-time');
}

//Adds a cue to the table
function addCue() {
	var table = document.getElementById("cues");

	var time = aid.currentTime;

	var rows = table.getElementsByTagName('tr');
	var number_of_cues = rows.length;

	if (number_of_cues == 0 || getRowTime(rows, number_of_cues-1) < time){
		var row = table.insertRow(-1);	
		// cue_times = [time];
	} else if (getRowTime(rows, 0) > time) {
		var row = table.insertRow(0);
		// cue_times = [time] + cue_times;
	} else {
		var lo = 0;
		var hi = number_of_cues - 1;
		var mid;
		while(lo < (hi-1)){
			mid = lo + Math.floor((hi - lo) / 2);
			if(time < getRowTime(rows, mid)){
				hi = mid;
			} else {
				lo = mid;
			}
		}
		var row = table.insertRow(lo + 1);
		// cue_times = cue_times[0:lo] + [time] + cue_times[lo + 1:-1];

	}
	
	row.setAttribute('data-time',time);
	var cells = [];

	for (var i = 0; i < 17; i++) {
		cells.push(row.insertCell());
		cells[i].className += columns[i];
		cells[i].innerHTML = 0;
	}

	//Default values
	cells[CUE_TIME].innerHTML = time;
	cells[CUE_NAME].innerHTML = "CUE NAME";
	cells[FADE_TIME].innerHTML = 1;
	cells[TRX_EFFECT].innerHTML = "None";
	cells[TOP_LED_EFFECT].innerHTML = "None";
	cells[SIDE_LED_EFFECT].innerHTML = "None";

	var DELETE_HTML = "<button class='delete_button' onclick='deleteRow()'>X</button>"

	cells[DELETE].innerHTML = DELETE_HTML; 
}

//Deletes a row, currently deletes the last row, needs to be updated to delete the selected row 
function deleteRow(){
	var table = document.getElementById("cues");
	//needs to be edited to get the parent and then find the parent in the table and then delete the proper row
	table.deleteRow(-1);
}


//This function once implemented will set the current cues class to active.
//The current cue is the cue that is on at the current time in the music.
function setActive(){
	//remove active from previous cue
	//set current cue to active
}

//writes the table to a csv file and lets the user download it.
function writeTableToCSV(){
	var cuesTable = document.getElementById('cues');
	var rows = cuesTable.getElementsByTagName('tr');
	var number_of_cues = rows.length;
	var cues = '';
	for (var i = 0; i < number_of_cues; i++) {
		for (var j = 0; j < (columns.length - 1); j++) {
			cues += rows[i].cells[j].innerHTML;
			cues += ',';
		}
		cues += '\n';
	}

	var textFile = null,
	  makeTextFile = function (text) {
	    var data = new Blob([text], {type: 'text/plain'});

	    // If we are replacing a previously generated file we need to
	    // manually revoke the object URL to avoid memory leaks.
	    if (textFile !== null) {
	      window.URL.revokeObjectURL(textFile);
	    }

	    textFile = window.URL.createObjectURL(data);

	    // returns a URL you can use as a href
	    return textFile;
	  };

	//creates a fake link and then clicks on it to download the file

	var dance_name = document.getElementById("dance_name").innerHTML.toLowerCase();

	var link = document.createElement('a');
    link.setAttribute('download', "ds_cues_"+dance_name+".csv");
    link.href = makeTextFile(cues);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
}

