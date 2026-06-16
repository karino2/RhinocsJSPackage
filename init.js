load_js("/filer/filer.js").then(() => {
    global_set_key(["C-x", "C-h"], filer_find_from_history);
    global_set_key(["C-x", "C-d", "f"], filer_find_from_last_dir);
    global_set_key(["C-x", "C-d", "d"], filer_find_dir_and_file);
    global_set_key(["C-x", "C-d", "r"], filer_register_dir);

});

load_js("/calendar/calendar.js");

// skk_all.jsは時間がかかるのでlazyにロード
global_set_key(["C-x", "C-j"], () => {
    show_toast("Loading SKK...");
    load_js("/skk/skk_all.js").then(()=> {
        global_set_key(["C-x", "C-j"], () => {
            toggleSKK();
        });
        global_mini_set_key(["C-x", "C-j"], () => {
            toggleSKK();
        });
        toggleSKK();
    });
});

/*
  ここより下は私が個人的に使うコマンドなど。
  本来は公開用レポジトリからは分けるべきものだが、他のユーザーが増えてくるまでは気にせずここに書いてしまう。
*/

function today() {
    let date = new Date();
    let weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    let yyyy = date.getFullYear();
    let mm = ("0" + (date.getMonth() + 1)).slice(-2);
    let dd = ("0" + date.getDate()).slice(-2);
    let ddd = weekdays[date.getDay()];

    let formatted = yyyy + "-" + mm + "-" + dd + " (" + ddd + ")";

    insert(formatted);
}

function blog() {
    read_string("blog fname: ")
      .then(fsym=> {
        const date = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD
        const filename = `${date}-${fsym}.md`;
        return select_new_file(filename)
      })
      .then(ff=>{
        let buf = generate_new_buffer(ff.getName());
        set_buffer(buf);
        insert(`---
title: NewTitle
layout: page
---
`);
        set_buffer_url(buf, ff.getUri());
        save_buffer();
      });
}