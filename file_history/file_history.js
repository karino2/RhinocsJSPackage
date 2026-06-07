(function() {

function CreateFileUriDB(jsonName) {
    return {
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

        jsonPath() {
            return join_path(get_per_device_storage(), "/file_history/", jsonName);
        },

        save() {
            let json = JSON.stringify(this.items);
            write_file(json, this.jsonPath());
        },

        load() {
            let json = read_file(this.jsonPath());
            if (json != "") {
                this.items = JSON.parse(json);
            }
        },
    };
}

//
// find_fileのフックとlist_historyの実装
//

let fileHistory = CreateFileUriDB("file_history.json");
fileHistory.load();

g_hooks.addHook("find_file_hook", (file)=> {
   fileHistory.push(file.getUri(), file.getName());
});

function list_history() {
    let buf = get_buffer_create("*file history*");
    set_buffer(buf);
    delete_region(0, point_max());
    insert("File History:\n\n");
    // 表示・選択対象は先頭10件までにする
    let displayed = fileHistory.items.slice(0, 10);
    displayed.forEach((item, index) => {
        insert(`${index}: ${item.fname}\n  (${item.uri})\n`);
    });
    beginning_of_buffer();
    read_key("Choose file: ").then(key=> {
        if (key >= '0' && key <= '9') {
            let index = parseInt(key);
            if (index < displayed.length) {
                let item = displayed[index];
                fileHistory.push(item.uri, item.fname); // Move to top
                open_uri(item.uri);
                return;
            }
        }
        message("Invalid selection: " + key);
    });
}

global.list_history = list_history;

/*
  filerの実装。

  登録されたdirからファイルを探す。
*/

let dirDB = CreateFileUriDB("filer_dir.json");
dirDB.load();

dirDB.lastUri = function() {
    return this.items.length == 0 ? undefined : this.items[0].uri;
}

function filer_register_dir() {
    select_open_dir(dirDB.lastUri()).then(dir=>{
        dirDB.push(dir.getUri(), dir.getName());
        show_toast("Registerd: " + dir.getName());
    });
}

function filer_find_from_last_dir() {
    let lastUri = dirDB.lastUri();
    if(!lastUri) {
        show_toast("No dir selected.");
        return;
    }

    let dir = open_dir(lastUri);
    let files = dir.listFiles();
    files = to_js_array(files);
    files.sort((a, b) => {
        return a.getLastModified() - b.getLastModified();
    });
    let fnames = files.map( f=> f.getName() );
    read_filtering_list(fnames)
      .then(n=> {
        let index = fnames.indexOf(n);
        find_file_ff(files[index]);
    });
}

function filer_find_dir_and_file() {
    let dirs = dirDB.items;
    let dirNames = dirs.map(d=>d.fname);
    read_filtering_list(dirNames)
        .then(n=> {
            let index = dirNames.indexOf(n);
            let dir = dirs[index];
            dirDB.push(dir.uri, dir.fname);
            filer_find_from_last_dir();
        });
}

global.filer_register_dir = filer_register_dir;
global.filer_find_from_last_dir = filer_find_from_last_dir;
global.filer_find_dir_and_file = filer_find_dir_and_file;


})();
