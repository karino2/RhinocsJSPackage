(function() {


let history = {
    items: [],
    push(uri, fname) {
        let existing = this.items.find(item => item.uri == uri);
        if (!existing) {
            this.items.unshift({uri, fname});
        } else {
            this.items = this.items.filter(item => item.uri != uri);
            this.items.unshift(existing);
        }
        this.save();
    },

    historyPath() {
        return join_path(get_per_device_storage(), "/file_history/file_history.json");
    },

    save() {
        let json = JSON.stringify(this.items);
        write_file(json, this.historyPath());
    },

    load() {
        let json = read_file(this.historyPath());
        if (json != "") {
            this.items = JSON.parse(json);
        }
    },
};

history.load();

g_hooks.addHook("visit_newfile_hook", (file)=> {
   history.push(file.getUri(), file.getName());
});

function list_history() {
    let buf = get_buffer_create("*file history*");
    set_buffer(buf);
    delete_region(0, point_max());
    insert("File History:\n\n");
    // 表示・選択対象は先頭10件までにする
    let displayed = history.items.slice(0, 10);
    displayed.forEach((item, index) => {
        insert(`${index}: ${item.fname}\n  (${item.uri})\n`);
    });
    beginning_of_buffer();
    read_key("Choose file: ").then(key=> {
        if (key >= '0' && key <= '9') {
            let index = parseInt(key);
            if (index < displayed.length) {
                let item = displayed[index];
                history.push(item.uri, item.fname); // Move to top
                open_uri(item.uri);
                return;
            }
        }
        message("Invalid selection: " + key);
    });
}


global.list_history = list_history;
})();
