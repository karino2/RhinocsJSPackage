/**
 * @typedef {Function} execute_command
 * 
 * globalのメソッドで末尾が_cmdで終わっているものの一覧を表示し、
 * 絞り込み検索して選択したコマンドを実行する。
 */

(function() {

function enumerate_command_names() {
    /*
    globalのメソッドで末尾が_cmdで終わっているものの一覧を返す。
    _cmdは取り除く。
    ["reload_cmd", "switch_to_buffer", "calendar_cmd"] => ["reload", "switch_to_buffer", "calendar"]
    */
    let names = Object.getOwnPropertyNames(global);
    let cmdNames = names.filter(name => name.endsWith("_cmd"));
    return cmdNames.map(name => name.slice(0, -4));
}

/**
 * globalのメソッドで末尾が_cmdで終わっているものの一覧を表示し、
 * 選択したコマンドを実行する。
*/
function execute_command() {
    let cmdNames = enumerate_command_names();
    read_filtering_list(cmdNames)
        .then(({index, name})=> {
            let cmdName = name + "_cmd";
            let cmd = global[cmdName];
            if (typeof cmd === "function") {
                cmd();
            } else {
                message("Command not found: " + cmdName);
                console.log("Command not found: " + cmdName);
            }
        });
}


global.execute_command = execute_command;

})();
