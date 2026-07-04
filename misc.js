
global_set_key("C-s", isearch_forward);
global_set_key("C-r", isearch_backward);

load_js("/calendar/calendar.js");

calendar()


let buf = get_buffer_create("*scratch*");
set_buffer(buf);

// eval_region用
set_device_id("BOOX");
set_device_id("MotoG53y");
message(get_device_id());

read_filtering_list(["1abc", "2abcab", "abcad", "abd", "dabc", "ddd", "abcad"]).then({index, name}=>print(name))


read_string("Hoge: ").then((str)=>{show_toast(str)});



select_open_file(["*/*"]).then(([uri, fname])=>print(`${uri}, ${fname}`));

var buf = get_buffer_create("*tmp*");
print(buf.name)

String(get_rhinocs().getLogBuffer().toString())

test

let buf = selected_buffer();
let url = buf.url;
buf.name
misc.js

new FastFile(url)
url
content://com.android.externalstorage.documents/tree/primary%3ASyncthingDir%2FRhinocs/document/primary%3ASyncthingDir%2FRhinocs%2Fmisc.js



[[サーフィン]]
let test = "hogeika.md"



test.replace(/\.md$/, "")
hogeika

test
