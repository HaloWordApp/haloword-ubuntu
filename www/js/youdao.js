const YOUDAO_API_KEYFROM = "HaloWordDictionary";
const YOUDAO_API_KEY = "1311342268";
var youdao_url = "http://fanyi.youdao.com/fanyiapi.do?keyfrom=" + YOUDAO_API_KEYFROM + "&key=" + YOUDAO_API_KEY + "&type=data&doctype=json&version=1.1&q=";

function get_youdao(word) {
    $("#extradef .phonetic").html("<span>ˈləʊdɪŋ</span>");
    $("#extradef .content").html("<p>loading...</p>");

    $.ajax({
        url: youdao_url + word,
        dataType: "json",
        success: function(data) {
            var def = "", i;
            if (data.errorCode === 0) {
                $("#extradef .from").html("Youdao");
                $("#extradef .from").attr("href", "http://dict.youdao.com/");
                if (data.basic) {
                    if (data.basic.phonetic) {
                        $("#extradef .phonetic").html("<span>" + data.basic.phonetic + "</span>");
                        $("#extradef .phonetic").show();
                    }
                    else {
                        $("#extradef .phonetic").hide();
                    }

                    for (i in data.basic.explains) {
                        def += "<p>" + data.basic.explains[i] + "</p>";
                    }
                    $("#extradef .content").html(def);
                }
                else if (data.translation) {
                    for (i in data.translation) {
                        def += "<p>" + data.translation[i] + "</p>";
                    }
                    $("#extradef .phonetic").hide();
                    $("#extradef .content").html(def);
                }
                else {
                    // no definition and translation
                    $("#extradef").hide();
                }
            }
            else {
                $("#extradef").hide();
            }
        },
        error: function(data) {
            $("#extradef").hide();
        }
    });
}
