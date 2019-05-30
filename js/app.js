var SENIOR_CLASS = "13";
var color_list=['#CCCCCC','#FFC312','#009432','#EE5A24','#0652DD'];
var graph = {};
var courseObjList = {};
var enrollment = {};
var numColors = 1;
var temp;

function processing() {
    document.getElementById("loader-container").style.display = "block";
    document.getElementById("main-page").style.display = "none";
}

function showPage() {
  document.getElementById("loader-container").style.display = "none";
  document.getElementById("main-page").style.display = "block";
  createGraph();
}

function readFiles(ev) {
    contentArray = [];
    // Retrieve all the files from the FileList object
    var files = ev.target.files;
    length = ev.target.files.length;
    if (length!=0) {
        processing();
        for (var i = 0, f; f = files[i]; i++) {
            //console.log(f.name);
            var reader = new FileReader();
            reader.onload = (function (f, i) {
              return function (e) {
                var contents = e.target.result;
                //console.log(contents);
                contentArray.push(contents);
                if(contentArray.length==length){
                  readAllTxt(contentArray);
                  //console.log("here")
                };
              };
            })(f, i);
            reader.readAsText(f);
        }
        ev.target.nextElementSibling.nextElementSibling.innerHTML=ev.target.files.length.toString()+" file(s) selected";
    } else {
        alert("No files loaded");
    }
}

// returns a list of course names and a list of student ID's
function readTxt(file) {
	lines = file.trim().split("\n");
	labels = lines[0].trim().split("\t");

	for (var i = 0; i < labels.length; i++){
    if (labels[i].includes("PIDM")){
      id = i;
		}
    else if (labels[i].includes("CLAS_CODE")) {
      cy = i;
    }
    else if (labels[i].includes("CRN_KEY")) {
      crn = i;
    }
    else if (labels[i].includes("SECTION")) {
      sec = i;
    }
    else if (labels[i].includes("SUB")){
      sub = i;
		}
    else if (labels[i].includes("COURSE")){
      num = i;
		}
	}

  // Reading the first record
	var rec = lines[1].trim().split('\t');

  // flag = True if there is a senior in the course
  var flag = false;
  var studentList = [];
  studentList.push(rec[id]);

  if (rec[cy]==SENIOR_CLASS){
    flag = true;
  }

  var name = rec[sub]+' '+rec[num];
  var conflict = new Object;

	if (lines.length < 3){
    return {'crn':rec[crn], 'sub':rec[sub], 'num':rec[num], 'name': name, 'studentList': studentList, 'hasSenior':flag, 'conflict': conflict, 'section':sec};
	}

  for (var k = 2; k < lines.length; k++){
      rec = lines[k].trim().split('\t')
      studentList.push(rec[id])

      if (rec[cy]==SENIOR_CLASS){
        flag = true;
      }
	}
  return {'crn':rec[crn], 'sub':rec[sub], 'num':rec[num], 'name': name, 'studentList': studentList, 'hasSenior':flag, 'conflict': conflict, 'section':sec};

}

function readAllTxt(array){
	//var enrollment = []
	for (var i = 0, f; f=array[i]; i++){
    var result = readTxt(f);
    var name = result['name']
    var section = result['section']

    // Adding studentList to the enrollment dictionary
    enrollment[name] = result['studentList'];

    // Adding a new coourse object to the courseObjList
    courseObjList[name] = result;
	}
  setTimeout(function(){ showPage(); }, 500);
}


/*
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
function htmlToElements(html) {
    var template = document.createElement('template');
	html = html.trim(); 
    template.innerHTML = html;
    return template.content.childNodes;
}

/*
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function addTime(){
  var numSlots = document.getElementsByClassName('time').length;
  // Adding a single time slot card

	var rows = document.getElementsByClassName("time-row");
  for (var k = 0; k<rows.length; k++) {
		row2 = rows[k].childNodes[1];
		row3 = rows[k].childNodes[2];
    if ((row2==undefined) || (row3==undefined)){
      contents ='<div class="col-sm-4">'+
                  '<div class="card time" id="slot'+(numSlots+1).toString()+'">'+
                    '<div class="card-body">'+
                      '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>New Time</h5>'+
                      '<p style="text-align:right; margin-top:-20px"><span onclick="deleteTime(this)" class="fa fa-times"></span></p>'+
                      '<div class="dropzone"></div>'+
                    '</div>'+
                  '</div>'+
                '</div>';
      timeslot = htmlToElement(contents);
      rows[k].appendChild(timeslot);
      timeEventHandler(timeslot);
      temp = timeslot;
      return;
    }
  }
  // Adding a new row with a time slot card
    contents ='<div class="row time-row extra-time">'+
                '<div class="col-sm-4">'+
                  '<div class="card time" id="slot'+(numSlots+1).toString()+'">'+
                    '<div class="card-body">'+
                      '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>New Time</h5>'+
                      '<p style="text-align:right; margin-top:-20px"><span onclick="deleteTime(this)" class="fa fa-times"></span></p>'+
                      '<div class="dropzone"></div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>';
    timeslot = htmlToElement(contents);
    document.getElementById('time-slot-container').appendChild(timeslot);
    timeEventHandler(timeslot.childNodes[0]);
}

function addTime2(id, time, a){
	var rows = document.getElementsByClassName("time-row");
    for (var k = 0; k<rows.length; k++) {
  		row2=rows[k].childNodes[1];
  		row3=rows[k].childNodes[2];
      if ((row2==undefined) || (row3==undefined)){
        contents ='<div class="col-sm-4">'+
                    '<div class="card time" id="'+id+'">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>'+time+'</h5>'+
                        '<p style="text-align:right; margin-top:-20px"><span onclick="deleteTime(this)" class="fa fa-times"></span></p>'+
                        '<div class="dropzone"></div>'+
                      '</div>'+
                    '</div>'+
                  '</div>';
        var timeslot = htmlToElement(contents);
        rows[k].appendChild(timeslot);
        timeEventHandler(timeslot);
        var cards = createCourseCards(a);
        addToContainer(cards, timeslot.childNodes[0].childNodes[0].childNodes[2]);
        return true;
      }
    }
  // Adding a new row with a time slot card
    contents ='<div class="row time-row extra-time">'+
                '<div class="col-sm-4">'+
                  '<div class="card time" id="'+id+'">'+
                    '<div class="card-body">'+
                      '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>'+time+'</h5>'+
                      '<p style="text-align:right; margin-top:-20px"><span onclick="deleteTime(this)" class="fa fa-times"></span></p>'+
                      '<div class="dropzone"></div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>';
    var timeslot = htmlToElement(contents);
    document.getElementById('time-slot-container').appendChild(timeslot);
    timeEventHandler(timeslot.childNodes[0]);
    var cards = createCourseCards(a);
    addToContainer(cards, timeslot.childNodes[0].childNodes[0].childNodes[0].childNodes[2]);
}

function deleteTime(deleteBtn){
  courses = deleteBtn.parentNode.nextElementSibling.childNodes
  for (var i=(courses.length-1), c; c=courses[i]; i--){
    document.getElementById('course-list').appendChild(c)
  }
  col = deleteBtn.parentNode.parentNode.parentNode.parentNode;
  row = col.parentNode;
  row.removeChild(col);
  if (row.childNodes.length==0){
    row.parentNode.removeChild(row);
	  return
  }
	shuffleBack(row)
}

function shuffleBack(row){
	nextRow=row.nextElementSibling
	if ((nextRow==null) || (row.childNodes[2]!=undefined)){
		return
	}
	for (var k = 0; k<nextRow.childNodes.length; k++) {
		if(nextRow.childNodes[k]!=undefined){
			row.appendChild(nextRow.childNodes[k])
			if (nextRow.childNodes.length==0){
    			nextRow.parentNode.removeChild(nextRow);
  			}
			else{
				shuffleBack(row)
				shuffleBack(nextRow)
			}
		}
			break
	}
}

function createCourseCards(a){
  var cards = [];
  if (Object.keys(courseObjList).length > 0){
    for (var k=0, el; el = a[k]; k++) {
      var rec = courseObjList[el];
      contents ='<div class="card course" id="'+rec['name']+'">'+
              '<div class="card-body">'+
                '<p class="card-text">'+rec['name']+'</p>'+
              '</div>'+
            '</div>';
      card = htmlToElement(contents)
      if (document.getElementById(rec['name'])){
        console.log('Course has already been added');
      }
      else{
        //document.getElementById('course-list').appendChild(card)
        card.setAttribute('draggable', true);
        var i = parseInt(rec['color']);
        card.style.backgroundColor=color_list[i];
        //events fired on the draggable target
        card.addEventListener("dragstart", function( ev ) {
          //console.log(ev.target.id);
          ev.dataTransfer.setData("text", ev.target.id);
          checkConflicts(ev.target.id);
        }, false);
        cards.push(card);
      }
    }
  }
  return cards;
}

function createCourses(){
  var a = [];
  var tem = schedule(createBlocks);
  var coloring = tem[0];
  var free = tem[1];
  for (var el in coloring) {
    var courses = coloring[el];
    for (var i=0, c_name; c_name=courses[i]; i++) {
      a.push(c_name);
      courseObjList[c_name]['color'] = el;
    }
  }
  for (var i=0, c_name; c_name=free[i]; i++) {
    a.push(c_name);
    courseObjList[c_name]['color'] = 0;
  }
  var cards = createCourseCards(a);
  addToContainer(cards, document.getElementById('course-list'));
}

function addToContainer(a, container){
  for (var i=0, card; card = a[i]; i++) {
    container.appendChild(card)
  }
}

function graphToList(graph) {
  var result = [];
  for (var el in graph) {
    result.push([el,graph[el]]);
  }
  return result
}

function Welsh_Powell(graph) {
  var graph_list = graphToList(graph);
  // sort the list by descending degree
  graph_list.sort(function(a, b){return b[1].length - a[1].length});
  // get the set of vertices in order
  var V = []
  for (var i=0, el; el=graph_list[i]; i++) {
    V.push(el[0]);
  }
  // initiate result coloring dict, with vertices as keys
  coloring = {}
  // traverse the list and color the graphics
  for (var i=0, v; v=V[i]; i++){
    // if the vertex has not been colored
    if (typeof coloring[v] == "undefined") {
      // assign the first available color
      coloring[v] = numColors;
      // increment the count of colors
      numColors++;
      // traverse the list V and assign the same colors to non-neighbors of v
      for (var k=i+1, v_prime; v_prime=V[k]; k++) {
        if ((typeof coloring[v_prime] == "undefined") && !(graph[v].includes(v_prime))) {
          // check if any neighbor of v_prime is of the same color as v
          // assume there is none (which means we could still color v_prime the same as v)
          var flag = false;
          // get all neighbors of v_prime
          var neighbors = graph[v_prime];
          // if a neighbor of v_prime has the same color as v, flag = True
          for (var g=0, n; n=neighbors[g]; g++){
            if ((typeof coloring[n] != "undefined") && (coloring[n]==coloring[v])) {
              flag = true;
            }
          }
          // if v_prime doesn't have any neighbor of the same color as v
          // color v_prime as v
          if ( flag==false ){
            coloring[v_prime] = coloring[v];
          }
        }
      }
    }
  }
  //console.log(coloring);
  return coloring;
}

function schedule(cb){
  graphCopy = {};
  var free = [];
  var V = Object.keys(graph);
  for (var i=0, v; v=V[i]; i++){
    graphCopy[v] = graph[v];
    if(graph[v].length==0) {
      free.push(v);
      delete graph[v];
    }
  }
  coloring = Welsh_Powell(graph);
  //console.log(coloring, free);
  //callback function = createBlock
  var blocks = cb(coloring);
  console.log("Blocks: ", blocks)
  return [blocks, free];
}

function createBlocks(coloring){
  // console.log('coloring: ',coloring)
  // if there is no conflicts
  if (Object.keys(coloring).length == 0){
    dict = {};
    return dict;
  }
  else {
    coloring_list = graphToList(coloring);
    coloring_list.sort(function(a, b){return a[1] - b[1]});
    //console.log(coloring_list);
    dict = {};
    c = coloring_list[0][1];
    for (var i=0, el; el = coloring_list[i]; i++){
      if (el[1] != c){
        c = el[1];
      }
      if (typeof dict[c] == "undefined"){
        dict[c] = [];
      }
      dict[c].push(el[0])
    }
	//console.log (dict)
    return dict;
  }
}

function keysToList(dict) {
  var result=[];
  for (var el in dict){
    result.push(el);
  }
  return result;
}

function createGraph(){
  if (Object.keys(graph).length==0){
    courses = keysToList(enrollment);
    //console.log(courses);

    for (var i=0; i<(courses.length); i++){
      graph[courses[i]]=[];
    }
    for (var i=0; i<(courses.length-1); i++){
      for (var k=i+1; k<courses.length; k++){
        c1 = courses[i];
        c2 = courses[k]
        for (var i1=0, s1; s1=enrollment[c1][i1]; i1++){
          for (var i2=0, s2; s2=enrollment[c2][i2]; i2++){
            if ((s1==s2) && (!(graph[c1].includes(c2)))){
              graph[c1].push(c2);
              graph[c2].push(c1);

              courseObjList[c1]['conflict'][c2]=[];
              courseObjList[c1]['conflict'][c2].push(s1);
              courseObjList[c2]['conflict'][c1]=[];
              courseObjList[c2]['conflict'][c1].push(s1);
            }
            else if ((s1==s2) && (graph[c1].includes(c2))){
              courseObjList[c1]['conflict'][c2].push(s1);
              courseObjList[c2]['conflict'][c1].push(s1);
            }
          }
        }
      }
    }
    console.log('graph: ',graph);
    createCourses()
  }
  else{
    alert('Error, graph is not empty')
  }
}

function checkConflicts(course){
  // conflicts is a list of courses that conflict with course
  if (typeof graph[course]!= "undefined"){
    var conflicts = graph[course];
    //console.log(conflicts)
    for (var i = 0, c; c = conflicts[i]; i++){
      container = document.getElementById(c).parentNode.parentNode.parentNode;
      //console.log(container.classList);
      if (container.classList.contains("time")){
        container.style.boxShadow="0 0 5px #FF0000";
      }
    }
  }
}

function timeEventHandler(t){
  // events fired on the drop targets
  t.addEventListener("dragover", function( ev ) {
    // prevent default to allow drop
    ev.preventDefault();
  }, false);
  t.addEventListener("dragenter", function( ev ) {
    // highlight potential drop target when the draggable element enters it
    if (ev.target.className=="dropzone"){
      if (ev.target.parentNode.parentNode.style.boxShadow==""){
        ev.target.parentNode.style.boxShadow="0 0 5px #0000FF";
      }
    }
  }, false);
  t.addEventListener("dragleave", function( ev ) {
    // reset background of potential drop target when the draggable element leaves it 
	  if (ev.target.parentNode.style.boxShadow!='rgb(255, 0, 0) 0px 0px 5px'){
    ev.target.parentNode.style.boxShadow="";
	  }
  }, false);
  t.addEventListener("dragend", function( ev ) {
    var slots = document.getElementsByClassName("dropzone");
    for (var k = 0, t; t = slots[k]; k++) {
      t.parentNode.style.boxShadow="";
      t.parentNode.parentNode.style.boxShadow="";
    }
  }, false);
  t.addEventListener("drop", function( ev ) {
    // prevent default action (open as link for some elements)
    ev.preventDefault();
    // move dragged elem to the selected drop target           
    var data = ev.dataTransfer.getData("text");
    var flag = true;
    if(ev.target.className!="dropzone"){
      flag = false;
    }
    if (typeof graph[data] != "undefined"){
      var conflicts = graph[data];
      for (var i = 0, c; c = conflicts[i]; i++){
        container = document.getElementById(c).parentNode;
        //console.log('container: ',container)
        if (container == ev.target && container.id != "course-list"){
          flag = false;
        }
      }
    }
    if(flag) {
      ev.target.appendChild(document.getElementById(data));
    }
  }, false)
}

function download(fname, format, text){
  var element = document.createElement('a');
  element.setAttribute("href", "data:text/"+format+";charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", fname);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function exportToWeb() {
  var scheduleOut = {};
  var slots = document.getElementsByClassName("time");
  for (var i = 0, t; t = slots[i]; i++) {
    var id = t.id;
    if (i<6){
      var label=t.childNodes[1].childNodes[1].innerHTML;
      var courses=t.childNodes[1].childNodes[3].childNodes;
    }
    else{
      var label=t.childNodes[0].childNodes[0].innerHTML;
      var courses=t.childNodes[0].childNodes[2].childNodes;
    }

    var tem=label.trim().split(">");
    var time=tem[2];

    scheduleOut[id] = {};
    scheduleOut[id]["time"]=time;
    scheduleOut[id]["courses"]=[];

    if (courses.length>0){
      for (var k = 0; k<(courses.length); k++){
        scheduleOut[id]["courses"].push(courses[k].id)
      }
    }
  }
  console.log(scheduleOut);

  var scheduleHTML = "";
  for (var el in scheduleOut) {
    var slot = scheduleOut[el];
    var time = slot["time"];
    var courses = slot["courses"];

    scheduleHTML += "<h2>"+time+"</h2>";
    for (var i=0, c; c=courses[i]; i++) {
      scheduleHTML += "<p>"+c+"</p>";
    }
  }

  var w = window.open("");
  var content = "<html>"+
                  "<head>"+
                    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">'+
                    "<title>Schedule</title>"+
                  "</head>"+
                  "<body>"+
                    '<div class="container">'+
                        scheduleHTML+
                  "</body>"+
                "</html>";
  w.document.writeln(content);
}

function reset(ev){
	graph = {};
	courseObjList = {};
	enrollment = {};
	numColors = 1;
	
	courses = document.getElementById('course-list');
	
	while (courses.firstChild) {
    courses.removeChild(courses.firstChild);
	}
	timeSlots = document.getElementById("time-slot-container");
	
	while (timeSlots.firstChild) {
    timeSlots.removeChild(timeSlots.firstChild);
	}
	
	content= '<div class="row time-row">'+
                  '<div class="col-sm-4">' +
                   '<div class="card time" id="slot1">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>Time 1</h5> '+
                       ' <div class="dropzone"></div>'+
                     ' </div>'+
                    '</div>'+
                 ' </div>'+

                  '<div class="col-sm-4">' +
                   '<div class="card time" id="slot2">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>Time 2</h5> '+
                       ' <div class="dropzone"></div>'+
                     ' </div>'+
                    '</div>'+
                 ' </div>'+

                  '<div class="col-sm-4">' +
                   '<div class="card time" id="slot3">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>Time 3</h5> '+
                       ' <div class="dropzone"></div>'+
                     ' </div>'+
                    '</div>'+
                 ' </div>'+
			' </div>'+

              '<div class="row time-row">'+
                  '<div class="col-sm-4">' +
                   '<div class="card time" id="slot4">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>Time 4</h5> '+
                       ' <div class="dropzone"></div>'+
                     ' </div>'+
                    '</div>'+
                 ' </div>'+

                  '<div class="col-sm-4">' +
                   '<div class="card time" id="slot5">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>Time 5</h5> '+
                       ' <div class="dropzone"></div>'+
                     ' </div>'+
                    '</div>'+
                 ' </div>'+

                  '<div class="col-sm-4">' +
                   '<div class="card time" id="slot6">'+
                      '<div class="card-body">'+
                        '<h5 class="card-title time-name" contenteditable="true"><span class="fa fa-edit" contenteditable="false"></span>Time 6</h5> '+
                       ' <div class="dropzone"></div>'+
                     ' </div>'+
                    '</div>'+
                 ' </div>'+
			' </div>'
	
	Schedule = htmlToElements(content);
	console.log(Schedule)
	var count = 0;
	var i;

	for (i in Schedule) {
		if (Schedule.hasOwnProperty(i)) {
			count++;
		}
	}
	
	for (var i=0; i<count; i++){
		currentRow = Schedule[0]
		timeSlots.appendChild(currentRow);
		console.log(currentRow.children.length)
		for (var f=0; f<currentRow.children.length; f++){
			console.log(currentRow.children[f])
			timeEventHandler(currentRow.children[f])
		}
	}
	readFiles(ev)
	}

function outputSchedule(){
	var outputGraph={};
	var slots = document.getElementsByClassName("time");
    for (var k = 0, t; t = slots[k]; k++) {
      var id = t.id;
  		if (k<6){
  			rawtext=t.childNodes[1].childNodes[1].innerHTML;
  			classes=t.childNodes[1].childNodes[3].childNodes;
  		}
  		else{
  			rawtext=t.childNodes[0].childNodes[0].innerHTML;
  			classes=t.childNodes[0].childNodes[2].childNodes;
  		}
  		splittext=rawtext.trim().split(">");
  		text=splittext[2]
  		outputGraph[id]["time"]=text;
      outputGraph[id]["courses"]=[];

  		if (classes.length>0){
  			for (var i = 0; i<(classes.length); i++){
  			outputGraph[id]["courses"].push(classes[i].id)
  			}
  		}
    }
  console.log(outputGraph);
  var outputTxt=''
  for (el in outputGraph){
    for (ele in outputGraph[el]){
      if (ele==0){
        outputTxt+='\n \r'+outputGraph[el][ele]+':\n \r'
      }
      else{
      outputTxt+=outputGraph[el][ele]+'\n \r'
    }
    }

  }
  console.log(outputTxt)
	fname = 'Schedule'+'.txt';
 format = "plain";
 download(fname, format, outputTxt);
}

function save() {
  var timeObjList = {};
  var slots = document.getElementsByClassName("time");
  for (var i = 0, t; t = slots[i]; i++) {
    var id = t.id;
    if (i<6){
      var label=t.childNodes[1].childNodes[1].innerText;
      var courses=t.childNodes[1].childNodes[3].childNodes;
    }
    else{
      var label=t.childNodes[0].childNodes[0].innerText;
      var courses=t.childNodes[0].childNodes[2].childNodes;
    }

    timeObjList[id] = {};
    timeObjList[id]["time"]=label;
    timeObjList[id]["courses"]=[];

    if (courses.length>0){
      for (var k = 0; k<(courses.length); k++){
        timeObjList[id]["courses"].push(courses[k].id)
      }
    }
  }

  timeObjList["not-scheduled"] = [];
  var container = document.getElementById('course-list');
  var courses = container.childNodes;
  if (courses.length>1){
    for (var k=1; k<(courses.length); k++){
      timeObjList["not-scheduled"].push(courses[k].innerText.trim());
    }
  }

  var date = new Date();
  var y = date.getFullYear();
      m = date.getMonth();
      d = date.getDate();
      h = date.getHours();
      min = date.getMinutes();
      fname = m+'-'+d+'-'+y+'--'+h+'-'+min+'.json';
      format = "json";
  var content = {courseObjList, timeObjList};
  download(fname, format, JSON.stringify(content, null, '\t'));
}

function load(ev){
  // Retrieve all the files from the FileList object
  var f = ev.target.files[0];
  console.log("f:", f);
  var reader = new FileReader();
  reader.onload = (function (file) {
    return function (e) {
      var json = JSON.parse(e.target.result);
      console.log(json);
      buildPage(json);
  	}
  })(f);
  reader.readAsText(f);
}

function buildPage(json){
  document.getElementById('course-list').innerHTML="";
  document.getElementById('time-slot-container').innerHTML="";
  courseObjList = json["courseObjList"];
  var cards = createCourseCards(json['timeObjList']['not-scheduled']);
  addToContainer(cards, document.getElementById('course-list'));
  var timeObjList = json['timeObjList'];
  for (var el in timeObjList) {
    if (el != 'not-scheduled'){
      addTime2(el, timeObjList[el]['time'], timeObjList[el]['courses']);
    }
  }
}


window.onload = function(){
  // $(function () {
  //   $('[data-toggle="popover"]').popover()
  // })


  document.getElementById('export-btn').addEventListener('click', outputSchedule, false);
  document.getElementById("save-btn").addEventListener("click", save, false);
  document.getElementById("load-btn").addEventListener("change", load, false);
  document.getElementById('upload').addEventListener('change', reset, false);
  document.getElementById('add-time-btn').addEventListener('click', addTime, false);
  document.getElementById('course-list').addEventListener('DOMNodeInserted',
                      function(){
                        //console.log(this.childNodes);
                        document.getElementById('num-course').innerHTML = (this.childNodes.length-1).toString()+' course(s) to be scheduled';
                      }, false);
  document.getElementById('course-list').addEventListener('DOMNodeRemoved',
                      function(){
                        //console.log(this.childNodes);
                        document.getElementById('num-course').innerHTML = (this.childNodes.length-2).toString()+' course(s) to be scheduled';
                        }, false);

  var slots = document.getElementsByClassName("dropzone");
  for (var k = 0, t; t = slots[k]; k++) {
    timeEventHandler(t);
  }
}
