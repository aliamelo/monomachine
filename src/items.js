const fs = require("fs");
const item_list = JSON.parse(fs.readFileSync("data/items.json"));

module.exports = {
    display: function(channel) {

        for (var item in item_list)
            channel.send(item_list[item]);
    }
}
