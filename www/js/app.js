/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */
window.onload = function () {
    var UI = new UbuntuUI()
    UI.init()

    if (!localStorage["word_imported"]) {
        var default_words = ["halo", "miaow", "caesium", "love", "dysprosium", "Iridium", "daisy", "Ubuntu", "Capella"]
        localStorage["words"] = default_words
    }

    var words = localStorage["words"].split(",")
    console.log(words)
    var word_list_html = ""
    for (var i in words) {
        word_list_html += '<li><a class="word-link" href="#"><p>' + words[i] + '</p></a></li>\n'
    }
    $("#word-list").html(word_list_html)

    function query(word) {
        console.log(word)
        UI.pagestack.push("word-page")
        $("#definition").html(word)
    }

    $(".word-link").click(function(event) {
        query($(this).text())
    })

    $("#query").submit(function(event) {
        query($("#word").val())
        return false
    })


    document.addEventListener("deviceready", function() {
        console.log('Platform layer API ready')
    }, false)
}
