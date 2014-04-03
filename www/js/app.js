function load_default_words() {
    if (!localStorage["word_imported"]) {
        var default_words = ["halo", "word", "dysprosium", "love", "cesium", "love", "daisy", "Capella"]
        localStorage["words"] = default_words
    }
}

function refresh_word_list() {
    var words = localStorage["words"].split(",")
    var word_list_html = ""
    for (var i in words) {
        word_list_html += '<li><a class="word-link" href="#"><p>' + words[i] + '</p></a></li>\n'
    }
    $("#word-list").html(word_list_html)
}

function in_word_list(word) {
    var words = localStorage["words"].split(",")
    return words.indexOf(word) > -1;
}

function refresh_add_button(word) {
    if (in_word_list(word)) {
        $("#add").html("Remove From Word List")
    }
    else {
        $("#add").html("Add to Word List")
    }
}

function add(word) {
    var words = localStorage["words"].split(",")
    words.push(word)
    localStorage["words"] = words
}

function remove(word) {
    var words = localStorage["words"].split(",")
    var index = words.indexOf(word)
    if (index > -1) {
        words.splice(index, 1)
    }
    localStorage["words"] = words
}

function toggle(word) {
    if (in_word_list(word)) {
        remove(word)
    }
    else {
        add(word)
    }
}

window.onload = function () {
    var UI = new UbuntuUI()
    UI.init()

    on_resize()
    $(window).resize(on_resize)

    function on_resize() {
        $("#word").width($(window).width() - 32);
    }

    load_default_words()
    refresh_word_list()

    var current_word = "halo:home"

    function query(word) {
        current_word = word
        UI.pagestack.push("word-page")
        $("#maindef").html("Loading...")

        get_youdao(word)

        get_webster(word, function(html) {
            $("#maindef").html(html)

            $(".pronounce").click(function() {
                $("audio", this)[0].play()
            })
        })

        refresh_add_button(word)
    }

    $(".word-link").click(function(event) {
        query($(this).text())
    })

    $("#query").submit(function(event) {
        query($("#word").val())
        return false
    })

    $("#add").click(function(event) {
        toggle(current_word)
        refresh_word_list()
        refresh_add_button(current_word)
    })


    document.addEventListener("deviceready", function() {
        console.log('Platform layer API ready')
    }, false)
}
