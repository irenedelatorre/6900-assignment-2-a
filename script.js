console.log('Homework 2-A...')

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    console.log(rows);

    var trips = crossfilter(rows);


    //TODO total number of trips in 2012
    start2012 = new Date ('January 01, 2012 00:00:00');
    //console.log(start2012);
    end2012 = new Date ('December 31, 2012 23:59:59');
    var tripsByYear = trips.dimension(function(rows){return rows.startTime});
    trips2012 = tripsByYear.filter([start2012,end2012]).top(Infinity);
    console.log("total number of trips in 2012", trips2012.length);

    //TODO total number of trips in 2012 AND taken by male, registered users
    var tripsByGender = trips.dimension(function(rows){return rows.gender});
    tripsMale = tripsByGender.filter("Male").top(Infinity);

    var tripsBySubsc = trips.dimension(function(rows){return rows.subsc});
    tripsMaleSuscr = tripsBySubsc.filter("Registered").top(Infinity);
    console.log("total number of trips in 2012 AND taken by male, registered users", tripsMaleSuscr.length);

    //TODO total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5)
    tripsBySubsc.filterAll();
    tripsByGender.filterAll();
    var tripsByStation = trips.dimension(function(rows){return rows.startStation});
    tripsID5 = tripsByStation.filter("5").top(Infinity);
    console.log("total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5)", tripsID5.length);

    //TODO top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration
    tripsByStation.filterAll();
    tripsByYear.filterAll();
    var tripsByDuration = trips.dimension(function(rows){return rows.duration});
    trips50 = tripsByDuration.filterAll().top(50);

    console.log("top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration", trips50);

    tripsByDuration.filterAll();

    //TODO By creating a group on the right dimension, group all trips into 10-year age buckets i.e. trips by users between 20 and 29, 30 and 39 etc. Console log these groups using group.all()

    var tripsByAge = trips.dimension(function(rows){return rows.age});
    var tripsByAgeGroups = tripsByAge.group(function(d){return Math.floor(d/10)});

    var ages = tripsByAgeGroups.all();
    console.log("trips by users between 20 and 29, 30 and 39...", ages)
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        gender: d.gender,
        subsc: d.subsc_type,
        age: (2016 - (d.birth_date)),
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}
