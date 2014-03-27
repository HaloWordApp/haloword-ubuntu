function get_webster(word, callback) {
    $.ajax({
        url: "http://halo.xhacker.im/webster/query/" + word,
        dataType: "xml",
        success: function(data) {
            var entry_list = $(data).find("entry_list")
            var entries = entry_list.find("entry")

            if (entries.length === 0) {
                callback("")
            }

            var html = ""

            entries.each(function() {
                var def_list = []
                var sub_list = []
                var in_sub_list = false
                $($(this).children("def")[0]).children().each(function() {
                    if ($(this).is("sn")) {
                        var sn = $(this).text()
                        if (/^[a-zA-Z]+$/.test(sn)) {
                            // a
                            in_sub_list = true
                        }
                        else if (!isNaN(sn)) {
                            // 1
                            in_sub_list = false
                            if (sub_list.length > 0) {
                                def_list[def_list.length-1]["sub"] = sub_list
                                sub_list = []
                            }
                        }
                        else {
                            var segments = sn.split(" ")
                            if (segments.length > 1 && !isNaN(segments[0]) && /^[a-zA-Z]+$/.test(segments[1])) {
                                // 1 a
                                if (sub_list.length > 0) {
                                    def_list[def_list.length-1]["sub"] = sub_list
                                    sub_list = []
                                }

                                def_list.push({})
                                in_sub_list = true
                            }
                        }
                    }
                    else if ($(this).is("dt")) {
                        function xml_to_html(xml) {
                            var html = ""

                            var tagName = $(xml).prop("tagName")
                            if (tagName) {
                                html += '<span class="mw-' + tagName + '">'
                            }

                            if ($(xml).contents().length == 0) {
                                html += $(xml).text()
                            }
                            else {
                                $(xml).contents().each(function() {
                                    html += xml_to_html(this)
                                })
                            }

                            if (tagName) {
                                html += '</span>'
                            }

                            return html
                        }

                        var content = xml_to_html(this)
                        content = $(content).html().trim()
                        content = content.replace(/^:/, "")

                        if (in_sub_list) {
                            sub_list.push({"content": content})
                        }
                        else {
                            def_list.push({"content": content})
                        }
                    }
                })
                if (sub_list.length > 0) {
                    def_list[def_list.length-1]["sub"] = sub_list
                }

                var sound_html = ""
                var sound = $(this).children("sound")[0]
                if (sound) {
                    $(sound).children('wav').each(function() {
                        var filename = $(this).text()
                        sound_html += '<a class="pronounce"><audio src="http://media.merriam-webster.com/soundc11/' + filename[0] + '/' + filename + '"></audio></a>'
                    })
                    var wav = $(sound).children('wav').text()

                }

                var view = {
                    "hw": $(this).children("hw").text().replace(/\*/g, "·"),
                    "hwindex": $(this).children("hw").attr("hindex"),
                    "pr": $(this).children("pr").text().trim(),
                    "sound": sound_html,
                    "fl": $(this).children("fl").text(),
                    "def": def_list
                }
                html += Mustache.render('<div class="mw-item">\
                    <div class="mw-meta">\
                        <span class="mw-headword">\
                        {{#hwindex}}<sup>{{hwindex}}</sup>{{/hwindex}}{{hw}}\
                        </span>\
                        <span class="mw-part-of-speech">{{fl}}</span>\
                        {{#pr}}<span class="mw-pr">\\{{pr}}\\</span>{{/pr}}{{{sound}}}\
                    </div>\
                    <ol>{{#def}}\
                        <li>{{{content}}}\
                        {{#sub.length}}\
                            <ol>{{#sub}}<li>{{{content}}}</li>{{/sub}}</ol>\
                        {{/sub.length}}\
                        </li>\
                    {{/def}}</ol>\
                    </div>', view)

                callback(html)
            })
        }
    })
}
