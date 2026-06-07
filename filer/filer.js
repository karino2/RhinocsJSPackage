(function() {

function CreateFileUriDB(jsonName) {
    return {
        items: [],
        push(uri, name) {
            let existing = this.items.find(item => item.uri == uri);
            if (!existing) {
                this.items.unshift({uri, name});
            } else {
                this.items = this.items.filter(item => item.uri != uri);
                this.items.unshift(existing);
            }
            this.save();
        },

        jsonPath() {
            return join_path(get_per_device_storage(), "/filer/", jsonName);
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
    let files = fileHistory.items;
    let fnames = files.map(d=>d.name);
    read_filtering_list(fnames)
        .then(({index})=> {
            let item = files[index];
            fileHistory.push(item.uri, item.name);
            open_uri(item.uri);
        });
}

global.filer_find_from_history = list_history;

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
        return b.getLastModified() - a.getLastModified();
    });
    let fnames = files.map( f=> f.getName() );
    read_filtering_list(fnames)
      .then(({index, name})=> {
        find_file_ff(files[index]);
    });
}

function filer_find_dir_and_file() {
    let dirs = dirDB.items;
    let dirNames = dirs.map(d=>d.name);
    read_filtering_list(dirNames)
        .then(({index})=> {
            let dir = dirs[index];
            dirDB.push(dir.uri, dir.name);
            filer_find_from_last_dir();
        });
}

global.filer_register_dir = filer_register_dir;
global.filer_find_from_last_dir = filer_find_from_last_dir;
global.filer_find_dir_and_file = filer_find_dir_and_file;


})();
