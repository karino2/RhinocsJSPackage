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
        if (json) {
            this.items = JSON.parse(json);
        }
    },
};

history.load();

function find_file_with_history() {
   // print("find file with history");
   select_file(["*/*"]).then(([uri, fname])=> {
    history.push(uri, fname);
    open_uri(uri);
   });
}

function list_history() {
    let buf = get_buffer_create("*file history*");
    set_buffer(buf);
    delete_region(0, point_max());
    insert("File History:\n\n");
    history.items.forEach((item, index) => {
        insert(`${index}: ${item.fname}\n  (${item.uri})\n`);
    });
    read_key("Choose file: ").then(key=> {
        // print("key: " + key);
        if (key >= '0' && key <= '9') {
            let index = parseInt(key);
            if (index < history.items.length) {
                let item = history.items[index];
                history.push(item.uri, item.fname); // Move to top
                open_uri(item.uri);
                return;
            }
        }
        message("Invalid selection: " + key);
    });
}

global_set_key(["C-x", "C-f"], find_file_with_history);
global_set_key(["C-x", "C-h"], list_history);


})();

// write_file("Hello, World", join_path(get_per_device_storage(), "/file_history/data/test2.txt"));