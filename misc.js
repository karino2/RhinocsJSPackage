let buf = get_buffer_create("*scratch*");
switch_to_buffer(buf);

// eval_region用
set_device_id("BOOX");
set_device_id("MotoG53y");
message(get_device_id());


read_string("Hoge: ").then((str)=>{show_toast(str)});



select_file(["*/*"]).then(([uri, fname])=>print(`${uri}, ${fname}`));

var buf = get_buffer_create("*tmp*");
print(buf.name)