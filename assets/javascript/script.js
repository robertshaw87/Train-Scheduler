// Initialize Firebase
var config = {
    apiKey: "AIzaSyBL5FgKAKReznc0iGXqhPzDHMAqi6StlzI",
    authDomain: "train-scheduler-9a6e8.firebaseapp.com",
    databaseURL: "https://train-scheduler-9a6e8.firebaseio.com",
    projectId: "train-scheduler-9a6e8",
    storageBucket: "train-scheduler-9a6e8.appspot.com",
    messagingSenderId: "438905285841"
};

firebase.initializeApp(config);
var database = firebase.database();


$(document).on("click", "#submit-train", function(event){

    event.preventDefault();

    var name = $("#train-name").val().trim();
    var destination = $("#train-destination").val().trim();
    var startTime = $("#train-start").val().trim();
    var frequency = $("#train-frequency").val().trim();

    var trainEntry = {};
    trainEntry["name"] = name;
    trainEntry["destination"] = destination;
    trainEntry["startTime"] = startTime;
    trainEntry["frequency"] = frequency;
    trainEntry["addDate"] = firebase.database.ServerValue.TIMESTAMP

    database.ref().push(trainEntry);

});

database.ref().orderByChild("addDate").on("child_added", function(snapshot){
    var sv = snapshot.val()
    console.log(sv);
    var name = sv.name;
    var destination = sv.destination;
    var startTime = sv.startTime;
    var frequency = sv.frequency;
    var nextArrival = startTime;
    var currTime = moment().format("HH:mm");
    var minutesAway = moment(nextArrival, "HH:mm").diff(moment(currTime, "HH:mm"), "minutes");
    while (minutesAway < 0) {
        nextArrival = moment(nextArrival, "HH:mm").add(frequency, "minutes");
        nextArrival = moment(nextArrival).format("HH:mm")
        minutesAway = moment(nextArrival, "HH:mm").diff(moment(currTime, "HH:mm"), "minutes");
    }


    var currRow = $("<tr>")
    currRow.append($("<td>").text(name));
    currRow.append($("<td>").text(destination));
    currRow.append($("<td>").text(frequency));
    currRow.append($("<td>").text(nextArrival));
    currRow.append($("<td>").text(minutesAway));

    $("#data-display").append(currRow);
    
});