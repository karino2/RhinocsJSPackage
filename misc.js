
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

read_filtering_list(["abc", "abcab", "abcad", "abd", "dabc", "ddd", "abcad"]).then({index, name}=>print(name))


read_string("Hoge: ").then((str)=>{show_toast(str)});



select_open_file(["*/*"]).then(([uri, fname])=>print(`${uri}, ${fname}`));

var buf = get_buffer_create("*tmp*");
print(buf.name)