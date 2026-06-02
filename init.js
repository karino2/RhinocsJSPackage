load_js("/file_history/file_history.js").then(() => {
    global_set_key(["C-x", "C-h"], () => {
        list_history();
    });
});

// skk_all.jsは時間がかかるのでlazyにロード
global_set_key(["C-x", "C-j"], () => {
    show_toast("Loading SKK...");
    load_js("/skk/skk_all.js").then(()=> {
        global_set_key(["C-x", "C-j"], () => {
            toggleSKK();
        });
        global_mini_set_key(["C-x", "C-j"], () => {
          toggleMiniBufferSKK();
        });
        toggleSKK();
    });
});


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