var selectedContact = "";
$(document).ready(function () {
    init();
    $("#add").click(function () {
        selectedContact = "";
        var e = new Contact();    // An empty one.
        displayContact(e);
        $("#addContactHeader").text("New Contact");
        $("#update").text("Save");
    });

    $("#delete").click(function () {
        if (selectedContact !== "") {
            removeContact(selectedContact);
            selectedContact = "";
            displayContactList("#list");
            saveList();
        }
    });

    $("#edit").click(function () {
        $("#addContactHeader").text("Edit Contact");
        $("#update").text("Update");
        var e = getContactFromDisplayName(selectedContact);
        displayContact(e);
    })
    $("#update").click(function () {
        if (selectedContact === "") {
            addNewContact();
        } else {
            updateContact();
        }
        displayContactList("#list");
        saveList();
    });

});
$(document).on('click', "#list li", function () {
    selectedContact = contacts[$(this).index()].name;
    displayContactDetails(contacts[$(this).index()]);
});

function init() {
    loadList();
    displayContactList("#list");
}

var Contact = function (name, mobile, email, gender) {
    this.name = name;
    this.mobile = mobile;
    this.email = email;
    this.gender = gender;
}
var contacts = [];		// Start with a simple array

function addContact(name, mobile, email, gender) {
    var e = new Contact(name, mobile, email, gender);
    contacts.push(e);
    sortEntries();
    return e;
}

function removeContact(name) {
    var pos = -1, index, contact = null;
    for (index = 0; index < contacts.length; index += 1) {
        if (name === contacts[index].name) {
            pos = index;
            break;
        }
    }
    if (pos > -1) {
        contact = contacts[pos];
        contacts.splice(pos, 1);
    }
    return contact;
}

function sortEntries() {
    contacts.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return contacts;
}

function contactList() {
    var index, list = "";
    for (index = 0; index < contacts.length; index += 1) {
        list += `<li>
                <a href="#contactDetails" >
                    <img src="contact.jpg" style="background-color:transparent; border-radius: 50%; padding-left: 10px; padding-top: 3px; height: 90%;" >
                    <h1>${contacts[index].name}</h1>
                    <p> ${contacts[index].email} </p>
                </a>
                <a href="tel:${contacts[index].mobile}" class="ui-icon-phone" style="background-color: #43d1af; width: 75px; border-top-left-radius:25%; border-bottom-left-radius: 25%;">
                </a>
             </li>`
    }
    return list;
}

function displayContactList(listElement) {
    $(listElement).html(contactList()).listview('refresh');
    return $(listElement);
}

function getContactFromDisplayName(displayName) {
    var index, e;
    for (index = 0; index < contacts.length; index += 1) {
        if (contacts[index].name === displayName) {
            return contacts[index];
        }
    }
    return null;
}

function displayContact(e) {
    $("#fullname").val(e.name);
    $("#mobile").val(e.mobile);
    $("#email").val(e.email);
    $("#gender").val(e.gender);
    $("#email").val(e.email);	
    $("#gender").val(e.gender).change();
    $("#name").text(e.name);
}

function displayContactDetails(e) {
    $("#contactName").html("" + e.name);
    $("#telephone").attr("href", "tel:" + e.mobile);
}

function updateContact() {
    var e = getContactFromDisplayName(selectedContact);
    e.name = $("#fullname").val();
    e.mobile = $("#mobile").val();
    e.email = $("#email").val();
    e.gender = $("#flip2").val();
    e.gender = $("#gender").val();
}

function addNewContact() {
    var name = $("#fullname").val(),
        mobile = $("#mobile").val(),
        email = $("#email").val(),
		gender = $("#gender").val();
    if (name !== "") {
        return addContact(name, mobile, email, gender);
    } else {
        return null;
    }
}

function saveList() {
    var strList = JSON.stringify(contacts);
    localStorage.phoneBook = strList;
}

function loadList() {
    var strList;
    strList = localStorage.phoneBook;
    if (strList) {
        contacts = JSON.parse(strList);
        var proto = new Contact();
        for (e in contacts) {
            contacts[e].__proto__ = proto;
        }
    } else {
        contacts = [];
    }
}