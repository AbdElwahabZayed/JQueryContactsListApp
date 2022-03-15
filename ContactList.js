/**
 * Created with JetBrains WebStorm.
 * User: alistair
 * Date: 26/07/2013
 * Time: 19:56
 * To change this template use File | Settings | File Templates.
 */

/**
 * This stores the displayName part of the current entry so that when we move from
 * the list page to the entry page, we keep track of which entry to display...
 * @type {string}
 */
var currentEntry = "";

/**
 * Here is the standard $(document).ready() call-back.  This is essentially the 'initialize' function
 * since it is called only when the entire DOM document has been loaded into the browser.
 * This is a very good place to set up things like event handlers for user interactions, since we
 * have a guarantee that the object the event handlers refer to are part of the DOM now.
 */
$(document).ready(function() {
    // Run the start-up routine, which, in this case, loads the current list of entries from
    // local storage and displays them on the main (list) page...
    init();

    // Now install the event handlers for buttons the user can click or tap on.
    // 1. The "Add" button (for adding a new entry)...
    $("#add").click(function() {
        currentEntry = "";
        var e = new Entry();    // An empty one.
        displayEntry(e);
		$("#addContactHeader").text("New Contact");
		$("#update").text("save");
    });    
	


    // 2. The "Del" button, for deleting an entry...
    $("#delete").click(function() {
        if(currentEntry !== ""){
            removeEntry(currentEntry);
            currentEntry = "";
            displayEntryList("#list");
            saveList();
        }
    });

    $("#edit").click(function(){
		$("#addContactHeader").text("Edit Contact");
		$("#update").text("update");
        //	currentEntry = $(this).text();                  // The text in the <a> element, which is an Entry's displayName()
        var e = getEntryFromDisplayName(currentEntry);
        displayEntry(e);
    })

    // 3. The "Update" button, for updating an entry's details...
    $("#update").click(function() {
        if(currentEntry === ""){
            addNewEntry();
        } else {
            updateEntry();
        }
        displayEntryList("#list");
        // Whenever anything is changed, save the whole list...
        saveList();
    });

});

// This selector applies to all <a> elements inside the <ul> with the id "list".
// $(this) is a jQuery object referencing the actual <a> element that was clicked on.
$(document).on('click', "#list li", function() {
	
    currentEntry = entries[$(this).index()].name;                // The text in the <a> element, which is an Entry's displayName()
    //console.log("fffffffffffffffff"+currentEntry);
	//var e = getEntryFromDisplayName(currentEntry);  // This get a reference to the actual Entry
    displayEntryDetails(entries[$(this).index()]);                                                           // This puts it into the form on the 'entry' page
});

// This gets call when the app is first loaded...
function init(){
    loadList();
    displayEntryList("#list");
}

/**
 * This lets us make a new entry object.
 * @param name - the person's name
 * @param mobile - their mobile number
 * @param home - their home number
 * @param email - their email address
 * @param gender - their date of birth (in string format)
 * @constructor
 */
var Entry = function(name, mobile, email, gender) {
    this.name = name;
    this.mobile = mobile;
    this.email = email;
    this.gender = gender;
}
var entries = [];		// Start with a simple array

function addEntry(name, mobile, email, gender) {
    var e = new Entry(name, mobile, email, gender);
    entries.push(e);
    sortEntries();
    return e;
}
function removeEntry(name){
    var pos = -1, index, entry = null;
    for(index = 0; index < entries.length; index += 1){
        if(name === entries[index].name) {
            pos = index;
            break;
        }
    }
    if(pos > -1) {
        entry = entries[pos];
        entries.splice(pos, 1);
    }
    return entry;
}
function sortEntries() {
    entries.sort(function(a, b) {
        if(a.name < b.name){
            return -1;
        }
        if(a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return entries;
}
function entryList(){
    var index, list = "";
    for(index = 0; index < entries.length; index += 1){
	list += `<li>
                        <a href="#contactDetails" >
                            <img src="contact.jpg" style="background-color:transparent; border-radius: 50%; padding-left: 10px; padding-top: 3px; height: 90%;" >
                            <h1>${entries[index].name}</h1>
                            <p> ${entries[index].email} </p>
                        </a>
                        <a href="tel:${entries[index].mobile}" class="ui-icon-phone" style="background-color: #43d1af; width: 75px; border-top-left-radius:25%; border-bottom-left-radius: 25%;">
                        </a>
                    </li>
		`
	}
    return list;
}
function displayEntryList(listElement){
    $(listElement).html(entryList()).listview('refresh');
    return $(listElement);
}

function getEntryFromDisplayName(displayName){
    var index, e;
    for(index = 0; index < entries.length; index += 1){
        if(entries[index].name === displayName){
            return entries[index];
        }
    }
    return null;
}

function displayEntry(e){
    $("#fullname").val(e.name);
    $("#mobile").val(e.mobile);
    $("#email").val(e.email);
    $("#gender").val(e.gender);
    $("#name").text(e.name);
}

function displayEntryDetails(e)
{
	$("#contactName").html(""+e.name );
    $("#telephone").attr("href", "tel:"+ e.mobile);
}
function updateEntry(){
    var e = getEntryFromDisplayName(currentEntry);
    e.name = $("#fullname").val();
    e.mobile = $("#mobile").val();
    e.email = $("#email").val();
    e.gender = $("#flip2").val();
}
function addNewEntry(){
    var name = $("#fullname").val(),
        mobile = $("#mobile").val(),
        email = $("#email").val(),
        gender = $("#flip2").val();
    if(name !== "") {
        return addEntry(name, mobile, email, gender);
    } else {
        return null;
    }
}
function saveList(){
    var strList = JSON.stringify(entries);
    localStorage.phoneBook = strList;
}
function loadList(){
    var strList;
    strList = localStorage.phoneBook;
    if(strList){
        entries = JSON.parse(strList);
        var proto = new Entry();
        for(e in entries){
            entries[e].__proto__ = proto;
        }
    } else {
        entries = [];
    }
}