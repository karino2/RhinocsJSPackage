load_js("/file_history/file_history.js");

// skk_all.jsは時間がかかるのでlazyにロード
// load_js("/skk/skk_all.js");
global_set_key(["C-x", "C-j"], () => {
    show_toast("Loading SKK...");
    load_js("/skk/skk_all.js").then(()=> {
        g_skk.toggleEnableSKK();
    });
});