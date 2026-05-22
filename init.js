print("init js loading.");
// request_load_js("/skk/skk_all.js");
request_load_js("/file_history/file_history.js");
global_set_key(["C-x", "C-j"], () => {
    request_load_js("/skk/skk_all.js", ()=> {
        g_skk.toggleEnableSKK();
    });
});