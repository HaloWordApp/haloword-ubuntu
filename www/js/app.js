/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */
window.onload = function () {
    var UI = new UbuntuUI();
    UI.init();

    // Wire all the simple logic
    document.getElementById('no').addEventListener('click', function() {
        UI.dialog('dialog1').hide();
    });

    function getContacts() {
        return [].slice.call(document.querySelectorAll('#contacts li'));
    };

    var contacts = getContacts();
    contacts.forEach(function (contact) {
        contact.addEventListener('click', function() {
            contact.classList.add('selected');
        });
    });

    function getSelectedContacts() {
        var selectedContactInputs = [].slice.call(document.querySelectorAll('#contacts li label input:checked'));
        return selectedContactInputs.map(function (contactInputElement) { return contactInputElement.parentNode.parentNode; });
    }

    function getContactName(contact) {
        return contact.querySelector('p').innerHTML;
    }

    function displayMessage(message) {
        document.querySelector('#dialog1 h1').innerHTML = message;
        UI.dialog('dialog1').show();
    };

    document.getElementById('call').addEventListener('click', function() {
        var sc = getSelectedContacts();
        if (! sc || sc.length !== 1) {
            displayMessage('Please select one and only one contact');
            return;
        }
        displayMessage('Calling: ' + getContactName(sc[0]));
    });

    document.getElementById('text').addEventListener('click', function() {
        var sc = getSelectedContacts();
        if (! sc || sc.length !== 1) {
            displayMessage('Please select one and only one contact');
            return;
        }
        displayMessage('Texting: ' + getContactName(sc[0]));
    });

    // Add an event listener that is pending on the initialization
    //  of the platform layer API, if it is being used.
    document.addEventListener("deviceready", function() {
        if (console && console.log)
            console.log('Platform layer API ready');
    }, false);
};

